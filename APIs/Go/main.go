package main

import (
	"database/sql"
	_"encoding/json"
	"log"
	"net/http"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"context"
	"time"
	_"os"
	
	"github.com/gorilla/mux"
    _"github.com/go-sql-driver/mysql"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"github.com/joho/godotenv"
)

type tweet struct {
	Nombre    string `json:"nombre"`
	Comentario string `json:"comentario"`
	Fecha string `json:"fecha"`
	Hashtags []string `json:"hashtags"`
	Upvotes int `json:"upvotes"`
	Downvotes int `json:"downvotes"`
}

func conexionGoogleCloud()(conexion *sql.DB){

	envs, err := godotenv.Read(".env")
	if err != nil {
        log.Fatal("Error loading .env file")
    }

	Driver:=envs["DRIVER"]
	Usuario:=envs["USUARIO"]
	Contrasena:=envs["CONTRASENA"]
	Nombre:=envs["NOMBRE"]
	Ip:=envs["IP"]

	conexion,err2:= sql.Open(Driver, Usuario+":"+Contrasena+"@tcp("+Ip+")/"+Nombre)
	if err2 != nil{
		panic(err.Error())
	}
	return conexion;
}

func createTweetGoogleCloud(newTweet tweet){

	cadenaHashtags := "";

	for i , v := range newTweet.Hashtags {
		cadenaHashtags = cadenaHashtags +  v
		if i != len(newTweet.Hashtags)-1{
			cadenaHashtags = cadenaHashtags + ","
		}
	}

	conexion :=  conexionGoogleCloud()
	insertarRegistros, err := conexion.Prepare("INSERT INTO TWEET(nombre, comentario, fecha, hashtags, upvotes, downvotes) VALUES (?, ?, ?, ?, ?, ?)")

	if err != nil{
		panic(err.Error())
	}

	insertarRegistros.Exec(newTweet.Nombre, newTweet.Comentario, newTweet.Fecha, cadenaHashtags, newTweet.Upvotes, newTweet.Downvotes);
}

func loadEnv(){
	err:= godotenv.Load(".env")
	if err != nil{
		panic(err.Error())
	}
}

/*func conexionCosmosSql(){

	driver := "gocosmos"
	dsn := "AccountEndpoint=https://98f82489-0ee0-4-231-b9ee.documents.azure.com/;AccountKey=DJf7JDRY4WnlUetsuYgb3lwJlWQEOuRkYEQFv8kFN0rdHQUDXjU5YwxGqAaAOAb2zyv6w3OZImT9nHIWykkYKQ=="
	db, err := sql.Open(driver, dsn)
	if err != nil {
		panic(err)
	}
	

	sql := `INSERT INTO SOPES1.TWEET (nombre, comentario, fecha, hashtags, upvotes, downvotes) VALUES("\"Santizo\"","\"Test de golang a cosmos\"","\"30/08/2021\"","\"hg1,hg2\"",50,60)`
	result, err := db.Exec(sql,"mypk")
	if err != nil {
		panic(err)
	}

	numRows, err := result.RowsAffected()
	if err != nil {
		panic(err)
	}
	fmt.Println("Number of rows affected:", numRows)

	defer db.Close()
	}*/


func conexionCosmos()*mongo.Client{
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

	return c;
}


func createTweetCosmos(newTweet tweet){
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

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newTweet)
}





func main() {
	//conexionCosmosSql()
    router := mux.NewRouter().StrictSlash(true)

	//router.HandleFunc("/", indexRoute)
	//router.HandleFunc("/tasks", createTask).Methods("POST")
	router.HandleFunc("/tweet", crearTweet).Methods("POST")
	//router.HandleFunc("/tasks/{id}", getOneTask).Methods("GET")
	//router.HandleFunc("/tasks/{id}", deleteTask).Methods("DELETE")
	//router.HandleFunc("/tasks/{id}", updateTask).Methods("PUT")
	fmt.Println("Golang server on port: 4000")
	log.Fatal(http.ListenAndServe(":4000", router))
}