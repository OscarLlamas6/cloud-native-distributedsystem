import { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import socket from '../libs/socket'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import TwitterIcon from '@material-ui/icons/Twitter';
import LabelIcon from '@material-ui/icons/Label';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';

import App from '../components/Upvsdown'
import Tophashtags from '../components/Tophashtags'
import RecentPosts from '../components/RecentPosts'
import Notifications from '../components/Notifications'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: '5%'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function Metricas() {
  const classes = useStyles();

  const [totalNoticias, setTotalNoticias] = useState(-1);
  const [totalHashtags, setTotalHashtags] = useState(-1);
  const [totalUpvotes, setTotalUpvotes] = useState(-1);


  useEffect(() => {
    socket.on('datamysql', (data) => {
      setTotalNoticias(data.counttweets[0].count)
      setTotalHashtags(data.counthashtags[0].count)
      setTotalUpvotes(data.countupvotes[0].count)
    })

    socket.on('datamongo', (data) => {
      setTotalNoticias(data.counttweets)
      setTotalHashtags(data.counthashtags)
      setTotalUpvotes(data.countupvotes)
    })

  }, [totalNoticias, totalHashtags]);





  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <Typography variant="h4" >NOTICIAS</Typography>
            <TwitterIcon />
            <Typography variant="h4" >{totalNoticias.toString()}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <Typography variant="h4" >HASHTAGS</Typography>
            <LabelIcon />
            <Typography variant="h4" >{totalHashtags.toString()}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <Typography variant="h4" >TOTAL UPVOTES</Typography>
            <ThumbUpAltIcon />
            <Typography variant="h4" >{totalUpvotes.toString()}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
        </Grid>


        <Grid item xs={6}>
          <App />
        </Grid>

        <Grid item xs={1}>
        </Grid>


        <Grid item xs={4}>
          <Tophashtags />
        </Grid>


        <Grid item xs={12}>
          <div style={{ paddingTop: '5%' }}>
            <Typography variant="h4" >Entradas recientes</Typography>
            <RecentPosts />
          </div>
        </Grid>


        <Grid item xs={12}>
          <div style={{ paddingTop: '5%' }}>
            <Typography variant="h4" >Notificaciones Pubsub</Typography>
            <Notifications />
          </div>
        </Grid>

      </Grid>
    </div>
  );
}
