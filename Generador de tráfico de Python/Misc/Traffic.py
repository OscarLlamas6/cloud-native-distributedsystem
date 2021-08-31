# import 
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

                # Convert Json Data 
                bodyPost = json.dumps(Item)

                # Make Requests
                response = requests.post(Variables.host + "/", data=bodyPost, timeout=0.1)

                # Add To Array
                Variables.reportArray.append(response)
 
            # Show Message 
            print("\nLoad Test Carried Out Successfully")

            # Pause 
            input()

        else:

            # Show Message 
            print("\nNo Data To Send")

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
        print("--------No.------- " + " -------Status-------")

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
                print("Success " + "Status Code: " + str(Item.status_code))
                self.addSpaces(20, 21 + len(str(Item.status_code)))

                # Incremente Counter
                succes += 1
            
            else:

                # Status
                print("Error " + "Status Code: " + str(Item.status_code))
                self.addSpaces(20, 19 + len(str(Item.status_code)))

                # Increment Counter
                error += 1

            # Increment Counter
            counter += 1
        
        # Show Space 
        print(" ")

        # Show Message 
        print("Number Of Data Sent Successfully!: " + str(succes) + "\n")
        print("Number Of Data With Error!: " + str(error) + "\n")