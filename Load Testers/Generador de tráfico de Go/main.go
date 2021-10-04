// Packages
package main

// Imports
import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"os"
	"os/exec"
	"runtime"
	"strconv"
	"time"
)

// Map For Function
var clear map[string]func()

// Type
type jsonModel struct {
	Nombre     string   `json:"nombre"`
	Comentario string   `json:"comentario"`
	Fecha      string   `json:"fecha"`
	Hashtags   []string `json:"hashtags"`
	Upvotes    int      `json:"upvotes"`
	Downvotes  int      `json:"downvotes"`
}

// Pub Sub
type pubSubModel struct {
	Guardados     int `json:"guardados"`
	Tiempodecarga int `json:"tiempoDeCarga"`
}

// Array Data
var dataArray []jsonModel

// Array Report
var reportArray []*http.Response

// Tiempo De Carga
var chargeTime int

// Init
func init() {

	// Initialize It
	clear = make(map[string]func())

	// Add Linux
	clear["linux"] = func() {

		cmd := exec.Command("clear")
		cmd.Stdout = os.Stdout
		cmd.Run()

	}

	// Add Windows
	clear["windows"] = func() {

		cmd := exec.Command("cmd", "/c", "cls")
		cmd.Stdout = os.Stdout
		cmd.Run()

	}

}

// Get Host Name
func getHost() string {

	// Select Host
	min := 1
	max := 3
	randNumber := min + rand.Intn(max-min+1)
	max = 2
	randApi := min + rand.Intn(max-min+1)
	host := ""

	// Check Type
	if randNumber == 1 {

		// Host All
		host = ""

	} else if randNumber == 2 {

		// Choose Api
		if randApi == 1 {

			// Host Cloud Run Python
			host = "apipython-wpyonbtsua-wn.a.run.app"

		} else if randApi == 2 {

			// Host Cloud Run Go
			host = "apigo-wpyonbtsua-wn.a.run.app"

		}

	} else if randNumber == 3 {

		// Choose Api
		if randApi == 1 {

			// Host Cloud Function Python
			host = "us-west4-sopes-proyecto1-324500.cloudfunctions.net"

		} else if randApi == 2 {

			// Host Cloud Function Go
			host = "us-west2-sopes-proyecto1-324500.cloudfunctions.net"

		}

	}

	// Return
	return host

}

// Get Color Name
func getColor(colorName string) string {

	// Colors
	colors := map[string]string{

		"reset":  "\033[0m",
		"red":    "\033[31m",
		"green":  "\033[32m",
		"yellow": "\033[33m",
		"blue":   "\033[34m",
		"purple": "\033[35m",
		"cyan":   "\033[36m",
		"white":  "\033[37m",
	}

	// Return
	return colors[colorName]

}

// Clear Console
func ClearConsole() {

	// Clear
	value, ok := clear[runtime.GOOS]

	// Verify
	if ok {

		value()

	} else {

		panic("Your Platform Is Unsupported! I Can't Clear Terminal Screen :(")

	}

}

// Verify Exist Path
func Exists(path string) (bool, error) {

	// Check Path
	_, err := os.Stat(path)

	// Catch Error
	if err == nil {

		return true, nil

	}

	// Check Path
	if os.IsNotExist(err) {

		return false, nil

	}

	// Retornar
	return false, err

}

// Read File
func ReadFile(filePath string) {

	// Check Exists
	var flag, err = Exists(filePath)
	_ = err

	// Check Exists
	if flag {

		// Read File
		content, err := ioutil.ReadFile(filePath)

		// Catch Error
		if err != nil {

			// Show Message
			fmt.Println("")
			fmt.Print(string(getColor("red")), "Error Opening File")
			var input string
			fmt.Scanln(&input)

		}

		// Convert To Json
		json.Unmarshal([]byte(content), &dataArray)

		// Show Message
		fmt.Println("")
		fmt.Println(getColor("purple"), "Data Size: "+strconv.Itoa(len(dataArray)))
		var input string
		fmt.Scanln(&input)

	} else {

		// Show Message
		fmt.Println("")
		fmt.Println(string(getColor("red")), "The File Does Not Exists!")
		var input string
		fmt.Scanln(&input)

	}

}

// Send Traffic
func SendTraffic(host string) {

	// Clean Array
	reportArray = nil

	// Check Array Length
	if len(dataArray) > 0 {

		// Start Time
		start := time.Now()

		// For Item
		for _, Item := range dataArray {

			// Make Json
			jsonBody := jsonModel{

				Nombre:     Item.Nombre,
				Comentario: Item.Comentario,
				Fecha:      Item.Fecha,
				Hashtags:   Item.Hashtags,
				Upvotes:    Item.Upvotes,
				Downvotes:  Item.Downvotes,
			}

			// Convert Json Body
			postBody := new(bytes.Buffer)
			json.NewEncoder(postBody).Encode(jsonBody)

			// Create Cliente
			client := &http.Client{}

			// Made Request
			req, _ := http.NewRequest("POST", host+"/publicar", postBody)

			// Add Headers
			req.Header.Add("Content-Type", "application/json")
			req.Host = getHost()

			// Make Request
			resp, _ := client.Do(req)

			// Add To Response Array
			reportArray = append(reportArray, resp)

		}

		// Final Time
		actual := time.Now()
		final := actual.Sub(start)

		// Make Json
		jsonBody := pubSubModel{
			Guardados:     Succesfully(),
			Tiempodecarga: int(final/time.Millisecond) / 1000,
		}

		// Add Time 
		chargeTime = int(final/time.Millisecond) / 1000

		// Convert Json Body
		postBody := new(bytes.Buffer)
		json.NewEncoder(postBody).Encode(jsonBody)

		// Create Cliente
		client := &http.Client{}

		// Made Request
		req, _ := http.NewRequest("POST", host+"/notificar", postBody)

		// Add Headers
		req.Header.Add("Content-Type", "application/json")
		req.Host = getHost()

		// Make Request
		resp, _ := client.Do(req)
		_ = resp

		// Show Message
		fmt.Println("")
		fmt.Println(getColor("purple"), "Load Test Carried Out Successfully")
		var input string
		fmt.Scanln(&input)

	} else {

		// Show Message
		fmt.Println("")
		fmt.Println(getColor("purple"), "No Data To Send")
		var input string
		fmt.Scanln(&input)

	}

}

