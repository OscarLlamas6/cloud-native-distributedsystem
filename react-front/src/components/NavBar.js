import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import TwitterIcon from '@material-ui/icons/Twitter';
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CustomizedSwitche from '../components/Switch'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function NavBar() {
  const classes = useStyles();


  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton href="/" edge="start" color="inherit" aria-label="menu">
            <TwitterIcon />
          </IconButton>
          <Button className={classes.title} href="/" color="inherit">
            <Typography variant="h6">
              Tweets
            </Typography>
          </Button>
          <Button className={classes.title} href="/metricas" color="inherit">
            <Typography variant="h6">
              Metricas
            </Typography>
          </Button>
          <CustomizedSwitche edge="end" />
        </Toolbar>
      </AppBar>
    </div>
  );
}