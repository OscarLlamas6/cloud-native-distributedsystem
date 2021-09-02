# Imports
from termcolor import colored
from Misc import Variables
import json
import os

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