// Add Spaces
func AddSpaces(sizeHeader int, sizeItem int) {

	// Add Spaces
	for counter := 1; counter < sizeHeader-sizeItem; counter++ {

		// Show Message
		fmt.Print(" ")

	}

}

// Succesfully Count
func Succesfully() int {

	// Variables
	success := 0

	// For
	for _, Item := range reportArray {

		// Check Status
		if Item.StatusCode >= 200 && Item.StatusCode < 300 {

			// Increment
			success++

		} 

	}

	// Return
	return success

}

// Reporte Test
func ReportTest() {

	// Variables
	counter := 1
	success := 0
	error := 0

	// Show Message
	fmt.Println("")
	fmt.Println(string(getColor("blue")), "--------No.------- -------Status-------     -------Server-------")

	// For
	for _, Item := range reportArray {

		// Show Message
		fmt.Print(string(getColor("white")))
		fmt.Print(strconv.Itoa(counter), ".")
		AddSpaces(20, len(strconv.Itoa(counter))+1)

		// Check Status
		if Item.StatusCode >= 200 && Item.StatusCode < 300 {

			// Status
			fmt.Print(string(getColor("green")), "Succes Status Code: "+strconv.Itoa(Item.StatusCode))
			AddSpaces(20, 21-len(strconv.Itoa(Item.StatusCode)))

			// String Json
			var res map[string]interface{}

			// Decoder Json
			json.NewDecoder(Item.Body).Decode(&res)

			// Server Message
			fmt.Println(string(getColor("green")), res["Mensaje"])

			// Increment
			success++

		} else {

			// Status
			fmt.Println(string(getColor("red")), "Error Status Code: "+strconv.Itoa(Item.StatusCode))
			AddSpaces(20, 19-len(strconv.Itoa(Item.StatusCode)))

			// Increment
			error++

		}

		// Increment
		counter++

	}

	// Show Message
	fmt.Println("")
	fmt.Println(string(getColor("green")), "Number Of Data Sent Successfully!: ", strconv.Itoa(success))
	fmt.Println(string(getColor("red")), "Number Of Data With Error!: ", strconv.Itoa(error))
	fmt.Println(string(getColor("green")), "Charge Time!:", strconv.Itoa(chargeTime), " segundos")

}

// GUI
func GUI() {

	// Clear Console
	ClearConsole()

	// Show Menu
	fmt.Println(string(getColor("blue")), "-------------------------- Load Tester Go ----------------------")
	fmt.Println(string(getColor("cyan")), "------------------------------- Menu ---------------------------")
	fmt.Println("")
	fmt.Println(string(getColor("purple")), "1.Read File")
	fmt.Println(string(getColor("purple")), "2.Load Test")
	fmt.Println(string(getColor("purple")), "3.Report Test")
	fmt.Println(string(getColor("purple")), "4.Salir")
	fmt.Println("")
	fmt.Print(string(getColor("yellow")), "Select An Option: ")

	// Input
	var menuOption = 0
	fmt.Scanln(&menuOption)

	// Main Switch
	if menuOption == 1 {

		// Show Message
		fmt.Println("")
		fmt.Print(string(getColor("green")), "Enter The Path Of The File You Want To Upload: ")

		// Input
		var filePath = ""
		fmt.Scanln(&filePath)

		// Read File
		ReadFile(filePath)

		// GUI
		GUI()

	} else if menuOption == 2 {

		// Show Message
		fmt.Println("")
		fmt.Print(getColor("purple"), "Specify The Host To Send The Data Traffic: ")

		// Input
		var host = ""
		fmt.Scanln(&host)

		// Read File
		SendTraffic(host)

		// GUI
		GUI()

	} else if menuOption == 3 {

		// Show Message
		fmt.Println("")
		fmt.Println(string(getColor("blue")), "----------------------------- Reports Test --------------------------------")

		// Read File
		ReportTest()

		// Pause
		var input string
		fmt.Scanln(&input)

		// GUI
		GUI()

	} else if menuOption == 4 {

		// Show Message
		fmt.Println("")
		fmt.Println(getColor("green"), "Load Tests Completed!")

	} else {

		// Call GUI
		GUI()

	}

}

// Main Function
func main() {

	// Call GUI
	GUI()

}
