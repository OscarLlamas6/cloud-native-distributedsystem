
import cgi
from http.server import HTTPServer, BaseHTTPRequestHandler
import socketserver
import io
import json
from azure.cosmos import CosmosClient, exceptions, PartitionKey
from dotenv import load_dotenv
import os
import mysql.connector

# Setting env variables
load_dotenv()
URL = os.environ['COSMOSDB_URL']
KEY = os.environ['COSMOSDB_KEY']
PORT = int(os.environ['PYTHON_API_PORT'])
client = CosmosClient(URL, credential=KEY)

googleHOST = os.environ['CLOUDSQL_HOST']
googlePASS = os.environ['CLOUDSQL_PASS']
googleUSER = os.environ['CLOUDSQL_USER']
googleDB = os.environ['CLOUDSQL_DB']

conexion = mysql.connector.connect(user=googleUSER, password=googlePASS, host=googleHOST)

#Def. requests handler.
class MyRequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        #Definiendo rutas para peticiones get
        if self.path == '/':           
            self.do_pythonAPI()
        elif self.path == '/getCosmos':
            self.do_getCosmos()
        elif self.path == '/getCloudSQL':
            self.do_getCloudSQL()
        else:
            self.send_response(400)
 
    def do_POST(self):
        #Definiendo rutas para peticiones post
        if self.path == "/publicar":
            self.do_publicar()
            
    def do_pythonAPI(self):
        response_data = {"status": 202, "Mensaje": "Welcome to SOPES1 PYTHON API! :D"}
        response_json = json.dumps(response_data, indent=2)
        self.send_response(202)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(bytes(response_json, 'utf-8'))

    def do_getCosmos(self):
        
        dbName = os.environ['COSMOSDB_DBNAME']
        try:
            database = client.create_database(dbName)
            print("BASE DE DATOS CREADA! :D")
        except exceptions.CosmosResourceExistsError:
            database = client.get_database_client(dbName)
            print("BASE DE DATOS YA EXISTE! :O")
            
        containerName = os.environ['COSMOSDB_CONTAINERNAME']   
        status = 202
        items = []
        try:
            container = database.create_container(id=containerName, partition_key=PartitionKey(path="/tweetID"))
            items = container.query_items(query='SELECT * FROM TWEETS',enable_cross_partition_query=True)
        except exceptions.CosmosResourceExistsError:
            container = database.get_container_client(containerName)
            items = container.query_items(query='SELECT * FROM TWEETS',enable_cross_partition_query=True)
        except exceptions.CosmosHttpResponseError:
            status = 404
            raise
        
        self.send_response(status)      
        data = list(items)
        jsonString = json.dumps(data, indent=2)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(bytes(jsonString, 'utf-8'))
        
    def do_getCloudSQL(self):
        
        status = 202
        items = []
        try:                         
            db_cursor = conexion.cursor()
            db_cursor.execute("CREATE SCHEMA IF NOT EXISTS {}".format(googleDB))
            db_cursor.execute("USE {}".format(googleDB))       
            db_cursor.execute("SELECT * FROM {}.TWEET".format(googleDB))
            items = db_cursor.fetchall()
        except:
            status = 404
            
        
        self.send_response(status)      
        data = list(items)
        jsonString = json.dumps(data, indent=2)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(bytes(jsonString, 'utf-8'))   
            
    def do_publicar(self):
        
        dbName = os.environ['COSMOSDB_DBNAME']
        dataSize = int(self.headers['Content-Length'])
        reqBody = self.rfile.read(dataSize)
        reqData = json.loads(reqBody.decode("utf-8"))           
        print("Data received: " + str(reqData))     
          
        response_data = {}   
        try:
            database = client.create_database(dbName)
            print("BASE DE DATOS CREADA! :D")
        except exceptions.CosmosResourceExistsError:
            database = client.get_database_client(dbName)
            print("BASE DE DATOS YA EXISTE! :O")
            
        containerName = os.environ['COSMOSDB_CONTAINERNAME']   
        status = 202
        try:
            container = database.create_container(id=containerName, partition_key=PartitionKey(path="/tweetID"))
        except exceptions.CosmosResourceExistsError:
            container = database.get_container_client(containerName)
        except exceptions.CosmosHttpResponseError:
            response_data = {"status": 404, "Mensaje": "Error al interactuar con CosmosDB! :("}
            status = 404
            raise
        
        if status != 404:
            try:                         
                container.upsert_item(reqData)          
            except:
                status = 404
                response_data = {"status": 404, "Mensaje": "Error al interactuar con CosmosDB! :("}
        
        if status != 404:
            try:                         
                db_cursor = conexion.cursor()
                db_cursor.execute("CREATE SCHEMA IF NOT EXISTS {}".format(googleDB))
                db_cursor.execute("USE {}".format(googleDB))
                
                hashtags = reqData["hashtags"]
                hashtagsStr = ""
                for index, hash in enumerate(hashtags):
                    if index == 0:
                        hashtagsStr = str(hash)
                    else:
                        hashtagsStr = hashtagsStr + "," + str(hash)
                db_cursor.execute('''CREATE TABLE IF NOT EXISTS {}.TWEET(
                                    idTweet INT NOT NULL AUTO_INCREMENT,
                                    nombre VARCHAR(200) NOT NULL,
                                    comentario VARCHAR(1000) NOT NULL,
                                    fecha VARCHAR(200) NOT NULL,
                                    hashtags VARCHAR(1000) NOT NULL,
                                    upvotes INT NOT NULL,
                                    downvotes INT NOT NULL,
                                    PRIMARY KEY (idTweet))'''.format(googleDB))
                db_cursor.execute('''INSERT INTO `SOPES1`.`TWEET`
                                    (`nombre`,`comentario`,`fecha`,`hashtags`,`upvotes`,`downvotes`)
                                    VALUES  ('{}','{}','{}','{}',{},{})'''
                                    .format(str(reqData["nombre"]),str(reqData["comentario"]),
                                            str(reqData["fecha"]),str(hashtagsStr),str(reqData["upvotes"]),
                                            str(reqData["downvotes"])))
                conexion.commit()
                response_data = {"status": 202, "Mensaje": "Nuevo elemento insertado correctamente! :D"}
            except:
                status = 404
                response_data = {"status": 404, "Mensaje": "Error al interactuar con Cloud SQL! :("}
            
        self.send_response(status)    
        response_json = json.dumps(response_data, indent=2)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(bytes(response_json, 'utf-8'))


# Setting and starting server
myServer = HTTPServer(('localhost', PORT), MyRequestHandler)
print("Server running at localhost: " + str(PORT))
myServer.serve_forever()
conexion.close()