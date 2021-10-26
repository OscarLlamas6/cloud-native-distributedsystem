# Imports
from locust import HttpUser, task, between
import json
import time
import random

# Main Class 
class JsonUtilities():

    # Constructor 
    def __init__(self) -> None:
        
        # Inizialite Array 
        self.dataArray = []

    # Load File
    def ReadFile(self):

        # Read File
        try:

            # Open File
            with open("./Traffic_Files/data.json", "r") as data:

                # Get Data Array 
                self.dataArray = json.loads(data.read())

        except Exception as ex:

            # Show Execption
            print("\nError Al Cargar Los Datos: " + ex)

    # Get Array Value
    def getArrayValue(self):

        # Check Size
        if len(self.dataArray) == 0:

            # Return Value
            return None

        else:

            # Return Value
            return self.dataArray.pop()

    # Get Size Array
    def getSizeArray(self):

        # Return 
        return len(self.dataArray)        

    # Get Host 
    def getHost(self):

        # Select Host 
        randNumber = random.randint(1, 3)
        randApi = random.randint(1, 2)
        global host

        if randNumber == 1:

            # Host All 
            host = "" 
            
        elif randNumber == 2:
    
            # Choose Api 
            if randApi == 1:

                # Host Cloud Run Python
                host = "apipython-wpyonbtsua-wn.a.run.app"
            
            elif randApi == 2:

                # Host Cloud Run Go
                host = "apigo-wpyonbtsua-wn.a.run.app"

        elif randNumber == 3:

            # Choose Api 
            if randApi == 1:

                # Host Cloud Function Python
                host = "us-west4-sopes-proyecto1-324500.cloudfunctions.net"
            
            elif randApi == 2:

                # Host Cloud Function Go
                host = "us-west2-sopes-proyecto1-324500.cloudfunctions.net"

        # Return Host
        return host

# Main class
class LocustLoadTester(HttpUser):
    
    # Wait Time
    wait_time = between(0.1, 1)

    # Initial Configuration
    def on_start(self):

        # Get Instance 
        self.actualInstance = JsonUtilities()
        
        # Read File
        self.actualInstance.ReadFile()

        # start Time 
        self.startHour = time.time()

        # Size Array
        self.sizeArray = self.actualInstance.getSizeArray()

    # Make Request And Task Number
    @task()   
    def SendTraffic(self):
        
        # Get Value 
        arrayItem = self.actualInstance.getArrayValue()
        
        # Check Array Lenght
        if arrayItem != None:

            # Header 
            headers = {

                'Content-Type': 'application/json',
                'host': self.actualInstance.getHost()

            }

            # Make Requests
            response = self.client.post('/publicar', json=arrayItem, headers=headers)

            # Check Status 
            if response.status_code >= 200 and response.status_code < 300:
            
                # Show Message
                print(json.loads(response.text)["Mensaje"] + " Status Code: " +  str(response.status_code))

        else:

            # Final Time 
            final = time.time()

            # Header 
            headers = {

                'Content-Type': 'application/json',
                'host': self.actualInstance.getHost()

            }            

            # Send Post 
            postBody = {

                "guardados": self.sizeArray,
                "tiempoDeCarga": int(float(final - self.startHour))

            }
           
            # Make Request
            response = self.client.post('/notificar', headers=headers, data=json.dumps(postBody))
            
            # Show Message 
            print("\nNo Data To Send")

            # Stop Service 
            self.stop(True)   

            # Pause 
            input()                      