import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import SnackbarContent from '@material-ui/core/SnackbarContent';
import LikeButton from './likeButton'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    background:'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
   
  },
  
  snackbar: {
    margin: theme.spacing.unit,
    background:"#f7f7f7",
    color:"#000",
  },
  snackbarSmall:{
    background:"#f7f7f7",
    color:"#000",
    margin:"0 0.5rem",
    minWidth:"15px"
  },
  
});

function PaperSheet(props) {
  
  const {bookId,bookLikes,setNewState,LoggedInUserId,isLiked,classes} =props

  const action = (
    <Button color="secondary" size="small">
      More from this writer
    </Button>
  );
  return (

    <div>
      <Paper className={classes.root} elevation={1}>
        <Typography className="book_header" variant="h2" component="h2">
        {props.title}
        </Typography>
        <Typography component="div">
        <p className="Container" dangerouslySetInnerHTML={{__html: 
        props.description}}></p>
        
        </Typography>
        <Grid container className="grid" wrap="wrap" justify="flex-start"  >
        {
          props.authors.map((author,index) =>{
          return  <SnackbarContent className={classes.snackbar} key={index} message={author} action={action} />

          })
        }
       
        </Grid>
       
        <div className="book_buttons">
        <SnackbarContent className={classes.snackbarSmall}  message={props.bookPoints} />
                  <LikeButton
                   bookLikes ={bookLikes}
                   isLiked={isLiked}
                   bookId={bookId}
                   LoggedInUserId={LoggedInUserId}
                   setNewState={setNewState}
                            />
          </div>
      </Paper>
    </div>
  );
}

PaperSheet.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PaperSheet);