
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import mysql.connector
from flask import escape, jsonify

def publicar_tweet(request):

    # Setting env variables
    load_dotenv()
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
    googleHOST = os.environ['CLOUDSQL_HOST']
    googlePASS = os.environ['CLOUDSQL_PASS']
    googleUSER = os.environ['CLOUDSQL_USER']
    googleDB = os.environ['CLOUDSQL_DB']
    conexion = mysql.connector.connect(user=googleUSER, password=googlePASS, host=googleHOST)

    request_json = request.get_json(silent=True)
    response_data = {}             
    status = 202
    
    try:
        myCOLL.insert_one(request_json)
    except:
        response_data = {"status": 404, "Mensaje": "Error al interactuar con CosmosDB! :("}
        status = 404
        raise
    
    if status != 404:
        try:                         
            db_cursor = conexion.cursor()
            db_cursor.execute("CREATE SCHEMA IF NOT EXISTS {}".format(googleDB))
            db_cursor.execute("USE {}".format(googleDB))
            
            hashtags = request_json["hashtags"]
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
                                .format(str(request_json["nombre"]),str(request_json["comentario"]),
                                        str(request_json["fecha"]),str(hashtagsStr),str(request_json["upvotes"]),
                                        str(request_json["downvotes"])))
            conexion.commit()
            response_data = {"status": 202, "Mensaje": "Nuevo elemento insertado correctamente! :D"}
        except:
            status = 404
            response_data = {"status": 404, "Mensaje": "Error al interactuar con Cloud SQL! :("}
    
    return jsonify(response_data)