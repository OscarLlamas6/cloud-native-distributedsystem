package main

import (
	"context"
	"database/sql"
	"encoding/json"
	_ "encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	_ "os"
	"time"

	"cloud.google.com/go/pubsub"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type tweet struct {
	Nombre     string   `json:"nombre"`
	Comentario string   `json:"comentario"`
	Fecha      string   `json:"fecha"`
	Hashtags   []string `json:"hashtags"`
	Upvotes    int      `json:"upvotes"`
	Downvotes  int      `json:"downvotes"`
}

type mensaje struct {
	Mensaje string `json:"Mensaje"`
	Status  int    `json:"Status"`
}

type notificacion struct {
	Guardados     int `json:"guardados"`
	TiempoDeCarga int `json:"tiempoDeCarga"`
}

func conexionGoogleCloud() (conexion *sql.DB) {

	envs, err := godotenv.Read(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	Driver := envs["DRIVER"]
	Usuario := envs["USUARIO"]
	Contrasena := envs["CONTRASENA"]
	Nombre := envs["NOMBRE"]
	Ip := envs["IP"]

	conexion, err2 := sql.Open(Driver, Usuario+":"+Contrasena+"@tcp("+Ip+")/"+Nombre)
	if err2 != nil {
		panic(err.Error())
	}
	return conexion
}

func createTweetGoogleCloud(newTweet tweet) {

	cadenaHashtags := ""

	for i, v := range newTweet.Hashtags {
		cadenaHashtags = cadenaHashtags + v
		if i != len(newTweet.Hashtags)-1 {
			cadenaHashtags = cadenaHashtags + ","
		}
	}

	conexion := conexionGoogleCloud()
	insertarRegistros, err := conexion.Prepare("INSERT INTO TWEET(nombre, comentario, fecha, hashtags, upvotes, downvotes) VALUES (?, ?, ?, ?, ?, ?)")

	if err != nil {
		panic(err.Error())
	}

	insertarRegistros.Exec(newTweet.Nombre, newTweet.Comentario, newTweet.Fecha, cadenaHashtags, newTweet.Upvotes, newTweet.Downvotes)
}

func loadEnv() {
	err := godotenv.Load(".env")
	if err != nil {
		panic(err.Error())
	}
}

func conexionCosmos() *mongo.Client {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

	envs, err := godotenv.Read(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	cosmoskey := envs["COSMOSKEY"]
	clientOptions := options.Client().ApplyURI(cosmoskey).SetDirect(true)

	c, err := mongo.NewClient(clientOptions)
	err = c.Connect(ctx)
	if err != nil {
		log.Fatalf("unable to initialize connection %v", err)
	}

	err = c.Ping(ctx, nil)
	if err != nil {
		log.Fatalf("unable to connect %v", err)
	}

	return c
}

func createTweetCosmos(newTweet tweet) {
	c := conexionCosmos()
	ctx := context.Background()
	defer c.Disconnect(ctx)

	todoCollection := c.Database("SOPES1").Collection("TWEET")
	r, err := todoCollection.InsertOne(ctx, newTweet)
	if err != nil {
		log.Fatalf("failed to add todo %v", err)
	}
	fmt.Println("added todo", r.InsertedID)
}

func crearTweet(w http.ResponseWriter, r *http.Request) {
	//enableCors(&w)

	var newTweet tweet
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Fprintf(w, "Insert a Valid Client Data")
	}

	json.Unmarshal(reqBody, &newTweet)

	//fmt.Println(newTweet.Hashtags)

	createTweetGoogleCloud(newTweet)
	createTweetCosmos(newTweet)

	var newMensaje mensaje
	newMensaje.Mensaje = "Nuevo elemento insertado correctamente desde Golang! :D"
	newMensaje.Status = 202

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newMensaje)
}

func saludo(w http.ResponseWriter, r *http.Request) {
	var newMensaje mensaje
	newMensaje.Mensaje = "Bienvenido a API Golang - SOPES1 :D!"
	newMensaje.Status = 202
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newMensaje)
}

func notificar(w http.ResponseWriter, r *http.Request) {

	envs, error := godotenv.Read(".env")
	if error != nil {
		log.Fatal("Error loading .env file")
	}

	estado := 202
	msj := ""

	credentials_path := envs["PUBSUB_KEY_PATH"]
	os.Setenv("GOOGLE_APPLICATION_CREDENTIALS", credentials_path)
	projectID := envs["PUBSUB_PROJECT"]
	topicID := envs["GOLANG_TOPIC"]

	ctx := context.Background()
	client, error2 := pubsub.NewClient(ctx, projectID)
	if error2 != nil {
		fmt.Fprintf(w, "pubsub.NewClient: %v\n", error2)
	}
	defer client.Close()

	t := client.Topic(topicID)

	var newNotificacion notificacion
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Fprintf(w, "Insert a Valid Client Data")
	}

	json.Unmarshal(reqBody, &newNotificacion)

	jsonGuardados := fmt.Sprintf("%v", newNotificacion.Guardados)
	jsonTiempo := fmt.Sprintf("%v", newNotificacion.TiempoDeCarga)

	result := t.Publish(ctx, &pubsub.Message{
		Data: []byte("Enviando una notificación desde pubsub SOPES :D!"),
		Attributes: map[string]string{
			"guardados":     jsonGuardados,
			"api":           "Golang",
			"tiempoDeCarga": jsonTiempo,
		},
	})

	id, error3 := result.Get(ctx)
	if error3 != nil {
		fmt.Printf("Error: %v", error3)
		estado = 404
		msj = "Error al interactuar con google Pub/Sub! :("
	} else {
		fmt.Printf("Nueva noticiación publicada con el id: %v", id)
		msj = fmt.Sprintf("Notificacion enviada correctamente, id %v ! :D", id)
	}

	var newMensaje mensaje
	newMensaje.Mensaje = msj
	newMensaje.Status = estado
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newMensaje)
}

func main() {

	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/", saludo).Methods("GET")
	router.HandleFunc("/publicar", crearTweet).Methods("POST")
	router.HandleFunc("/notificar", notificar).Methods("POST")
	fmt.Println("Golang server on port: 4000")
	log.Fatal(http.ListenAndServe(":4000", router))
}
