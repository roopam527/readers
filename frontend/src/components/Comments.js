import React, { Fragment,Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { graphql,Query } from "react-apollo";
import {isCommentLiked,commentDelete} from '../queries/queries'
import Loader from './CircleLoader';
import LikeBtn from './commentLikebtn';
import DeleteIcon from '@material-ui/icons/Delete'

const styles = theme => ({
  
  snackbar: {
    margin: theme.spacing.unit,
    background:"#f7f7f7",
    color:"#000",
    width:"100%",
  },
  typography:{
    color:"#000"
  }
});


class Comments extends Component {
 state = {
  isShown:true
 }
 setNewState = (data) =>{
  this.setState(data);
}
deleteCommentHandler = async (comment_id,user_id) =>{
  // console.log(comment_id);
  // console.log(user_id);
  await this.props.commentDelete({
    variables:{
      comment_id,
      user_id
    },
    refetchQueries:{query:commentDelete}
  })
  this.props.refetch()
}


  render(){
    const { user_f_name,user_l_name,classes,comment,comment_id,user_id,likes,LoggedInUserId } = this.props;
  
   

        return(
            
            <Query query={isCommentLiked} variables={{ comment_id:comment_id,user_id:LoggedInUserId }}>
            {({loading,error,data,refetch })=>{
                if (loading) return <Loader/>;
                if (error) return <Loader/>;
              //console.log(data)
                const action = (
                  <Fragment>   
                    {(user_id === LoggedInUserId )? 
                    <Button color="secondary" size="small" onClick={()=>this.deleteCommentHandler(comment_id,LoggedInUserId)}>
                      <DeleteIcon/>
                    </Button>
                    :<div></div>}
                   
                    <LikeBtn
                    comment_id={comment_id}
                     isLiked={(this.state.isLiked===undefined)?data.isCommentLiked.isLiked:this.state.isLiked}
                     likes={(this.state.likes===undefined)?likes:this.state.likes} 
                     LoggedInUserId={LoggedInUserId}
                     setNewState={this.setNewState}
                    />
                    <Button color="secondary" size="small">
                      {user_f_name+" "+user_l_name}
                    </Button>
                  </Fragment>
             
                );
           
                
                return(
                  
                <div  className="comment_container">
                  <SnackbarContent  className={classes.snackbar} message={comment} action={action} />
                </div>
                )
            }}
                
            </Query>   
            
        )
    }
  }


export default graphql(commentDelete,{name:"commentDelete"})(withStyles(styles)(Comments))