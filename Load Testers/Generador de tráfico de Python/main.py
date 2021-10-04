# Imports
from Misc.JsonUtilities import JsonUtilities
from Misc import Variables
from Misc.Traffic import Traffic
from termcolor import colored
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
    print(colored("------------------------ Load Tester Python --------------------", "blue"))
    print(colored("------------------------------- Menu ---------------------------\n", "cyan"))
    print(colored("1.Read File", "magenta"))
    print(colored("2.Load Test", "magenta"))
    print(colored("3.Report Test", "magenta"))
    print(colored("4.Salir\n", "magenta"))
    print(colored("Select An Option: ", "yellow"), end="")

    # Get Menu Option
    menuOption = input()  

    # Main Switch
    if menuOption == "1":
        
        # Get File Name
        Variables.fileName = input(colored("\nEnter The Path Of The File You Want To Upload: ", "green"))

        # Read File
        actualInstanceJson.ReadFile(Variables.fileName)

        # Call GUI
        GUI()

    elif menuOption == "2":

        # Obtain Host
        Variables.host = input(colored("\nSpecify The Host To Send The Data Traffic: ", "green"))
        
        # Send Traffic
        actualInstanceTraffic.sendTraffic()

        # Call GUI
        GUI()

    elif menuOption == "3":

        # Show Message
        print(colored("\n----------------------------- Reports Test --------------------------------\n", "blue"))

        # Report Test
        actualInstanceTraffic.reportTest()

        # Pause
        input()

        # Call GUi
        GUI()

    elif menuOption == "4":

        print(colored("\nLoad Tests Completed!", "green"))

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