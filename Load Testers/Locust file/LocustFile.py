# Imports
from locust import HttpUser, task, between
import json

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
            with open("../Traffic Files/Traffic1.json", "r") as data:

           
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

# Main class
class LocustLoadTester(HttpUser):
    
    # Wait Time
    wait_time = between(0.1, 0.9)

    # Host
    host = "http://localhost:5000"
    
    # Initial Configuration
    def on_start(self):

        # Get Instance 
        self.actualInstance = JsonUtilities()
        
        # Read File
        self.actualInstance.ReadFile()

    # Make Request And Task Number
    @task()   
    def SendTraffic(self):
        
        # Get Value 
        arrayItem = self.actualInstance.getArrayValue()
        
        # Check Array Lenght
        if arrayItem != None:

            bodyPost = json.dumps(arrayItem)

            # Make Requests
            self.client.post('/', json=bodyPost)

        else:

             # Show Message 
            print("\nNo Data To Send")

            # Pause 
            input() 

            # Stop Service 
            self.stop(True)              