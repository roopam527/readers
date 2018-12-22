import React, { Component } from 'react'
import { BrowserRouter,Route } from 'react-router-dom'
import Books from './pages/Books/Books';
import Login from './pages/Login/Login';
import Discussions from './pages/Discussions/Discussion';
import {whoIsLoggedIn} from './queries/queries';
import {graphql} from 'react-apollo/graphql';
import {getCookie} from './utility_functions/cookies'

 
class AllRoutes extends Component{
    constructor(){
        super();
        this.state = {
            LoggedInUserId : null
        }
        
    }
    getUserLoggedIn = (user_id)=>{
        this.setState({
            LoggedInUserId:user_id
        })
    }
  

    render(){
      let user_id = null
     // console.log(this.props.data.whoIsLoggedIn)
     if(this.state.LoggedInUserId === null){
         if(this.props.data.whoIsLoggedIn != null)
            user_id =this.props.data.whoIsLoggedIn.user_id
     }else{
         user_id = this.state.LoggedInUserId
     }
        
        return (
            <BrowserRouter>
                 <div>    
                    <Route path="/" exact component={()=><Login getUserLoggedIn={this.getUserLoggedIn}/>}  />
                    <Route path="/search" exact component={Login} />
                    <Route path="/books" exact component={() => <Books LoggedInUserId={user_id}/>} />
        <Route path="/discussions"  component={()=><Discussions  LoggedInUserId={user_id}/>}/>
                 </div>
                </BrowserRouter>
        )
    }
  
}
export default graphql(whoIsLoggedIn,{
    options:(props) =>{
        return {
            variables:{
                token:getCookie("token")
            }
        }
    }
})(AllRoutes);
