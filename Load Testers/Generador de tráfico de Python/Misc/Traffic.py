# import 
from termcolor import colored
from Misc import Variables
from Misc import JsonUtilities
import requests
import json
import time
import random

# Main Class 
class Traffic():

    # Send Traffic
    def sendTraffic(self):

        # Clean Array 
        Variables.reportArray = []

        # Check Array Length
        if len(Variables.dataArray) > 0:

            # For Array
            for Item in Variables.dataArray:
       
                # Header 
                headers = {

                    'Content-Type': 'application/json',
                    'host': JsonUtilities.JsonUtilities.host()

                }
                
                # Make Requests
                response = requests.post(Variables.host, headers=headers, data=json.dumps(Item)) 
             
                # Add To Array
                Variables.reportArray.append(response)

                # Sleep 
                time.sleep(random.randint(0, 1) / 10)
 
            # Show Message 
            print(colored("\nLoad Test Carried Out Successfully", "magenta"))

            # Pause 
            input()

        else:

            # Show Message 
            print(colored("\nNo Data To Send", "magenta"))

            # Pause 
            input()             

    # Add Spaces 
    def addSpaces(self, sizeHeader, sizeItem):

        # Add Space
        for x in range(sizeHeader - sizeItem):

            # Add Space
            print(" ", end="")

    # Report Test
    def reportTest(self):

        # Auxiliary Counter
        counter = 1

        # Success
        succes = 0

        # Error
        error = 0

        # Headers
        print(colored("--------No.------- ", "blue") + colored(" -------Status-------", "blue") + colored("     -------Server-------", "blue"))

        # Generate Report
        for Item in Variables.reportArray:

            # Make Table
            
            # No.
            print(counter, end="")
            print(".", end="")
            self.addSpaces(20, len(str(counter)) + 1)

            # Check Status
            if Item.status_code >= 200 and Item.status_code < 300:

                # Status
                print(colored("Success " + "Status Code: " + str(Item.status_code), "green"), end=" ")
                self.addSpaces(20, 25 + len(str(Item.status_code)))
                
                # Server
                print(colored(json.loads(Item.text)["Mensaje"], "green"))

                # Incremente Counter
                succes += 1
            
            else:

                # Status
                print(colored("Error " + "Status Code: " + str(Item.status_code), "red"))
                self.addSpaces(20, 19 + len(str(Item.status_code)))
          
                # Server
                # print(colored(json.loads(Item.text)["Mensaje"], "red"))

                # Increment Counter
                error += 1

            # Increment Counter
            counter += 1            
        
        # Show Space 
        print(" ")

        # Show Message 
        print(colored("Number Of Data Sent Successfully!: " + str(succes) + "\n", "green"))
        print(colored("Number Of Data With Error!: " + str(error) + "\n", "red"))