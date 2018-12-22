import React,{Component} from 'react'
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {graphql,compose} from 'react-apollo';
import {loginUser} from '../queries/queries';
import {withRouter} from 'react-router-dom';
import {setCookie,getCookie} from '../utility_functions/cookies'

const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    button:{
      background:'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
    dense: {
      marginTop: 16,
    },
    menu: {
      width: 200,
    },
  });


  
class LoginCard extends Component{
  constructor(){
    super();
    this.state = {
      email_or_username : "",
      password : "",
      errorbox:""
    }
  }
  changeHandler = (handler,event) =>{
    switch(handler){
     case "email_or_username":
        this.setState({
          email_or_username:event.target.value
        });
        break;
      case "password":
        this.setState({
          password:event.target.value
        });
        break;
      default:
        //console.log("Wrong String");
        break;
      
  }
  }
  LoginUser = async (event) =>{
    event.preventDefault();
     
     const data = await this.props.loginUser({
       variables:{
           email_or_username:this.state.email_or_username,
           password:this.state.password
       },
       refetchQueries:{query:loginUser}
    
    });
    if(data.data.loginUser)
      if(data.data.loginUser.token!=null){
        setCookie("token",data.data.loginUser.token,1)
        this.props.getUserLoggedIn(data.data.loginUser.user_id)
        this.props.history.push('/books')
      }else{
        const box = <div className="error-box">
        <p>{data.data.loginUser.message}</p>
        </div>
       // console.log(data.data.loginUser.message)
        this.setState({
          errorbox:box
        })
      }
   }


   componentWillMount=()=>{
     const user = getCookie("token")
     
     if(user !== "" ){
      this.props.history.push('/books')
     }
   }


    render = () =>{
        const {classes} = this.props
        return(
            <form onSubmit={this.LoginUser} className="login-layout__box--1">
                <div>
                  {this.state.errorbox}
                <TextField
                    id="outlined-email-input"
                    label="Email or Username"
                    className={classes.textField}
                    type="text"
                    name="email"
                    autoComplete="email"
                    margin="normal"
                    variant="outlined"
                    onChange={(event)=>this.changeHandler("email_or_username",event)}

                    />
                    </div>
                    <div>
                    <TextField
                        id="outlined-password-input"
                        label="Password"
                        className={classes.textField}
                        type="password"
                        autoComplete="current-password"
                        margin="normal"
                        variant="outlined"
                    onChange={(event)=>this.changeHandler("password",event)}

                        />
                    </div>
                    <div className="login-layout__btn-container"> 
                   
                      <Button type="submit" fullWidth={true} variant="contained" color="secondary" className={classes.button}>
                         Login
                      </Button>
                   
          </div>
          <div className="login-layout__btn-container" onClick={this.props.changeRoute}> 
                     <Button variant="contained" color="secondary" className={classes.button}>
                        Register
                    </Button>
          </div>
      </form>
        )
    }
}

export default withRouter( compose(
  graphql(loginUser,{name:"loginUser"}),
//  graphql(addBookMutation,{name:"addBookMutation"})

)(withStyles(styles)(LoginCard)))