
extern crate dotenv;
extern crate serde_json;

#[allow(unused_imports)]
use std::env;
#[allow(unused_imports)]
use actix_web::{web, HttpResponse, Responder, Error};
#[allow(unused_imports)]
use bson::{doc, Bson};
#[allow(unused_imports)]
use futures::TryFutureExt;
use futures::stream::StreamExt;
#[allow(unused_imports)]
use mongodb::{options::FindOptions, Client};
#[allow(unused_imports)]
use std::sync::Mutex;
#[allow(unused_imports)]
use chrono::prelude::*;
#[allow(unused_imports)]
use serde::{Deserialize, Serialize};
#[allow(unused_imports)]
use serde_json::Result;
#[allow(unused_imports)]
use mysql::*;
use mysql::prelude::*;

#[allow(unused_imports)]
use serde_json::json;

#[allow(non_snake_case)]
#[allow(non_camel_case_types)]
#[derive(Serialize)]
struct respuesta {
    status: u32,
    Mensaje: String
}


#[derive(Debug, Serialize, Deserialize)]
pub struct NewTweet {
    pub nombre: String,
    pub comentario: String,
    pub fecha: String,
    pub hashtags: Vec<String>,
    pub upvotes: u32,
    pub downvotes: u32
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewTweetSQL {
    pub nombre: String,
    pub comentario: String,
    pub fecha: String,
    pub hashtags: String,
    pub upvotes: u32,
    pub downvotes: u32
}

#[allow(non_snake_case)]
#[derive(Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct Tweet {
    pub idTweet: u32,
    pub nombre: String,
    pub comentario: String,
    pub fecha: String,
    pub hashtags: String,
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

#[allow(unused_must_use)]
async fn add_tweet(data: web::Data<Mutex<Client>>, new_tweet: web::Json<NewTweet>) -> impl Responder {
    
    let mut status = 202;
    let mut mensaje = "Nuevo elemento insertado correctamente desde Rust! :D";

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

            return web::Json(respuesta {
                status: status,
                Mensaje: mensaje.to_string()
            });

        }}

        let sql_nombre = &*new_tweet.nombre;
        let sql_fecha = &*new_tweet.fecha;
        let sql_comentario = &*new_tweet.comentario;
        let sql_upvotes = new_tweet.upvotes;
        let sql_downvotes = new_tweet.downvotes;
        let sql_hashtags = &*new_tweet.hashtags;

        let mut cadena_hashtags = "".to_string();
        let mut contador = 0;
        for hash in sql_hashtags{
            if contador == 0 {
                cadena_hashtags = hash.to_string();
                contador = contador + 1;
            }else {
                cadena_hashtags = format!("{},{}",cadena_hashtags,hash.to_string());
                contador = contador + 1;
            }            
        } 
        
        let cloudsql_host = env::var("CLOUDSQL_HOST").unwrap();
        let cloudsql_pass = env::var("CLOUDSQL_PASS").unwrap();
        let cloudsql_user = env::var("CLOUDSQL_USER").unwrap();
        let cloudsql_dbname = env::var("CLOUDSQL_DBNAME").unwrap();
        let cloudsql_port = env::var("CLOUDSQL_PORT").unwrap();
        let connection_url = format!("mysql://{}:{}@{}:{}/{}",cloudsql_user, cloudsql_pass, cloudsql_host, cloudsql_port,cloudsql_dbname);  

        let opts = Opts::from_url(&connection_url.to_owned()).unwrap();
        let pool = Pool::new(opts).unwrap();
        let mut conn = pool.get_conn().unwrap();

        let tweet_to_insert = vec![
        NewTweetSQL {
            nombre: sql_nombre.to_owned(), 
            comentario: sql_comentario.to_owned(), 
            fecha: sql_fecha.to_owned(),
            hashtags: cadena_hashtags.to_owned(),
            upvotes: sql_upvotes.to_owned(),
            downvotes: sql_downvotes.to_owned()}
    ];

    // Now let's insert payments to the database
    conn.exec_batch(
        r"INSERT INTO TWEET (nombre, comentario, fecha, hashtags, upvotes, downvotes)
        VALUES (:nombre, :comentario, :fecha, :hashtags, :upvotes, :downvotes)",
        tweet_to_insert.iter().map(|t| params! {
            "nombre" => &t.nombre,
            "comentario" => &t.comentario,
            "fecha" => &t.fecha,
            "hashtags" => &t.hashtags,
            "upvotes" => &t.upvotes,
            "downvotes" => &t.downvotes,
        })
    );

        return web::Json(respuesta {
            status: status,
            Mensaje: mensaje.to_string()
        });

}

#[allow(non_snake_case)]
async fn get_cloudsql() -> impl Responder {

    let cloudsql_host = env::var("CLOUDSQL_HOST").unwrap();
    let cloudsql_pass = env::var("CLOUDSQL_PASS").unwrap();
    let cloudsql_user = env::var("CLOUDSQL_USER").unwrap();
    let cloudsql_dbname = env::var("CLOUDSQL_DBNAME").unwrap();
    let cloudsql_port = env::var("CLOUDSQL_PORT").unwrap();
    let connection_url = format!("mysql://{}:{}@{}:{}/{}",cloudsql_user, cloudsql_pass, cloudsql_host, cloudsql_port,cloudsql_dbname);  

    let opts = Opts::from_url(&connection_url.to_owned()).unwrap();
    let pool = Pool::new(opts).unwrap();
    let mut conn = pool.get_conn().unwrap();

    // Let's select payments from database. Type inference should do the trick here.
    let selected_tweets = conn
    .query_map(
        "SELECT * from TWEET",
        |(idTweet, nombre, comentario, fecha, hashtags, upvotes, downvotes)| {
            Tweet { idTweet, nombre, comentario, fecha, hashtags, upvotes, downvotes}
        },
    );

    let mut results= Vec::new();
    for x in selected_tweets {
       for i in x{
           results.push(i);       
       }      
    }

    HttpResponse::Ok().json(results)

    //format!("{:?}",selected_tweets.unwrap());
    //let json_tweet = json!(selected_tweets.or(Err("")));
    //format!("{:?}",serde_json::to_string_pretty(&json_tweet));
    //let json_formateado =serde_json::to_string_pretty(&json_tweet);
    //Ok(HttpResponse::Ok().json(json_tweet)); 
    //Err(HttpResponse::InternalServerError().finish());
    
    }

    
    
