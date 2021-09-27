
from dotenv import load_dotenv
import os
from flask import jsonify
from google.cloud import pubsub_v1


def notificar(request):

    # Setting env variables
    load_dotenv()
    

    publisher = pubsub_v1.PublisherClient()
    topic_path = os.environ['TOPIC_NAME']
   
    request_json = request.get_json(silent=True)
    response_data = {}             

    
    try:
        data = 'Enviando una notificacion desde pubsub SOPES :D!'
        data = data.encode('utf-8')
        attributes = {
            'guardados': str(request_json["guardados"]),
            'api': 'Python (Cloud-Functions)',
            'tiempoDeCarga': str(request_json["tiempoDeCarga"])
        }

        future = publisher.publish(topic_path, data, **attributes)
        response_data = {"status": 202, "Mensaje": f'Notificación enviada correctamente desde Python (Cloud-Functions), id {future.result()} ! :D'}     
    except:
        response_data = {"status": 404, "Mensaje": "Error al interactuar con google Pub/Sub! :("}
            
    return jsonify(response_data)