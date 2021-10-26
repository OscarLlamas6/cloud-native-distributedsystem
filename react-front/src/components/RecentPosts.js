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

export default function RecentPosts() {
    const classes = useStyles();
    const [recents, setRecents] = useState([]);

    useEffect(() => {

        socket.on('datamysql', (data) => {

            console.log(data.recentposts)
            setRecents(data.recentposts)

        })

        socket.on('datamongo', (data) => {

            console.log(data.recentposts)
            setRecents(data.recentposts.reverse())

        })

    }, [recents]);




    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell align="center">Coment</StyledTableCell>
                        <StyledTableCell align="center">Date</StyledTableCell>
                        <StyledTableCell align="center">Hashtags</StyledTableCell>
                        <StyledTableCell align="center">Upvotes</StyledTableCell>
                        <StyledTableCell align="center">Downvotes</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {recents.map((row) => (
                        <StyledTableRow key={row.idTweet ? row.idTweet : row._id}>
                            <StyledTableCell component="th" scope="row">
                                {row.nombre}
                            </StyledTableCell>
                            <StyledTableCell align="center">{row.comentario}</StyledTableCell>
                            <StyledTableCell align="center">{row.fecha}</StyledTableCell>
                            <StyledTableCell align="center">{row.hashtags}</StyledTableCell>
                            <StyledTableCell align="center">{row.upvotes}</StyledTableCell>
                            <StyledTableCell align="center">{row.downvotes}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}