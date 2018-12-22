import {gql} from 'apollo-boost'

const addUser=gql`
      mutation($f_name: String!,$l_name: String! , $username: String!, $email:String! , $password:String!,){
          addUser(f_name:$f_name,l_name:$l_name,username:$username,email:$email,password:$password){
            id  
            
          }
      }
      `;
const loginUser = gql`
      mutation($email_or_username:String!,$password:String!){
        loginUser(email_or_username:$email_or_username,password:$password){
          user_id
          token
          message
        }
      }
    `
const logoutUser = gql`
mutation($token:String!){
  logoutUser(token:$token){
    message
  }
}
`

const addBook =gql`
mutation($book_api_id:String!){
  addBook(book_api_id:$book_api_id){
    id
    likes
    comments
    points
  }
}
`
const bookDislike = gql`
mutation($book_id:String!,$user_id:String!){
  bookDislike(book_id:$book_id,user_id:$user_id){
    id
    likes
    comments
    points
  }
}
`

const addBookLike = gql`
mutation($book_id:String!,$user_id:String!){
  addBookLike(book_id:$book_id,user_id:$user_id){
    id
    likes
    comments
    points
  }
}
`

const isBookLiked = gql`
mutation($book_id:String!,$user_id:String!){
  isBookLiked(book_id:$book_id,user_id:$user_id){
    isLiked
  }
}
`
const whoIsLoggedIn=gql`
query($token:String!){
  
  whoIsLoggedIn(token:$token){
   user_id
 }
 }`

 const addComment = gql`
 mutation($comment:String!,$book_id:String!,$user_id:String!){
  addComment(comment:$comment,book_id:$book_id,user_id:$user_id){
    id
    message
  }
}
 `

 const getAllComments = gql`
 query($id:String!){
   book(id:$id){
     all_comments{
       id
       comment
       user_id
       likes
       user{
         id
         f_name
         l_name
       }
     }
   }
 }
 `

 const isCommentLiked = gql`
    query($comment_id:String!,$user_id:String!){
      isCommentLiked(comment_id:$comment_id,user_id:$user_id){
        isLiked
      }
    }
 `

const commentLike = gql`
mutation($comment_id:String!,$liker_id:String!){
  commentLike(comment_id:$comment_id,liker_id:$liker_id){
    likes
  }
}
`

const commentDislike =gql`
mutation($comment_id:String!,$liker_id:String!){
  commentDislike(comment_id:$comment_id,liker_id:$liker_id){
    likes
  }
}
`

const commentDelete = gql`
mutation($comment_id:String!,$user_id:String!){
  commentDelete(comment_id:$comment_id,user_id:$user_id){
    message
  }
}
`


export {
        addUser,
        loginUser,
        logoutUser,
        addBook,
        isBookLiked,
        whoIsLoggedIn,
        addBookLike,
        bookDislike,
        addComment,
        getAllComments,
        isCommentLiked,
        commentLike,
        commentDislike,
        commentDelete
       };
