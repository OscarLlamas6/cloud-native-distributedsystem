import './App.css';
import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createTheme, ThemeProvider } from '@material-ui/core'
import Tweets from './pages/Tweets'
import NavBar from './components/NavBar'
import Metricas from './pages/Metricas'
import socket from './libs/socket'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1D9BF0',
        },
    },
});

function App() {

    const [pubSub, setPubSub] = useState([]);
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {

        socket.on('datamysql', (data) => {
            setPubSub(data.allPubsub)

            let notificationsCount = window.localStorage.getItem('notificaciones')

            if (notificationsCount !== null && notificationsCount !== undefined) {

                let notificationsCountParse = JSON.parse(notificationsCount)

                if (notificationsCountParse.notificationsCount !== data.allPubsub.length) {

                    console.log('Cantidad de notificaciones', data.allPubsub[0])
                    let message = `Api: ${data.allPubsub[0].api}\n
                Cantidad de datos insertados: ${data.allPubsub[0].guardados}\n
                Tiempo: ${data.allPubsub[0].tiempo}\n
                `
                    setAlertMessage(message)

                    setAlert(true)
                    window.localStorage.setItem('notificaciones', JSON.stringify({ notificationsCount: data.allPubsub.length }))
                }

            } else {
                window.localStorage.setItem('notificaciones', JSON.stringify({ notificationsCount: data.allPubsub.length }))
            }


        })
    }, [pubSub]);

    useEffect(() => {

        socket.on('datamongo', (data) => {
            setPubSub(data.allPubsub)

            let notificationsCount = window.localStorage.getItem('notificaciones')

            if (notificationsCount !== null && notificationsCount !== undefined) {

                let notificationsCountParse = JSON.parse(notificationsCount)

                if (notificationsCountParse.notificationsCount !== data.allPubsub.length) {

                    console.log('Cantidad de notificaciones', data.allPubsub[0])
                    let message = `Api: ${data.allPubsub[0].api}\n
                Cantidad de datos insertados: ${data.allPubsub[0].guardados}\n
                Tiempo: ${data.allPubsub[0].tiempo}\n
                `
                    setAlertMessage(message)

                    setAlert(true)
                    window.localStorage.setItem('notificaciones', JSON.stringify({ notificationsCount: data.allPubsub.length }))
                }

            } else {
                window.localStorage.setItem('notificaciones', JSON.stringify({ notificationsCount: data.allPubsub.length }))
            }

        })
    }, [pubSub]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Snackbar open={alert} autoHideDuration={10000} onClose={handleClose}>
                <MuiAlert onClose={handleClose} severity="success">
                    {alertMessage}
                </MuiAlert>
            </Snackbar>
            <Router>
                <NavBar />
                <Switch>
                    <Route exact path="/">
                        <Tweets />
                    </Route>
                    <Route exact path="/metricas">
                        <Metricas />
                    </Route>
                </Switch>
            </Router>
        </ThemeProvider>
    );
}

export default App;


/*

//window.localStorage.setItem('notificaciones', JSON.stringify(data.allPubsub))
            //window.localStorage.clear()
            //console.log(data.allPubsub)
            //console.log(data.allPubsub.length)
            //setPubSub(data.allPubsub)
*/