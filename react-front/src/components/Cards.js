import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CustomCard from './CustomCard'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    grid: {
        marginTop: '1%'
    }
}));

export default function Cards(props) {
    const classes = useStyles();

    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
    })

    return (
        <div className={classes.root}>
            {
                width > 850 ?
                    <Grid container spacing={3} className={classes.grid}>
                        {props.tweets.map(item => {
                            return <Grid key={item.idTweet || item._id} item xs={4}>
                                <Paper className={classes.paper}><CustomCard tweet={item} /></Paper>
                            </Grid>
                        })
                        }
                    </Grid> :


                    width > 600 ?
                        <Grid container spacing={3} className={classes.grid}>
                            {props.tweets.map(item => {
                                return <Grid key={item.idTweet} item xs={6}>
                                    <Paper className={classes.paper}><CustomCard tweet={item} /></Paper>
                                </Grid>
                            })
                            }
                        </Grid> :

                        <Grid container spacing={3} className={classes.grid}>
                            {props.tweets.map(item => {
                                return <Grid key={item.idTweet} item xs={12}>
                                    <Paper className={classes.paper}><CustomCard tweet={item} /></Paper>
                                </Grid>
                            })
                            }
                        </Grid>


            }
        </div>
    );
}
