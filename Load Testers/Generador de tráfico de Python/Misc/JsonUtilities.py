# Imports
from termcolor import colored
from Misc import Variables
import json
import os
import random

# Main Class 
class JsonUtilities():

    # Constructor 
    def __init__(self) -> None:
        
        # Inizialite Array
        Variables.dataArray = []

    # Load File
    def ReadFile(self, fileName):

        # Check If File Exists
        if os.path.exists(fileName):

            # Read File
            try:

                # Open File
                with open(fileName, "r") as data:

                    # Get Data Array
                    Variables.dataArray = json.loads(data.read())

                    # Show Message 
                    print(colored("\nData Size: " + str(len(Variables.dataArray)), "magenta"))

                    # Pause
                    input()

            except Exception as ex:

                # Show Execption
                print(colored("\nError Al Cargar Los Datos: ", "red") + ex)

                # Pause
                input()       

        else:

            # Show Message 
            print(colored("\nThe File Does Not Exists!", "red"))
            
            # Pause
            input()   

    # Select Host 
    def host():

        # Select Host 
        randNumber = random.randint(1, 3)
        global host

        if randNumber == 1:

            # Host All 
            host = "" 
            
        elif randNumber == 2:
    
            # Host Cloud Run 
            host = "apipyhton-wpyonbtsua-wn.a.run.app"

        elif randNumber == 3:

            # Host Cloud Function
            host = "us-west4-sopes-proyecto1-324500.cloudfunctions.net"

        # Return Host
        return host