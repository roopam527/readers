import React,{ Component} from 'react';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import {commentLike,commentDislike} from "../queries/queries"
import {compose, graphql} from 'react-apollo'
import {withRouter} from 'react-router-dom';


class CommentLikeBtn extends Component{
     
    newCommentLike = async (isLiked,commentId,LoggedInUserId)=>{
        if(!isLiked && LoggedInUserId !== null){
          //console.log("Like")
       const commentData = await this.props.commentLike({
            variables:{
                comment_id:commentId,
                liker_id:LoggedInUserId
            },
            refetchQueries:{
                query:commentLike
            }
        })
         // console.log (commentData.data)
        const {likes} =  commentData.data.commentLike;
        const comment = {
          likes:likes,
          isLiked:true
        }
        
        
       this.props.setNewState(comment)
        

        }else if(LoggedInUserId === null){
            this.props.history.push("/");
        }
        
    }
    newCommentDislike = async (isLiked,commentId,LoggedInUserId)=>{
        if(isLiked ){
         // console.log("Dislike")
      const commentData =   await this.props.commentDislike({
            variables:{
                comment_id:commentId,
                liker_id:LoggedInUserId
            },
            refetchQueries:{
                query:commentDislike
            }
        })
       
        const {likes} =  commentData.data.commentDislike;
      const comment = {
        likes:likes,
        isLiked:false
      }
      
     this.props.setNewState(comment)

        }
        
    }
    render(){
        const {isLiked,likes,LoggedInUserId,comment_id} = this.props
       // console.log(isLiked)
        return(
            <Button 
            color="secondary" 
            size="small" 
            onClick={()=>(isLiked)?this.newCommentDislike(isLiked,comment_id,LoggedInUserId):
                                    this.newCommentLike(isLiked,comment_id,LoggedInUserId)}>
                <Badge badgeContent={likes} color="primary">
                    <FavoriteIcon style={{color:(isLiked)?"red":"grey"}}/>
                </Badge>
            </Button>
        )
    }
}

export default withRouter(compose(
    graphql(commentLike,{name:"commentLike"}),
    graphql(commentDislike,{name:"commentDislike"})
    )(CommentLikeBtn))