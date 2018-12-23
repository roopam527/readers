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
        change_password:"",
        errorbox:"",
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
    validatePassword =(password)=>{
      const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      return re.test(password)
    }
    validateEmail = (email) => {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
  }
    RegisterUser = (event) =>{

     event.preventDefault();
      if(this.validateEmail(this.state.email)){
        if(this.validatePassword(this.state.password))  {      
          if(this.state.password === this.state.change_password){
          this.setState({
          errorbox:""
        })
      
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
      }else{
        const box = <div className="error-box">

    <p>Confirm Password is not match</p>
    </div>
   
    this.setState({
      errorbox:box
    })
      }
      }else{
        const box = <div className="error-box">

        <p>Password must have</p>
        <ul className="list">
          <li>Minimum eight characters</li>
          <li>At least one letter</li>
          <li> one number</li>
          <li>one special character</li>
        </ul>
        </div>
   
        this.setState({
          errorbox:box
        })
      }
  }else{
    const box = <div className="error-box">
    <p>Please Enter Valid Email Id</p>
    </div>
   
    this.setState({
      errorbox:box
    })
  }
}

render = () =>{

        const {classes} = this.props
        return(
            <form onSubmit={(event)=>this.RegisterUser(event)} className="login-layout__box--1">
            {this.state.errorbox}
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
                    required
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
                    required
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
                    required
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
                    required
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
                    required
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
                    required
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