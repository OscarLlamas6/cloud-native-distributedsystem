mod handlers;

extern crate dotenv;

use std::env;
#[allow(unused_imports)]
use actix_web::{web, App, HttpRequest, HttpServer, Responder, middleware::Logger};
use mongodb::{options::ClientOptions, Client};
#[allow(unused_imports)]
use bson::{doc, Bson};
#[allow(unused_imports)]
use futures::stream::StreamExt;
use std::sync::*;

pub async fn saludo(req: HttpRequest) -> impl Responder {
    let name = req.match_info().get("name").unwrap_or("World");
    format!("Hello {} :D!", &name)
}


#[actix_web::main]
async fn main() -> std::io::Result<()> {

    // init env vars
    dotenv::dotenv().ok();
    // building address

    let port = env::var("RUST_API_PORT").unwrap();
    let cosmos_url = env::var("COSMOSDB_URL").unwrap();
    let cosmos_user = env::var("COSMOSDB_USER").unwrap();
    let cosmos_pass = env::var("COSMOSDB_PASS").unwrap();
    let connection_url = format!("mongodb://{}:{}@{}.{}@{}@", cosmos_user, cosmos_pass, cosmos_user, cosmos_url, cosmos_user); 
    let address = format!("127.0.0.1:{}", port);
    println!("Rust server on port {} :D", port);

    env::set_var("RUST_LOG", "actix_web=debug");
    let mut client_options = ClientOptions::parse(&connection_url).await.unwrap();
    client_options.app_name = Some("SOPES1".to_string());
    let client = web::Data::new(Mutex::new(Client::with_options(client_options).unwrap()));
    
    HttpServer::new(move || {
        App::new()
            .app_data(client.clone())
            .service(web::scope("/").configure(handlers::scoped_config))      
    })
    .bind(&address)
    .unwrap_or_else(|err| {
        panic!("🔥🔥🔥 Couldn't start the server in port {}: {:?}",port, err )
    })
    .run()
    .await
}