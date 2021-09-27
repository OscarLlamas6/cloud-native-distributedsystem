
extern crate actix_web;
extern crate serde_json;
extern crate dotenv;
extern crate base64;
extern crate hyper;
extern crate hyper_rustls;
extern crate google_pubsub1 as pubsub;
extern crate yup_oauth2 as oauth;
extern crate hyper_tls;
/* IMPORT PUBSUB*/

#[allow(unused_imports, deprecated)]
use std::ascii::AsciiExt;
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::default::Default;
#[allow(unused_imports)]
use hyper_rustls::HttpsConnector;

#[allow(unused_imports)]
use hyper::client::HttpConnector;
#[allow(unused_imports)]
use hyper::client::Client;
#[allow(unused_imports)]
use hyper_tls::TlsStream;

#[allow(unused_imports)]
use serde::{Deserialize, Serialize};
#[allow(unused_imports)]
use serde_json::Result;
#[allow(unused_imports)]
use serde_json::json;

use mongodb::{options::ClientOptions, bson::Document, bson::doc, options::FindOptions};
#[allow(unused_imports)]
use futures::stream::StreamExt;
#[allow(unused_imports)]
use std::sync::*;


#[allow(non_snake_case)]
#[allow(non_camel_case_types)]
#[derive(Debug, Serialize, Deserialize)]
pub struct NewNotificacion {
    pub guardados: u32,
    pub tiempoDeCarga: u32
}

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

#[allow(unused_imports)]
use mysql::*;
use mysql::prelude::*;

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

use std::{env, io};
use actix_web::{middleware, get, post, web, App, HttpServer, Responder, HttpResponse};
use oauth::ServiceAccountAuthenticator;

#[get("/")]
async fn init() -> impl Responder {
    return web::Json(respuesta {
        status: 202,
        Mensaje: "BIENVENIDO A API SOPES1 - RUST con ACTIX 4 :D".to_string()
    });
}

