import React, { useEffect, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import socket from '../libs/socket'

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: '#1D9BF0',
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

export default function Notifications() {
    const classes = useStyles();
    const [recents, setRecents] = useState([]);

    useEffect(() => {

        socket.on('datamysql', (data) => {

            setRecents(data.allPubsub)

        })

        socket.on('datamongo', (data) => {

            setRecents(data.allPubsub)

        })

    }, [recents]);




    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center">Api</StyledTableCell>
                        <StyledTableCell align="center">Mensaje</StyledTableCell>
                        <StyledTableCell align="center">Guardados</StyledTableCell>
                        <StyledTableCell align="center">Tiempo</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {recents.map((row) => (
                        <StyledTableRow key={row.idNotificacion}>
                            <StyledTableCell align="center">{row.api}</StyledTableCell>
                            <StyledTableCell align="center">{row.cadena}</StyledTableCell>
                            <StyledTableCell align="center">{row.guardados}</StyledTableCell>
                            <StyledTableCell align="center">{row.tiempo}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}