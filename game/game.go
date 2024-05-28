package game

import (
    "fmt"
    "errors"
)

type Board struct {
    rows int
    cols int
    board [][]int
    move_history []int
}

func (b Board) GetBoard () [][]int{
    return b.board
}

func (b Board) PrintBoard () {
    for i := 0; i < b.rows; i++ {
        for j := 0; j < b.cols; j++ {
            fmt.Printf("%d ", b.board[i][j])
        }
        fmt.Println()
    }
    fmt.Println()
}

func (b Board) PlayMove(row int, col int, color int) (int, error) {
    if row >= b.rows {
        return -1, errors.New("Row Limit Exceeded")
    } else if col >= b.cols {
        return -1, errors.New("Column Limit Exceeded")
    } else {
        b.board[row][col] = color
        return b.CheckState(), nil
    }
}

func (b Board) ResetBoard() {
    for i := range b.board {
        for j := range b.board[i] {
            b.board[i][j] = 0
        }
    }
}

func (b Board) CheckState() (int) {
    victor := -1

    // Check Rows
    for i := 0; i < b.rows; i++ {
        sum := 0
        for j:= 0; j < b.cols; j++ {
            sum += b.board[i][j]
        }
        if sum == b.rows {
            victor = 1
        } else if sum == 2 * b.rows {
            victor = 2
        }
    }

    // Check Columns
    for j := 0; j < b.cols; j++ {
        sum := 0
        for i:= 1; i < b.rows; i++ {
            sum += b.board[i][j]
        }
        if sum == b.rows {
            victor = 1
        } else if sum == 2 * b.rows {
            victor = 2
        }
    }

    // Check Diagonal
    return victor
}

func Make_Game(rows, cols int) Board {
    board := make([][]int, rows)
    for i := range board {
        board[i] = make([]int, cols)
        for j := range board[i] {
            board[i][j] = 0
        }
    }
    mh := make([]int, 10)
    return Board{
        rows: rows,
        cols:cols,
        board: board,
        move_history: mh,
    }
}


/*
func main() {

    board := make_game(3, 3)
    var won int
    var err error
    board.PrintBoard()
    won, err = board.PlayMove(2, 0, 1)
    if err != nil { fmt.Println(err) }
    fmt.Println(won)
    won, err = board.PlayMove(5, 0, 1)
    if err != nil { fmt.Println(err) }
    fmt.Println(won)
    won, err = board.PlayMove(1, 1, 2)
    if err != nil { fmt.Println(err) }
    fmt.Println(won)
    board.PrintBoard()
    won, err = board.PlayMove(0, 1, 2)
    if err != nil { fmt.Println(err) }
    fmt.Println(won)
    board.PrintBoard()
    won, err = board.PlayMove(1, 1, 2)
    if err != nil { fmt.Println(err) }
    fmt.Println(won)
    board.PrintBoard()
    won, err = board.PlayMove(2, 1, 2)

    if err != nil { fmt.Println(err) }
    fmt.Println(won)

    board.PrintBoard()
}
*/
