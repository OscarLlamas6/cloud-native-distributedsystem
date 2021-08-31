# Imports
from Misc.JsonUtilities import JsonUtilities
from Misc import Variables
from Misc.Traffic import Traffic
import os

# Json Utilities Instance
actualInstanceJson = JsonUtilities()

# Traffic Instance
actualInstanceTraffic = Traffic()

# Clear Console 
def ClearConsole():

    # Check Os Name
    if os.name in ('nt', 'dos'):

        # Choose Command
        command = "cls"
    
    else:

        # Choose Command
        command = "clear"

    # Call System To Make Command
    os.system(command)

# GUI
def GUI():

    # Clear 
    ClearConsole()
    
    # Menú 
    print("------------------------ Load Tester Locust --------------------\n")
    print("------------------------------- Menu ---------------------------")
    print("1.Read File")
    print("2.Load Test")
    print("3.Report Test")
    print("4.Salir\n")
    print("Select An Option: ", end="")

    # Get Menu Option
    menuOption = input()  

    # Main Switch
    if menuOption == "1":
        
        # Get File Name
        Variables.fileName = input("\nEnter The Path Of The File You Want To Upload: ")

        # Read File
        actualInstanceJson.ReadFile(Variables.fileName)

        # Call GUI
        GUI()

    elif menuOption == "2":

        # Obtain Host
        Variables.host = input("\nSpecify The Host To Send The Data Traffic: ")
        
        # Send Traffic
        actualInstanceTraffic.sendTraffic()

        # Call GUI
        GUI()

    elif menuOption == "3":

        # Show Message
        print("\n----------------------------- Reports Test --------------------------------\n")

        # Report Test
        actualInstanceTraffic.reportTest()

        # Pause
        input()

        # Call GUi
        GUI()

    elif menuOption == "4":

        print("\nLoad Tests Completed!")

    else:

        # Call GUI
        GUI()

# Main Method
def Main():

    # Call GUI
    GUI()

# Init Main
if __name__ == "__main__":

    # Call Main Method    
    Main()