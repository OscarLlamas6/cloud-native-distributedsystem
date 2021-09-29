package publicar

import (
	"context"
	"database/sql"
	"encoding/json"
	_ "encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	_ "os"
	"time"

	"os"

	_ "github.com/go-sql-driver/mysql"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func crearTweet(w http.ResponseWriter, r *http.Request) {

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

	var newTweet tweet
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Fprintf(w, "Insert a Valid Client Data")
	}

	json.Unmarshal(reqBody, &newTweet)

	/*--------CREAR TWEET SQL--------*/

	cadenaHashtags := ""

	for i, v := range newTweet.Hashtags {
		cadenaHashtags = cadenaHashtags + v
		if i != len(newTweet.Hashtags)-1 {
			cadenaHashtags = cadenaHashtags + ","
		}
	}

	Driver := os.Getenv("DRIVER")
	Usuario := os.Getenv("USUARIO")
	Contrasena := os.Getenv("CONTRASENA")
	Nombre := os.Getenv("NOMBRE")
	Ip := os.Getenv("IP")

	conexion, err2 := sql.Open(Driver, Usuario+":"+Contrasena+"@tcp("+Ip+")/"+Nombre)
	if err2 != nil {
		panic(err.Error())
	}

	insertarRegistros, err := conexion.Prepare("INSERT INTO TWEET(nombre, comentario, fecha, hashtags, upvotes, downvotes) VALUES (?, ?, ?, ?, ?, ?)")

	if err != nil {
		panic(err.Error())
	}

	insertarRegistros.Exec(newTweet.Nombre, newTweet.Comentario, newTweet.Fecha, cadenaHashtags, newTweet.Upvotes, newTweet.Downvotes)

	/*-------------------------------------*/

	/*-----------  CREAR TWEET COSMOS-------------*/
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

	cosmoskey := os.Getenv("COSMOSKEY")
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

	ctx2 := context.Background()
	defer c.Disconnect(ctx)

	todoCollection := c.Database("SOPES1").Collection("TWEET")
	r2, err := todoCollection.InsertOne(ctx2, newTweet)
	if err != nil {
		log.Fatalf("failed to add todo %v", err)
	}
	fmt.Println("added todo", r2.InsertedID)

	/*----------------------------------------------*/

	var newMensaje mensaje
	newMensaje.Mensaje = "Nuevo elemento insertado correctamente desde Golang! :D"
	newMensaje.Status = 202

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newMensaje)
}
