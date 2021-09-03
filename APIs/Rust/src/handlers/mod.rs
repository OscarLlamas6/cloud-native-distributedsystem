
extern crate dotenv;
use std::env;
use actix_web::{web, HttpResponse, Responder, Error};
use bson::{doc, Bson};
use futures::stream::StreamExt;
use mongodb::{options::FindOptions, Client};
use std::sync::Mutex;
use chrono::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::Result;
use mysql::*;
use mysql::prelude::*;


#[derive(Serialize)]
struct respuesta {
    status: u32,
    mensaje: String
}


#[derive(Deserialize)]
pub struct NewTweet {
    pub nombre: String,
    pub comentario: String,
    pub fecha: String,
    pub hashtags: Vec<String>,
    pub upvotes: u32,
    pub downvotes: u32
}


pub fn scoped_config(cfg: &mut web::ServiceConfig) {


    cfg.service(
        web::resource("/getCosmos")
            .route(web::get().to(get_cosmos))
    );
    cfg.service(
        web::resource("/getCloudSQL")
            .route(web::get().to(get_cloudsql))
    );
    cfg.service(
        web::resource("/publicar")
            .route(web::post().to(add_tweet))
    );
}

async fn get_cosmos(data: web::Data<Mutex<Client>>) -> impl Responder {

    let tweets_collection = data
        .lock()
        .unwrap()
        .database(&env::var("COSMOSDB_DBNAME").unwrap())
        .collection(&env::var("COSMOSDB_COLLECTION").unwrap());
    
    let filter = doc! {};
    let find_options = FindOptions::builder().sort(doc! { "_id": -1}).build();
    let mut cursor = tweets_collection.find(filter, find_options).await.unwrap();

    let mut results = Vec::new();
    while let Some(result) = cursor.next().await {
        match result {
            Ok(document) => {
                results.push(document);
            }
            _ => {
                return HttpResponse::InternalServerError().finish();
            }
        }
    }
    HttpResponse::Ok().json(results)
}

async fn add_tweet(data: web::Data<Mutex<Client>>, new_tweet: web::Json<NewTweet>) -> impl Responder {
    
    let mut status = 202;
    let mut mensaje = "Nuevo elemento insertado correctamente! :D";

    let tweets_collection = data
        .lock()
        .unwrap()
        .database(&env::var("COSMOSDB_DBNAME").unwrap())
        .collection(&env::var("COSMOSDB_COLLECTION").unwrap());

        match tweets_collection.insert_one(doc! {
            "nombre": &new_tweet.nombre, 
            "comentario": &new_tweet.comentario, 
            "fecha": &new_tweet.fecha,
            "hashtags": &new_tweet.hashtags,
            "upvotes": &new_tweet.upvotes,
            "downvotes":&new_tweet.downvotes}, None).await {
        Ok(db_result) => {
            if let Some(new_id) = db_result.inserted_id.as_object_id() {
                println!("New document inserted with id {}", new_id);   
            }}
        Err(err) => {
            println!("Failed! {}", err);
            status = 404;
            mensaje = "Error al interactuar con CosmosDB! :(";
        }}
   
        return web::Json(respuesta {
            status: status,
            mensaje: mensaje.to_string()
        });

}

async fn get_cloudsql() -> impl Responder {

    let cloudsql_host = env::var("CLOUDSQL_HOST").unwrap();
    let cloudsql_pass = env::var("CLOUDSQL_PASS").unwrap();
    let cloudsql_user = env::var("CLOUDSQL_USER").unwrap();
    let cloudsql_dbname = env::var("CLOUDSQL_DBNAME").unwrap();
    let cloudsql_port = env::var("CLOUDSQL_PORT").unwrap();
    let connection_url = format!("mysql://{}:{}@{}:{}",cloudsql_user, cloudsql_pass, cloudsql_host, cloudsql_port); 

  
    format!("{}",connection_url)
}