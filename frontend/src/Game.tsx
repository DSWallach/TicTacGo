import React, {useState, useEffect } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/system';
import { AuthProvider, useAuth, User } from './Auth';
import Login from './Login';

type Role = 'Player1' | 'Player2' | 'Watcher'

interface GameRoles {
    player1: User | null;
    player2: User | null;
    watchers: User[];
}

const GameBoard: React.FC = () => {
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
    const [roles, setRoles] = useState<GameRoles>({
        player1: null,
        player2: null,
        watchers: [],
    });




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

    console.log(board);

    const { user } = useAuth();
    useEffect(() => {
        fetchBoard();
        setPlayer(getRole(user));
    }, []);

    console.log('david: ', user);

    const getRole = (user: User | null): number => {
        if (user == roles.player1) {
            return -1
        } else if (user == roles.player2) {
            return 1
        } else {
            return 0
        }
    }

    /*
    const assignRole = (user: User, role: string): Role => {
        setRoles(prevRoles => {
            if (role == 'p1') {
                return {...prevRoles, player1: user}
            } else if (role == 'p2') {
                return {...prevRoles, player2: user}
            } else {
                return {...prevRoles, watchers: [...prevRoles.watchers, user] }
            }
        });

        if (role == 'p1') {
            return 'Player1'
        } else if (role == 'p2') {
            return 'Player2'
        } else {
            return 'Watcher'
        }

    }
     */

    const assignRole = (user: User): Role => {
        setRoles(prevRoles => {
            if (!prevRoles.player1) {
                return { ...prevRoles, player1: user };
            } else if (!prevRoles.player2) {
                return { ...prevRoles, player2: user };
            } else {
                return { ...prevRoles, watchers: [...prevRoles.watchers, user] };
            }
        });

        if (!roles.player1) {
            return 'Player1';
        } else if (!roles.player2) {
            return 'Player2';
        } else {
            return 'Watcher';
        }
    };

    const hangleAssignRole = (user: User) => {
        const role = assignRole(user);
    };

    const setTile =(row: number, col: number, value: number) => {
        const newBoard = [...board];
        newBoard[row][col] = value;
        setBoard(newBoard);
    };

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
    };


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



    return (
        <div>
            <h1> {message} </h1>
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
            <form onSubmit={handleSubmit}>
                <p>
                    <text>
                        {`${moveRow}, ${moveCol}`}
                    </text>
                </p>
                <button
                    type='submit'
                    //disabled={user_player != currentPlayer}
                >
                    Send</button>
            </form>
            <button onClick={() => handleResetBoard()}> Reset Board </button>
        </div>
    )
};

export default GameBoard;
