import React,{Component } from 'react'
import Header from '../../components/Header'
import TextBox from '../../components/TextBox'
import BookComments from '../../components/Comments'
import {parseURLParams} from '../../utility_functions/parseUrlParams';
import {addBook,getAllComments,isBookLiked} from '../../queries/queries';
import {compose, graphql} from 'react-apollo';
import { Query } from "react-apollo";
import Loader from '../../components/loader';



class Discussion extends Component{
    _isMounted = false
    constructor(){
        super();
        this.book={
            title:"",
            description:"",
            authors:[],
            api_id:""
        }
        this.state={}
        this.bookmeta={}
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
        return isLiked.data.isBookLiked.isLiked;
      }
   return false
    }
    componentWillMount = async () =>{
        this._isMounted = true;
       // console.log(window.location.href)
        const api_id = parseURLParams(window.location.href).id[0];
        
        fetch("https://www.googleapis.com/books/v1/volumes/"+api_id)
        .then((resp)=>{
            return resp.json();
        })
        .then((result)=>{
            this.book = {
              title:result.volumeInfo.title,
              authors:result.volumeInfo.authors,
              description:result.volumeInfo.description,
              api_id:api_id
            }
           
        })
        const bookData = await this.props.addBook({
            variables:{
                book_api_id:api_id
            },
            refetchQueries:{
                query:addBook
            }
        })
        
        const {id,likes,comments,points} = bookData.data.addBook
        this.bookmeta = {
            bookId: id,
            bookLikes: likes,
            bookComments: comments,
            bookPoints: points,
            isLiked: await this.checkIsLiked(id,this.props.LoggedInUserId)
          }
          if(this._isMounted){
          this.setState(this.bookmeta);
          }
    
    }
    componentWillUnmount() {
        this._isMounted = false;
      }
    render = () => {
        const {bookId,bookLikes,bookPoints,isLiked} =this.state
//console.log(this.state)
        return(
        <Query  query={getAllComments} variables={{ id:bookId }} >
            {({loading,error,data,refetch })=>{
                if (loading) return <Loader/>;
                if (error) return <Loader/>;
                
                return (
                   
                    <div className="discussion-layout">
                    <Header
                      bookLikes={bookLikes}
                      bookId={bookId}
                      setNewState = {this.setNewState}
                      LoggedInUserId={this.props.LoggedInUserId}
                      isLiked={isLiked}
                      bookPoints={bookPoints}
                      title={this.book.title}
                      authors={this.book.authors}
                      description={this.book.description}
                      />
                    <TextBox  LoggedInUserId={this.props.LoggedInUserId} refetch={refetch} bookId={bookId}/>
                    <div className="comments_container">
                   {data.book.all_comments.map((element,index)=>{
                       return  <BookComments 
                                        key={element.id}
                                        comment={element.comment} 
                                        user_id={element.user_id}
                                        comment_id={element.id}
                                        likes={element.likes}
                                        refetch={refetch}
                                        user_f_name={element.user.f_name}
                                        user_l_name={element.user.l_name}
                                        LoggedInUserId={this.props.LoggedInUserId}
                                        />
                   })}
                   
                   </div>
                </div>
                );
            }}
        </Query>
        )
    }
}

export default compose(
    graphql(addBook,{name:"addBook"}),
    graphql(isBookLiked,{name:"isBookLiked"}),

)(Discussion);