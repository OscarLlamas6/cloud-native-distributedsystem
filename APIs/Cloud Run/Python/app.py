
import cgi
from http.server import HTTPServer, BaseHTTPRequestHandler
import socketserver
import io
import json
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import mysql.connector
from bson import ObjectId
from google.cloud import pubsub_v1

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

# Setting env variables
load_dotenv()
PORT = int(os.environ['PYTHON_API_PORT'])
HOST = os.environ['PYTHON_API_HOST']

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
        elif self.path == '/notificar':
            self.do_notificar()
        else:
            self.send_response(400)
    
    def do_notificar(self):
        
        publisher = pubsub_v1.PublisherClient()
        topic_path = os.environ['TOPIC_NAME']

        dataSize = int(self.headers['Content-Length'])
        reqBody = self.rfile.read(dataSize)
        reqData = json.loads(reqBody.decode("utf-8"))           
        print("Data received: " + str(reqData))     
        
        response_data = {}             
        status = 202
        
        try:
            data = 'Enviando una notificacion desde pubsub SOPES :D!'
            data = data.encode('utf-8')
            attributes = {
                'guardados': str(reqData["guardados"]),
                'api': 'Python',
                'tiempoDeCarga': str(reqData["tiempoDeCarga"])
            }

            future = publisher.publish(topic_path, data, **attributes)
            response_data = {"status": 202, "Mensaje": f'Notificación enviada correctamente desde Python (Google Cloud Run), id {future.result()} ! :D'}     
        except:
            status = 404
            response_data = {"status": 404, "Mensaje": "Error al interactuar con google Pub/Sub! :("}
             
        self.send_response(status)    
        response_json = json.dumps(response_data, indent=2)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(bytes(response_json, 'utf-8'))
           
    def do_pythonAPI(self):
        response_data = {"status": 202, "Mensaje": "Welcome to SOPES1 PYTHON API! :D"}
        response_json = json.dumps(response_data, indent=2)
        self.send_response(202)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(bytes(response_json, 'utf-8'))

    def do_getCosmos(self):
        # Get these values from the Azure portal page for your cosmos db account
        cosmosUSER = os.environ['COSMOSDB_USER']
        cosmosPASS = os.environ['COSMOSDB_PASS']
        cosmosURL =  os.environ['COSMOSDB_URL']
        cosmosDB = os.environ['COSMOSDB_DBNAME']
        cosmosCOLLECTION = os.environ['COSMOSDB_COLLECTION']
        
        # This requires python 3.6 or above
        cosmosCONN = f'mongodb://{cosmosUSER}:{cosmosPASS}@{cosmosUSER}.{cosmosURL}@{cosmosUSER}@'
        cosmosClient = MongoClient(cosmosCONN)
        myDB = cosmosClient[cosmosDB]
        myCOLL = myDB[cosmosCOLLECTION]
        
        status = 202
        items = []
        try:
            items = list(map(lambda row: {i: str(row[i]) if isinstance(row[i], ObjectId) else row[i] for i in row}, myCOLL.find()))
        except:
            status = 404

        self.send_response(status)      
        jsonString = json.dumps(items, indent=2)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(bytes(jsonString, 'utf-8'))
        
    def do_getCloudSQL(self):
        
        googleHOST = os.environ['CLOUDSQL_HOST']
        googlePASS = os.environ['CLOUDSQL_PASS']
        googleUSER = os.environ['CLOUDSQL_USER']
        googleDB = os.environ['CLOUDSQL_DB']

        conexion = mysql.connector.connect(user=googleUSER, password=googlePASS, host=googleHOST)
        
        status = 202
        items = []
        try:                         
            db_cursor = conexion.cursor()
            db_cursor.execute("CREATE SCHEMA IF NOT EXISTS {}".format(googleDB))
            db_cursor.execute("USE {}".format(googleDB))      
            db_cursor.execute('''CREATE TABLE IF NOT EXISTS {}.TWEET(
                                    idTweet INT NOT NULL AUTO_INCREMENT,
                                    nombre VARCHAR(200) NOT NULL,
                                    comentario VARCHAR(1000) NOT NULL,
                                    fecha VARCHAR(200) NOT NULL,
                                    hashtags VARCHAR(1000) NOT NULL,
                                    upvotes INT NOT NULL,
                                    downvotes INT NOT NULL,
                                    PRIMARY KEY (idTweet))'''.format(googleDB)) 
            db_cursor.execute("SELECT * FROM {}.TWEET".format(googleDB))
            items = db_cursor.fetchall()
        except:
            status = 404
            
        conexion.close()
        self.send_response(status)      
        data = list(items)
        jsonString = json.dumps(data, indent=2)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(bytes(jsonString, 'utf-8'))   
            
    def do_publicar(self):
        
        cosmosUSER = os.environ['COSMOSDB_USER']
        cosmosPASS = os.environ['COSMOSDB_PASS']
        cosmosURL =  os.environ['COSMOSDB_URL']
        cosmosDB = os.environ['COSMOSDB_DBNAME']
        cosmosCOLLECTION = os.environ['COSMOSDB_COLLECTION']
        
        # This requires python 3.6 or above
        cosmosCONN = f'mongodb://{cosmosUSER}:{cosmosPASS}@{cosmosUSER}.{cosmosURL}@{cosmosUSER}@'
        cosmosClient = MongoClient(cosmosCONN)
        myDB = cosmosClient[cosmosDB]
        myCOLL = myDB[cosmosCOLLECTION]

        googleHOST = os.environ['CLOUDSQL_HOST']
        googlePASS = os.environ['CLOUDSQL_PASS']
        googleUSER = os.environ['CLOUDSQL_USER']
        googleDB = os.environ['CLOUDSQL_DB']

        conexion = mysql.connector.connect(user=googleUSER, password=googlePASS, host=googleHOST)
        
        dataSize = int(self.headers['Content-Length'])
        reqBody = self.rfile.read(dataSize)
        reqData = json.loads(reqBody.decode("utf-8"))           
        print("Data received: " + str(reqData))     
          
        response_data = {}             

        status = 202
        try:
            myCOLL.insert_one(reqData)
        except:
            response_data = {"status": 404, "Mensaje": "Error al interactuar con CosmosDB! :("}
            status = 404
            raise
        
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
                response_data = {"status": 202, "Mensaje": "Nuevo elemento insertado correctamente desde Python (Google Cloud Run)! :D"}
            except:
                status = 404
                response_data = {"status": 404, "Mensaje": "Error al interactuar con Cloud SQL! :("}
        conexion.close()   
        self.send_response(status)    
        response_json = json.dumps(response_data, indent=2)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(bytes(response_json, 'utf-8'))


# Setting and starting server
myServer = HTTPServer((HOST, PORT), MyRequestHandler)
print("Server running at port: " + str(PORT))
myServer.serve_forever()
