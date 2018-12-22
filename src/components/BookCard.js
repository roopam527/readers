import React from 'react';
import PropTypes from 'prop-types';
import {compose, graphql} from 'react-apollo'
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CommentIcon from '@material-ui/icons/Comment';
import ShareIcon from '@material-ui/icons/Share';
import Badge from '@material-ui/core/Badge';
import {Link} from 'react-router-dom';
import {addBook,isBookLiked,addBookLike,bookDislike} from '../queries/queries';
import {withRouter} from 'react-router-dom';
import {PlayBack} from './icons';
import LikeButton from './likeButton'
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';

const theme = createMuiTheme({
    overrides: {
        MuiCardMedia: { // Name of the component ⚛️ / style sheet
            root: { // Name of the rule
                backgroundSize: 'initial', // Some CSS
                backgroundPosition: 'center'
            }
        }
    }
});

const styles = theme => ({
    card: {
        margin: "1rem",
        padding: " 0 1rem 0 0",
        maxWidth: 300
    },

    badge: {
        top: 1,
        right: -15,
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',

        // The border color match the background color.
        border: `2px solid ${theme.palette.type === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[900]}`
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    actions: {
        display: 'flex'
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme
            .transitions
            .create('transform', {duration: theme.transitions.duration.shortest}),
        marginLeft: 'auto',
        [
            theme
                .breakpoints
                .up('sm')
        ]: {
            marginRight: -8
        }
    },
    expandOpen: {
        transform: 'rotate(180deg)'
    },
    avatar: {
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
    }
});

class BookCard extends React.Component {
    constructor() {
        super();
        this.book = { 
        }
        this.state = {
            bookId:"",
            bookLikes: 0,
            bookComments: 0,
            bookPoints: 0,
            isLiked:false
        }
        
    }
  
    setNewState = (data) =>{
        this.setState(data);
    }
    checkIsLiked = async (bookId,userId) =>{
        let isLiked = false;
     
        if(this.props.LoggedInUserId !== null){
           
         isLiked = await this.props.isBookLiked({
          variables:{
            book_id: bookId,
            user_id:userId
  
          },
          refetchQueries: {
            query: isBookLiked
        }
        })
        this.props.removeLoader();
        return isLiked.data.isBookLiked.isLiked; 
      }
   return false
    }
    getBookData  = async()=>{
        
      const data = await  this
      .props
      .addBook({
          variables: {
              book_api_id: this.props.bookLink
          },
          refetchQueries: {
              query: addBook
          }
      })
      const {id,likes,comments,points} = data.data.addBook
     
        this.book = {
            bookId: id,
            bookLikes: likes,
            bookComments: comments,
            bookPoints: points,
            isLiked: await this.checkIsLiked(id,this.props.LoggedInUserId)
          }
          
          this.setState(this.book);
   //  console.log(this.book);
    }

    callGetBookData = async ()=>{
        await this.getBookData()

    }
    componentWillMount =  ()=>{
         this.callGetBookData()

    }
    render = () => {
        const {classes} = this.props;
        const {bookId,bookLikes,bookComments,bookPoints,isLiked} = this.state
      // console.log(this.state)
        return (
            <MuiThemeProvider theme={theme}>
                <Card className={classes.card}>
                    <CardHeader
                        avatar={<Avatar aria-label = "Recipe" className = {classes.avatar} >
                         A 
                         </Avatar>}
                        action={<IconButton aria-label = "Share" >
                         <ShareIcon/> 
                         </IconButton>}
                        title={this.props.title}
                        subheader={this.props.authors}/>
                    <CardMedia
                        className={classes.media}
                        image={this.props.thumbnail}
                        title="Paella dish"/>
                    <CardContent>
                        <Typography component="p"      className="Container"
                                dangerouslySetInnerHTML={{
                                __html: this.props.description
                            }}>
                           

                        </Typography>
                    </CardContent>
                    <CardActions className={classes.actions} disableActionSpacing>
                    
                    <LikeButton
                            bookLikes ={bookLikes}
                            isLiked={isLiked}
                            bookId={bookId}
                            LoggedInUserId={this.props.LoggedInUserId}
                            setNewState={this.setNewState}
                            />
                    <IconButton aria-label="Share">
                        <Badge
                            className={classes.margin}
                            badgeContent={bookComments}
                            color="primary">
                            <Link
                                className="iconlink"
                                to={{
                                pathname: "/discussions",
                                search: "?id=" + this.props.bookLink
                            }}>
                                <CommentIcon
                                    style={{
                                    color: "black"
                                }}/>
                            </Link>
                        </Badge>
                    </IconButton>
                    <IconButton>

                        <Link
                            className="iconlink"
                            to={{
                            pathname: "/discussions",
                            search: "?id=" + this.props.bookLink
                        }}><PlayBack/></Link>
                    </IconButton>
                    <div className="points-box">
                        {bookPoints}
                    </div>
                </CardActions>

                </Card>
            </MuiThemeProvider>
        );
    }
}

BookCard.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withRouter(compose(
  graphql(addBook, {name: "addBook"}),
  graphql(isBookLiked,{name:"isBookLiked"}),
  graphql(addBookLike,{name:"addBookLike"}),
  graphql(bookDislike,{name:"bookDislike"})
  )(withStyles(styles)(BookCard)));