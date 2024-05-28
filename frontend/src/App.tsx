import React, {useState, useEffect } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/system';



const myTheme = createTheme({
    palette: {
        primary: {
            main: 'darkslategray',
            contrastText: 'white',
        }
    }
});

const GameBoardStyles = styled('div')(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    padding: 8,
    boarderRadius: 4,
}));

const StyledPaper = styled(Paper)(({theme}) => ({
    padding: theme.spacing(2),
    textAlign: 'center',
    color: 'black',
    cursor: 'pointer',
}));


function App() {
    const rows = 3;
    const cols = 3;
    const [player, setPlayer] = useState<number>(1);
    const [moveRow, setMoveRow] = useState<number>(-1);
    const [moveCol, setMoveCol] = useState<number>(-1);
    const [movePlayer, setMovePlayer] = useState<number>(-1);
    const [message, setMessage] = useState<string>('');
    const [response, setResponse] = useState<string>('');
    const [board, setBoard] = useState<number[][]>([[]]);
    const [boardLoading, setBoardLoading] = useState<boolean>(true);

    /*
    funcV
    let startingBoard: number[][] = [];
    for (let i = 0; i < rows; i++) {
        const row: number[] = [];
        for (let j = 0; j < rows; j++) {
            row.push(0);
        }
        startingBoard.push(row);
    }

    setBoard(startingBoard);
     */

    const setTile =(row: number, col: number, value: number) => {
        const newBoard = [...board];
        newBoard[row][col] = value;
        setBoard(newBoard);
    }

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8080/playMove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({
                    moveRow: moveRow,
                    moveCol: moveCol,
                    movePlayer: movePlayer
                }),
            });
            const text = await res.text();
            setResponse(text);
        } catch (err) {
            console.error("Error sending message: ", err);
            setResponse('Error sending message');
        }
        fetchBoard();
        player == 1 ? setPlayer(2) : setPlayer(1);
    }


    const handleClick = (row: number, col: number) => {
        //alert(`Clicked on cell at row ${row}, column ${col}`);
        console.log(`Clicked on cell at row ${row}, column ${col}`);
        setMoveRow(row);
        setMoveCol(col);
        setMovePlayer(player);

        setMessage(`Current Player: ${player}`)
    };

    const handleResetBoard = async () => {
        try {
            const res = await fetch('http://localhost:8080/resetBoard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },
            });
            const text = await res.text();
            setResponse(text);
        } catch (err) {
            console.error("Error sending message: ", err);
            setResponse('Error sending message');
        }
        fetchBoard();
    }



    const GameBoard: React.FC = () => {
        console.log(board);
        return (
            <div>
                { boardLoading ?
                    (<div> Loading... </div>)
                    :
                        (
                            <Grid container spacing={2}>
                                {Array.from({ length: rows }).map((_, row) => (
                                    <React.Fragment key={row}>
                                        {Array.from( {length: cols }).map((_, col) => (
                                            <Grid item xs={4} key={col}>
                                                <Paper onClick={() => handleClick(row, col)}>
                                                    <Typography>
                                                        {board[row][col]}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </Grid>
                    )
                }
            </div>
        )
    };

    const fetchBoard = async () => {
        try {
            const response = await fetch('http://localhost:8080');
            const data = await response.json();
            setBoard(data);
        } catch (error) {
            console.error("Error fetching data: ", error)
        } finally {
            setBoardLoading(false);
        }
    }

    useEffect(() => { fetchBoard(); }, []);

    /*
    useEffect(() => {
        fetch('http://localhost:8080')
        .then(response => response.json())
        .then(data => setBoard(data))
        .catch(error => console.error("Error fetching data: ", error))
    }, []);
     */

    return (
        <div>
            <h1> {message} </h1>
            <GameBoard />
            <form onSubmit={handleSubmit}>
                <p>
                    <text>
                        {`${moveRow}, ${moveCol}`}
                    </text>
                </p>
                <button type='submit'>Send</button>
            </form>
            <button onClick={() => handleResetBoard()}> Reset Board </button>
        </div>
    );
}

export default App;
