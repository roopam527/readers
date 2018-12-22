import React,{Component} from 'react'
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import {graphql,compose} from 'react-apollo';
import {addUser} from '../queries/queries'
const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
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
  
class RegisterCard extends Component{
    constructor(){
      super();
      this.state={
        f_name:"",
        l_name:"",
        email:"",
        username:"",
        password:"",
        change_password:""
      }
    }
    changeHandler = (handler,event) =>{
      switch(handler){
       case "f_name":
          this.setState({
            f_name:event.target.value
          });
          break;
        case "l_name":
          this.setState({
            l_name:event.target.value
          });
          break;
        case "email":
          this.setState({
            email:event.target.value
          });
          break;
        case "username":
          this.setState({
            username:event.target.value
          });
          break;
        case "password":
          this.setState({
            password:event.target.value
          });
          break;
          case "change_password":
          this.setState({
            change_password:event.target.value
          });
          break;
          default:
            //console.log("wrong String");
            break;
        
    }
    }

    RegisterUser = (event) =>{
     event.preventDefault();
      
      this.props.addUser({
        variables:{
            f_name:this.state.f_name,
            l_name:this.state.l_name,
            username:this.state.username,
            email:this.state.email,
            password:this.state.password
        },
        refetchQueries:[{query:addUser}]
    });
    }

    render = () =>{

        const {classes} = this.props
        return(
            <form onSubmit={(event)=>this.RegisterUser(event)} className="login-layout__box--1">
             <div className="util_center">
                <TextField
                    id="outlined-fname-input"
                    label="First Name"
                    className={classes.textField}
                    type="input"
                    name="fname"
                    autoComplete="fname"
                    margin="normal"
                    variant="outlined"
                    onChange={(event)=>this.changeHandler("f_name",event)}

                    />
                     <TextField

                    id="outlined-lname-input"
                    label="Last Name"
                    className={classes.textField}
                    type="input"
                    name="lname"
                    autoComplete="lname"
                    margin="normal"
                    variant="outlined"
                    onChange={(event)=>this.changeHandler("l_name",event)}

                    />
                    
                    </div>
             <div className="util_center">
                <TextField
                    id="outlined-username-input"
                    label="User Name"
                    className={classes.textField}
                    type="input"
                    name="username"
                    autoComplete="username"
                    margin="normal"
                    variant="outlined"
                    onChange={(event)=>this.changeHandler("username",event)}

                    />
                    <TextField
                    id="outlined-email-input"
                    label="Email"
                    className={classes.textField}
                    type="email"
                    name="email"
                    autoComplete="email"
                    margin="normal"
                    variant="outlined"
                    onChange={(event)=>this.changeHandler("email",event)}

                    />
                    </div>
                
                    <div className="util_center">
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
                        <TextField
                        id="outlined-password-input-2"
                        label="Confirm Password"
                        className={classes.textField}
                        type="password"
                        autoComplete="current-password"
                        margin="normal"
                        variant="outlined"
                    onChange={(event)=>this.changeHandler("change_password",event)}

                        />
                    </div>
                    
                    <div className="login-layout__btn-container"> 
                    
                      <Button type="submit" fullWidth={true} variant="contained" color="secondary" className={classes.button}>
                          Register
                      </Button>
                   
                    </div>
                    <div className="login-layout__btn-container" onClick={this.props.changeRoute}> 
                      <Button variant="contained" color="secondary" className={classes.button}>                               
                        Login
                      </Button>
                    </div>
      </form>
        )
    }
}



export default  compose(
  graphql(addUser,{name:"addUser"}),
//  graphql(addBookMutation,{name:"addBookMutation"})

)(withStyles(styles)(RegisterCard));