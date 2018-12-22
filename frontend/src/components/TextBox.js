import React,{Component} from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { addComment } from '../queries/queries';
import {compose, graphql} from 'react-apollo';

const styles = theme => ({
    button:{
        background:'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
        color:"white"
      },
  });
  
class TextBox extends Component{

    constructor () {
        super()
        this.state = {
            comment:""
        }
    }
    addComment = async (event) =>{
        event.preventDefault();
       await  this.props.addComment({
            variables:{
                comment:this.state.comment,
                user_id:this.props.LoggedInUserId,
                book_id:this.props.bookId
            }
        })
        this.setState({
            comment:""
        })
        this.props.refetch();
        
    }
    commentChangeHandler = (event) =>{
        this.setState({
            comment:event.target.value
        })

    }
    render = () =>{
        const {classes} = this.props
        //console.log(this.props.LoggedInUserId)
        return(
            <form onSubmit={this.addComment} className="text-box__container">
                <textarea onChange={(event) => this.commentChangeHandler(event)} value={this.state.comment} placeholder="Add a Comment" className="text-area" col="5" row="5"></textarea>
                <Button type="submit"  variant="contained" className={classes.button}>
                        Comment
                      </Button>
            </form>
        )
    }
}

export default compose(
    graphql(addComment,{name:"addComment"})
)(withStyles(styles)(TextBox))