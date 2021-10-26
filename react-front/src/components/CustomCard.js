import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function CustomCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader
        title={props.tweet.nombre || <CircularProgress />}
        subheader={props.tweet.fecha || <CircularProgress />}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {props.tweet.comentario || 'null'}
        </Typography>
      </CardContent>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {
            /*
              props.tweet.hashtags.split(",").map(item => {
                return '#' + item + '\n'
              })
              */
            JSON.stringify(props.tweet.hashtags)

          }
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton style={{ paddingLeft: '10%' }} aria-label="add to favorites">
          <Typography style={{ paddingRight: '25%' }} variant="body2" color="textSecondary" component="p">
            {props.tweet.upvotes || 'null'}
          </Typography>
          <ThumbUpAltIcon />
        </IconButton>
        <IconButton style={{ paddingLeft: '10%' }} aria-label="share">
          <Typography style={{ paddingRight: '25%' }} variant="body2" color="textSecondary" component="p">
            {props.tweet.downvotes || 'null'}
          </Typography>
          <ThumbDownIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}