package main

import (
	"fmt"
	"net/http"
	"encoding/json"
)

type Message struct {
	Text string `json:"text"`
}

func handler(w http.ResponseWriter, r *http.Request) {
	message := Message{Text: "Hello from Go!"}
	json.NewEncoder(w).Encode(message)
}

func main() {
	http.HandleFunc("/", handler)
	
	fmt.Println("Running ...")
	http.ListenAndServe(":8080", nil)

}
