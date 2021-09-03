# import 
from termcolor import colored
from Misc import Variables
import requests
import json

# Main Class 
class Traffic():

    # Send Traffic
    def sendTraffic(self):

        # Check Array Length
        if len(Variables.dataArray) > 0:

            # For Array
            for Item in Variables.dataArray:
          
                # Make Requests
                response = requests.post(Variables.host, data=Item, timeout=0.1)

                # Add To Array
                Variables.reportArray.append(response)
 
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
        print(colored("--------No.------- ", "blue") + colored(" -------Status-------", "blue"))

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
                print(colored("Success " + "Status Code: " + str(Item.status_code), "green"))
                self.addSpaces(20, 21 + len(str(Item.status_code)))

                # Incremente Counter
                succes += 1
            
            else:

                # Status
                print(colored("Error " + "Status Code: " + str(Item.status_code), "red"))
                self.addSpaces(20, 19 + len(str(Item.status_code)))

                # Increment Counter
                error += 1

            # Increment Counter
            counter += 1
        
        # Show Space 
        print(" ")

        # Show Message 
        print(colored("Number Of Data Sent Successfully!: " + str(succes) + "\n", "green"))
        print(colored("Number Of Data With Error!: " + str(error) + "\n", "red"))