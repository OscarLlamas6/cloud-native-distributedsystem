package notificar

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"cloud.google.com/go/pubsub"
)

func Notificar(w http.ResponseWriter, r *http.Request) {

	type notificacion struct {
		Guardados     int `json:"guardados"`
		TiempoDeCarga int `json:"tiempoDeCarga"`
	}

	type mensaje struct {
		Mensaje string `json:"Mensaje"`
		Status  int    `json:"Status"`
	}

	estado := 202
	msj := ""

	projectID := os.Getenv("PUBSUB_PROJECT")
	topicID := os.Getenv("GOLANG_TOPIC")

	ctx := context.Background()
	client, error2 := pubsub.NewClient(ctx, projectID)
	if error2 != nil {
		fmt.Fprintf(w, "pubsub.NewClient: %v\n", error2)
	}
	defer client.Close()

	t := client.Topic(topicID)

	var newNotificacion notificacion
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Fprintf(w, "Insert a Valid Client Data")
	}

	json.Unmarshal(reqBody, &newNotificacion)

	jsonGuardados := fmt.Sprintf("%v", newNotificacion.Guardados)
	jsonTiempo := fmt.Sprintf("%v", newNotificacion.TiempoDeCarga)

	result := t.Publish(ctx, &pubsub.Message{
		Data: []byte("Enviando una notificación desde pubsub SOPES :D!"),
		Attributes: map[string]string{
			"guardados":     jsonGuardados,
			"api":           "Golang (Google Cloud Functions)",
			"tiempoDeCarga": jsonTiempo,
		},
	})

	id, error3 := result.Get(ctx)
	if error3 != nil {
		fmt.Printf("Error: %v", error3)
		estado = 404
		msj = "Error al interactuar con google Pub/Sub! :("
	} else {
		fmt.Printf("Nueva notificación publicada desde (Google Cloud Functions) con el id: %v", id)
		msj = fmt.Sprintf("Notificacion enviada correctamente desde (Google Cloud Functions), id %v ! :D", id)
	}

	var newMensaje mensaje
	newMensaje.Mensaje = msj
	newMensaje.Status = estado
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newMensaje)

}
