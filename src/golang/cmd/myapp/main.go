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


    w.Header().Set("Access-Control-Allow-Credentials", "true")
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
    w.Header().Set("Access-Control-Max-Age", "86400")
    w.Header().Set("Content-Type", "application/javascript")
    w.WriteHeader(http.StatusOK)

    message := Message{Text: "Hello from Go!"}
    json.NewEncoder(w).Encode(message)
}

func main() {
    http.HandleFunc("/", handler)

    fmt.Println("Running ...")
    http.ListenAndServe(":8080", nil)
}
