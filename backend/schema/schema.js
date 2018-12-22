const graphql = require('graphql');
var mongoose = require('mongoose');
var uniqid = require('uniqid');

const Book = require('../models/book');
const BookLikes = require('../models/bookLikes');
const CommentLikes = require('../models/commentLikes');
const Comment = require('../models/comments');
const User = require('../models/user');
const LoginUser = require("../models/logintokens");

const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLFloat,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID,
} = graphql

const UserType = new GraphQLObjectType({
    name:"user",
    fields:()=>({
        id:{type:GraphQLString},
        f_name:{type:GraphQLString},
        l_name:{type:GraphQLString},
        username:{type:GraphQLString},
        email:{type:GraphQLString},
        password:{type:GraphQLString},
        user_value:{type:GraphQLFloat},
        message:{type:GraphQLString},

        favourites:{
            type:bookLikesType,
            resolve(parent,args){
                return BookLikes.findAll({
                    user_id:parent.id
                })
            }
        }
        
    })
})
const loggedInUser = new GraphQLObjectType({
    name:"loggedInUser",
    fields:()=>({
        id:{type:GraphQLString},
        token:{type:GraphQLString},
        user_id:{type:GraphQLString},
        message:{type:GraphQLString},

        user:{
            type:UserType,
            resolve:async (parent,args)=>{
                return await User.findById(parent.user_id);
            }
        }
    })
})
const BookType = new GraphQLObjectType({
    name:"book",
    fields:()=>({
    id:{type:GraphQLID},
    book_api_id:{type:GraphQLString},
    likes:{type:GraphQLInt},
    comments:{type:GraphQLInt},
    points:{type:GraphQLFloat},
    message:{type:GraphQLString},
    book_likers:{
        type:new GraphQLList(bookLikesType),
        resolve :async  (parent,args)=>{
            
           let output = null;
             output = await  BookLikes.find({book_id:parent.id}, (err, docs) => {
              return docs
              })
            return output;     
        }
    },
    all_comments:{
        type:new GraphQLList(commentType),
        resolve :async  (parent,args)=>{
            
            let output = null;
              output = await  Comment.find({book_id:parent.id}, (err, docs) => {
                 
               return docs
               })
              
             return output;
              
               
         }
    }

})
})

const commentType = new GraphQLObjectType({
    name:'Comment',
    fields:()=>({
    id:{type:GraphQLID},
    comment:{type:GraphQLString},
    book_id:{type:GraphQLString},
    user_id:{type:GraphQLString},
    likes:{type:GraphQLInt},
    message:{type:GraphQLString},
    likers:{
        type:GraphQLList(commentLikesType),
        resolve : async (parent,args) => {
                    
           let output = null;
           output = await  CommentLikes.find({ comment_id:parent.id}, (err, docs) => {
            return docs
            })
          return output ;
    
    }
    },
    user:{
        type:UserType,
        resolve:async (parent,args)=>{
            return await User.findById(parent.user_id);
        }
    }
    })
})
const commentLikesType = new GraphQLObjectType({
    name:'commentlikes',
    fields:() =>({
        id:{type:GraphQLID},
        comment_id:{type:GraphQLString},
        liker_id:{type:GraphQLString},
        message:{type:GraphQLString},
        isLiked:{type:GraphQLBoolean},
        liker:{
            type:UserType,
            resolve(parent,args){
                return User.findById(parent.liker_id)
            }
        }
    })
})
const bookLikesType = new GraphQLObjectType({
    name:'likes',
    fields:() =>({
        id:{type:GraphQLString},
        book_id:{type:GraphQLString},
        user_id:{type:GraphQLString},
        isLiked:{type:GraphQLBoolean},
    message:{type:GraphQLString},

        liker_profile:{
            type:UserType,
            resolve(parent,args){
                return User.findById(parent.user_id)
            }
        },
        book:{
            type:BookType,
            resolve(parent,args){
                return User.find({book_id:parent.book_id})[0];
            }
        }
    })
})
const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        user:{
            type:UserType,
            args:{
                token:{type:new GraphQLNonNull(GraphQLString)}
            },

            resolve: async (parent,args) => {
                let output = null
                await LoginUser.findOne({token:args.token},async(err,docs)=>{
                    if (err){ 
                        return handleError(err);
                    }
                    if(docs)
                        output =   User.findById(docs.user_id)
                })
                return output;
            }
        },
        book:{
            type:BookType,
            args:{
                id:{type:GraphQLString}
            },
            resolve(parent,args){
                return Book.findById(args.id)

            }
        },
        whoIsLoggedIn:{
            type:loggedInUser,
            args:{
                token:{type:new GraphQLNonNull(GraphQLString)},
            },
            resolve:async (parent,args)=>{
               const user = await LoginUser.find({token:args.token})
               if(user.length === 0){
                   return null
               }
               return user[0]
            }
        },
        isCommentLiked:{
            type:commentLikesType,
            args:{
                comment_id:{type:new GraphQLNonNull(GraphQLString)},
                user_id:{type:new GraphQLNonNull(GraphQLString)},
            },
            resolve : async (parents,args) =>{
              let isLiked =false; 
               const data = await  CommentLikes.find({ comment_id:args.comment_id,liker_id:args.user_id })
                    if(data.length>0){
                       isLiked =  true;
                    }
                return {isLiked:isLiked};
            }
        }
        
}})

const Mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        loginUser:{
            type:loggedInUser,
            args:{
            email_or_username:{type:new GraphQLNonNull(GraphQLString)},
            password:{type:new GraphQLNonNull(GraphQLString)}
            },
            resolve : async (parent,args) =>{
                let existing_user = null
                await User.findOne({$or:[{username:args.email_or_username },{email:args.email_or_username}]},(err,docs)=>{
                    if (err){ 
                        return handleError(err);
                    }
                    if(docs && args.password === docs.password){
                        
                        const logging_user_in = new LoginUser({
                            token:uniqid(),
                            user_id:docs.id
                        })
                        existing_user = logging_user_in.save();
                      
                      
                    }
                    else if(docs){
                        existing_user =  {message:"Incorrect Password"};
                    }else {
                        existing_user = {message:"Couldn't found this User"}
                    }
                 
                })
                console.log(existing_user)
                return existing_user;
               
            }
        },
       
        logoutUser:{
            type:loggedInUser,
            args:{
            token:{type:new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent,args){
                LoginUser.deleteOne({token:args.token}, function (err) {
                    if (err){ 
                        return handleError(err);
                    }
                  })    
                  return {message:"successfully logged out"};           
            }
        },
        logoutFromAll:{
            type:loggedInUser,
            args:{
                user_id:{type:new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent,args){
                LoginUser.deleteMany({user_id:args.user_id}, function (err) {
                    if (err){ 
                        return handleError(err);
                    }
                  })    
                  return {message:"successfully logged out from all devices"}           
            }

        },
        addUser:{
            type:UserType,
            args:{    
                f_name:{type:new GraphQLNonNull(GraphQLString)},
                l_name:{type:new GraphQLNonNull(GraphQLString)},
                username:{type:new GraphQLNonNull(GraphQLString)},
                email:{type:new GraphQLNonNull(GraphQLString)},
                password:{type:new GraphQLNonNull(GraphQLString)},
            },

            resolve :async (parent,args)=>{
                let flag=false;
                await User.find({$or:[{username:args.username },{email:args.email}]},(err,docs)=>{
                   
                    if(docs.length==0){
                        flag =true 
                    }
                })
                if(flag){
                let user = new User({
                   f_name:args.f_name,
                   l_name:args.l_name,
                   username:args.username,
                   email:args.email,
                   password:args.password
                })
                return user.save()
            }else{
                return {message:"User Already Exist"}
            }
            }
        },
        addBook:{
            type:BookType,
            args:{
                book_api_id:{type:new GraphQLNonNull(GraphQLString)},
               
            },
            resolve: async (parents,args) => {
                const book = await Book.find({ book_api_id: args.book_api_id });
              
                if (book.length === 0){
                  const newBook = new Book({
                    book_api_id: args.book_api_id,
                    likes: args.likes,
                    points: args.points
                  });
                  await newBook.save();
                  return newBook;
                }
                return book[0];
              }
        },
        addComment:{
            type:commentType,
            args:{
               
                comment:{type:new GraphQLNonNull(GraphQLString)},
                book_id:{type:new GraphQLNonNull(GraphQLString)},
                user_id:{type:new GraphQLNonNull(GraphQLString)},
                
            },
            resolve: async(parents,args) =>{
               const doc = await Book.findById(args.book_id)
                   console.log(doc)
                    doc.comments+=1;
                    doc.save();
                let comment = new Comment({
                comment:args.comment,
                book_id:args.book_id,
                user_id:args.user_id,
                likes:args.likes,
                })
                await comment.save()
                return {
                    id:comment.id,
                    comment:comment.comment,
                    book_id:comment.book_id.toString(),
                    user_id:comment.user_id.toString(),
                    likes:comment.likes

                }
        }

    },
    addBookLike:{
        type:BookType,
        args:{
            
            book_id:{type:new GraphQLNonNull(GraphQLString)},
            user_id:{type:new GraphQLNonNull(GraphQLString)},
        },
        resolve : async (parents,args) => {
           


            let flag=false;
            await BookLikes.find({$and:[{user_id:args.user_id},{book_id:args.book_id}]},(err,docs)=>{
               console.log(docs);
                if(docs.length==0){
                    flag =true 

                }
            })
            if(flag){
                const like_points = await User.findById(args.user_id)
                const doc = await Book.findById(args.book_id)
                console.log(doc)
                 doc.likes+=1;
                doc.points+=like_points.user_value
                 await doc.save();
                 
            let like = new BookLikes({
                book_id:args.book_id,
                user_id:args.user_id,
                points_added:like_points.user_value
            })
               await like.save();
              return doc;
        } 
        return Book.findById(args.book_id)
        }
    },
    bookDislike:{
        type:BookType,
        args:{
            
            book_id:{type:new GraphQLNonNull(GraphQLString)},
            user_id:{type:new GraphQLNonNull(GraphQLString)},
        },
        resolve : async (parents,args) => {
          let book = {}
           let docs = await  BookLikes.find({ user_id:args.user_id,book_id:args.book_id })
                     if(docs.length >0 ){
                        docs=docs[0];
                        book = await Book.findById(args.book_id);
                        book.likes -=1;
                        book.points -= docs.points_added
                        book =  await book.save()
                        BookLikes.deleteOne({user_id:args.user_id,book_id:args.book_id}, function (err) {
                        if (err){ 
                            return handleError(err);
                        }
                    });
                    return book
                    }else{
                        return Book.findById(args.book_id)
                    }
                
           
        }
    },
    isBookLiked:{
        type:bookLikesType,
        args:{
            book_id:{type:new GraphQLNonNull(GraphQLString)},
            user_id:{type:new GraphQLNonNull(GraphQLString)},
        },
        resolve : async (parents,args) =>{
          let isLiked =false; 
           const data = await  BookLikes.find({ user_id:args.user_id,book_id:args.book_id })
                if(data.length>0){
                   isLiked =  true;
                }
            return {isLiked:isLiked};
        }
    },
    commentLike:{
        type:commentType,
        args:{
            comment_id:{type:new GraphQLNonNull(GraphQLString)},
            liker_id:{type:new GraphQLNonNull(GraphQLString)},
        },
        resolve : async (parents,args) => {
            let flag=false;
            let comment = await Comment.findById(args.comment_id)
            await CommentLikes.find({$and:[{liker_id:args.liker_id},{comment_id:args.comment_id}]},(err,docs)=>{
               
                if(docs.length==0 && comment.user_id !== args.liker_id){

                    flag =true 

                }
                
            })
            if(flag){
            const commentLike = new CommentLikes({
                    comment_id:args.comment_id,
                    liker_id:args.liker_id,
                    value_increament:0.1
                })
             await   commentLike.save();

           
                console.log(comment)
                 comment.likes+=1;
                comment = await comment.save();

            const comment_maker = await User.findById(comment.user_id)
                comment_maker.user_value += 0.1
                await comment_maker.save();
            }
         return comment
        
        }
    },
    commentDislike:{
        type:commentType,
        args:{
            comment_id:{type:new GraphQLNonNull(GraphQLString)},
            liker_id:{type:new GraphQLNonNull(GraphQLString)},
        },
        resolve : async (parents,args) => {
              //finding book in CommentLikes table
              let comment = await Comment.findById(args.comment_id);
            await  CommentLikes.find({ comment_id:args.comment_id,liker_id:args.liker_id }, async (err,docs) => {
                if (err){ 
                    return handleError(err);
                }
                //reduce number of likes by one of comment in COMMENT table
                //reduce user_value for the user in USER who wrote the comment
                //delete the Comment like from COMMENTLIKES table
                    if(docs.length>0){
                    docs=docs[0];
                  
                    comment.likes -=1;
                    comment = await comment.save();
                    const comment_maker = await User.findById(comment.user_id);
                    comment_maker.user_value -= docs.value_increament;
                    comment_maker.save()
                    CommentLikes.deleteOne({  comment_id:args.comment_id,liker_id:args.liker_id }, function (err) {
                        if (err){ 
                            return handleError(err);
                        }
                      });
                    }
    
                })
            return comment
        }
    },
    commentDelete:{
        type:commentType,
        args:{
            comment_id:{type:new GraphQLNonNull(GraphQLString)},
            user_id:{type:new GraphQLNonNull(GraphQLString)},
        },
        resolve: async (parent,args) =>{
            let message = {message:"Comment was successfully deleted"}
            await Comment.find({_id:args.comment_id,user_id:args.user_id},async (err,docs)=>{
                if (err){ 
                    return handleError(err);
                }
                if(docs.length === 0){
                    message = {message:"Comment is not found"}
                    return 0;
                }
                docs=docs[0]
               
                const book = await Book.findById(docs.book_id);
                console.log(book)
                if(book.comments>=0)
                    book.comments -= 1;
                await book.save()
                console.log(book)

                await Comment.deleteOne({_id:args.comment_id,user_id:args.user_id}, (err) => {
                    if (err){ 
                        return handleError(err);
                    }
                  });
            })
            return message;
        }
    },
   
},

})

module.exports = new GraphQLSchema({
    query:RootQuery, 
    mutation:Mutation

})