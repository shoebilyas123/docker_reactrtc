import React from 'react';
import { Typography, AppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Local Imports---
import VideoPlayer from './components/videoplayer';
import Options from './components/options';
import Notifications from './components/notifications';

const useStyles = makeStyles((theme) => ({
  appBar: {
    borderRadius: 15,
    margin: '30px 100px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '600px',
    border: '2px solid black',

    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
  image: {
    marginLeft: '15px',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <AppBar position="static" color="primary" className={classes.appBar}>
        <Typography variant="h2" align="center">
          Video Chat App
        </Typography>
      </AppBar>
      {/* Video Player */}
      <VideoPlayer />
      {/* Options   */}
      <Options>
        <Notifications />
      </Options>
    </div>
  );
};

export default App;
