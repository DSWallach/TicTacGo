package main

import (
    "fmt"
    "net/http"
    "encoding/json"
    "github.com/dswallach/tictacgo/game"
)

type Message struct {
    Text string `json:"text"`
}

type PlayedMove struct {
    Row int `json:"moveRow"`
    Col int `json:"moveCol"`
    Player int `json:"movePlayer"`
}

func (pm PlayedMove) String() string {
    return fmt.Sprintf("%d, %d, %d", pm.Row, pm.Col, pm.Player)
}

func boardHandler(board *game.Board) http.HandlerFunc {

    return func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Credentials", "true")
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
        w.Header().Set("Access-Control-Max-Age", "86400")
        w.WriteHeader(http.StatusOK)

        jsonBoard, err := json.Marshal(board.GetBoard())
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
        }

        w.Header().Set("Content-Type", "application/json")
        _, err = w.Write(jsonBoard)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
        }
    }
}


func resetBoardHandler(board *game.Board) http.HandlerFunc {

    return func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Credentials", "true")
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
        w.Header().Set("Access-Control-Max-Age", "86400")
        w.WriteHeader(http.StatusOK)

        board.ResetBoard()
    }
}


func playMoveHandler(board *game.Board) http.HandlerFunc{

    return func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Credentials", "true")
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
        w.Header().Set("Access-Control-Max-Age", "86400")
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusOK)

        if r.Method != http.MethodPost {
            http.Error(w, "Invalid Request Method", http.StatusMethodNotAllowed)
            return
        }

        var move PlayedMove
        err := json.NewDecoder(r.Body).Decode(&move)
        fmt.Println(move.String())
        board.PlayMove(move.Row, move.Col, move.Player)
        if err != nil {
            http.Error(w, err.Error(), http.StatusBadRequest)
            return
        }

        fmt.Printf("Got message: " + move.String() + "\n")
        w.WriteHeader(http.StatusOK)
        w.Write([]byte("Message Received"))
        board.PrintBoard()
    }
}

func main() {

    board := game.Make_Game(3,3)
    board.PrintBoard()
    http.HandleFunc("/", boardHandler(&board))
    http.HandleFunc("/playMove", playMoveHandler(&board))
    http.HandleFunc("/resetBoard", resetBoardHandler(&board))

    fmt.Println("Running ...")
    http.ListenAndServe(":8080", nil)
}
