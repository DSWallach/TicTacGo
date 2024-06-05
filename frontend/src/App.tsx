import React, {useState, useEffect } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/system';
import { AuthProvider, useAuth } from './Auth';
import Login from './Login';
import GameBoard from './Game';



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


const App: React.FC = () => {

    /*
       useEffect(() => {
       fetch('http://localhost:8080')
       .then(response => response.json())
       .then(data => setBoard(data))
       .catch(error => console.error("Error fetching data: ", error))
       }, []);
     */


    const Content: React.FC = () => {
        const { isAuthenticated } = useAuth();
        return (
            <div>
                {
                    isAuthenticated ? (
                        <div>
                            <GameBoard />
                        </div>
                    ) : (
                        <div>
                            <h1> </h1>
                            <Login />
                        </div>
                    )
                }
            </div>
        );
    };

    return (
        <AuthProvider>
            <Content />
        </AuthProvider>
    );
}

export default App;
