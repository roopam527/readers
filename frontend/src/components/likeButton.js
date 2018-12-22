import React,{Component} from 'react'
import FavoriteIcon from '@material-ui/icons/Favorite';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import {addBookLike,bookDislike} from '../queries/queries';
import {compose, graphql} from 'react-apollo'
import {withRouter} from 'react-router-dom';


class LikeButton extends Component{

    
    newBookDislike = async (isLiked,bookId,LoggedInUserId)=>{
        if(isLiked ){
          //console.log("Dislike")
      const bookData =   await this.props.bookDislike({
            variables:{
                book_id:bookId,
                user_id:LoggedInUserId
            },
            refetchQueries:{
                query:bookDislike
            }
        })
       
        const {id,likes,comments,points} =  bookData.data.bookDislike;
      this.book = {
        bookId: id,
        bookLikes: likes,
        bookComments: comments,
        bookPoints: points,
        isLiked:false
      }
      
     this.props.setNewState(this.book)

        }
        
    }
 
    newBookLike = async (isLiked,bookId,LoggedInUserId)=>{
        if(!isLiked && LoggedInUserId !== null){
          //console.log("Like")
       const bookData = await this.props.addBookLike({
            variables:{
                book_id:bookId,
                user_id:LoggedInUserId
            },
            refetchQueries:{
                query:addBookLike
            }
        })
          //console.log(bookData.data)
        const {id,likes,comments,points} =  bookData.data.addBookLike;
        this.book = {
          bookId: id,
          bookLikes: likes,
          bookComments: comments,
          bookPoints: points,
          isLiked:true
        }
        
        
       this.props.setNewState(this.book)
        

        }else if(LoggedInUserId === null){
            this.props.history.push("/");
        }
        
    }
render = () =>{
  const {isLiked,bookLikes,bookId,LoggedInUserId} = this.props
 // console.log(this.props)
return(
     <IconButton aria-label="Add to favorites" onClick={(isLiked)?(()=>this.newBookDislike(isLiked,bookId,LoggedInUserId)):
                                                            (()=>this.newBookLike(isLiked,bookId,LoggedInUserId))}>
                        <Badge
                            badgeContent={bookLikes}
                            color="primary">
                            <FavoriteIcon
                                style={{
                                color: (isLiked)
                                    ? "#21CBF3"
                                    : "grey"
                            }}/>
                        </Badge>
                    </IconButton>
)
}

}
export default withRouter(compose(
    graphql(addBookLike,{name:"addBookLike"}),
    graphql(bookDislike,{name:"bookDislike"})
    )(LikeButton))