#[allow(non_snake_case)]
#[get("/getCosmos")]
async fn get_cosmos() -> impl Responder {

    let cosmos_url = env::var("COSMOSDB_URL").unwrap();
    let cosmos_user = env::var("COSMOSDB_USER").unwrap();
    let cosmos_pass = env::var("COSMOSDB_PASS").unwrap();
    let connection_url = format!("mongodb://{}:{}@{}.{}@{}@", cosmos_user, cosmos_pass, cosmos_user, cosmos_url, cosmos_user); 

    let mut client_options = ClientOptions::parse(&connection_url).await.unwrap();
    client_options.app_name = Some("SOPES1".to_string());
    let client = mongodb::Client::with_options(client_options).unwrap();

    let db = client.database(&env::var("COSMOSDB_DBNAME").unwrap());

    let collection = db.collection::<Document>(&env::var("COSMOSDB_COLLECTION").unwrap());

    let filter = doc! {};
    let find_options = FindOptions::builder().sort(doc! { "_id": -1}).build();
    let mut cursor = collection.find(filter, find_options).await.unwrap();

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

#[allow(non_snake_case)]
#[get("/getCloudSQL")]
pub async fn get_cloudsql() -> impl Responder {
   
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

}

#[allow(non_snake_case)]
#[allow(unused_must_use)]
#[post("/publicar")]
pub async fn add_tweet(new_tweet: web::Json<NewTweet>) -> impl Responder {

    let mut status = 202;
    let mut mensaje = "Nuevo elemento insertado correctamente desde Rust! :D";

    let cosmos_url = env::var("COSMOSDB_URL").unwrap();
    let cosmos_user = env::var("COSMOSDB_USER").unwrap();
    let cosmos_pass = env::var("COSMOSDB_PASS").unwrap();
    let connection_url = format!("mongodb://{}:{}@{}.{}@{}@", cosmos_user, cosmos_pass, cosmos_user, cosmos_url, cosmos_user); 

    let mut client_options = ClientOptions::parse(&connection_url).await.unwrap();
    client_options.app_name = Some("SOPES1".to_string());
    let client = mongodb::Client::with_options(client_options).unwrap();

    let db = client.database(&env::var("COSMOSDB_DBNAME").unwrap());

    let collection = db.collection::<Document>(&env::var("COSMOSDB_COLLECTION").unwrap());

    match collection.insert_one(doc! {
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
   let operacion = conn.exec_batch(
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

    match operacion {
        Ok(()) => {
            return web::Json(respuesta {
                status: status,
                Mensaje: mensaje.to_string()
            });
    
        },
        Err(err) => {
            println!("Failed! {}", err);
            status = 404;
            mensaje = "Error al interactuar con CloudSQL! :(";
            return web::Json(respuesta {
                status: status,
                Mensaje: mensaje.to_string()
            });    
        },
    }
}


#[allow(non_snake_case)]
#[allow(unused_must_use)]
#[post("/notificar")]
pub async fn notificar(new_notificacion: web::Json<NewNotificacion>) -> impl Responder {

    let TOPIC_NAME = env::var("TOPIC_NAME").unwrap();
    let guardados_req = new_notificacion.guardados;
    let tiempo_req = new_notificacion.tiempoDeCarga;
    let mut status = 202;
    let mut mensaje: String= "".to_string();
    let mut id: String;

    let https = hyper_rustls::HttpsConnector::with_native_roots();
    let cliente = hyper::Client::builder()
    .build::<_, hyper::Body>(https);

    let creds = yup_oauth2::read_service_account_key("auth.json")
    .await
    .unwrap();

    println!("Se seteo la cuenta de servicio, el mail es: {}", creds.client_email);

    let sa: yup_oauth2::authenticator::Authenticator<hyper_rustls::HttpsConnector<hyper::client::HttpConnector>> = ServiceAccountAuthenticator::builder(creds)
    .build().await.unwrap();
   
    let hub = pubsub::Pubsub::new(cliente, sa);
    let methods = hub.projects();
    let message = "Enviando una notificacion desde pubsub SOPES :D!".to_string();
    
    let mut atributos  = HashMap::new();
    atributos.insert("guardados".to_string(), guardados_req.to_string());
    atributos.insert("api".to_string(), "Rust".to_string());
    atributos.insert("tiempoDeCarga".to_string(), tiempo_req.to_string());

    let message = pubsub::api::PubsubMessage {
        data: Some(base64::encode(message.as_bytes())),
        attributes: Some(atributos),
        ..Default::default()
    };
    let request = pubsub::api::PublishRequest { messages: Some(vec![message]) };
    let result = methods.topics_publish(request.clone(), &TOPIC_NAME).doit().await;

    match result {
        Err(e) => {
            println!("Publish error: {} :(", e);
            status = 404;
            mensaje = "Error al interactuar con PubSub! :(".to_string();
            return web::Json(respuesta {
                status: status,
                Mensaje: mensaje.to_string()
            });
        }
        Ok((_response, response)) => {
            for msg in response.message_ids.unwrap_or(Vec::new()) {
                id = msg;
                println!("Notificación enviada correctamente, id #{}", id);
                mensaje = format!("Notificación enviada correctamente, id #{}",id);
            }
        }
    }

    println!("Pub/Sub publish Completed :D");
   
    return web::Json(respuesta {
        status: status,
        Mensaje: mensaje
    });
   
}

#[actix_rt::main]
async fn main() -> io::Result<()> {

    env::set_var("RUST_LOG", "actix_web=debug,actix_server=info");
    env_logger::init();
    dotenv::dotenv().ok();
    let port = env::var("RUST_API_PORT").unwrap();
    let host = env::var("RUST_API_HOST").unwrap();
    let address = format!("{}:{}", host, port);
    println!("Rust server on port {} :D", port);

    HttpServer::new(move || {
        App::new()

            .wrap(middleware::Logger::default())
            .service(init)
            .service(notificar)
            .service(get_cosmos)
            .service(get_cloudsql)
            .service(add_tweet)
    })
    .bind(&address)
    .unwrap_or_else(|err| {
        panic!("🔥🔥🔥 Couldn't start the server in port {}: {:?} :O",port, err )
    })
    .run()
    .await
}