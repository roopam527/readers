import React,{Component} from 'react'

import LoginCard from '../../components/LoginCard';

import RegisterCard from '../../components/RegisterCard';

class Login extends Component{
    constructor() {
        super();
        this.state={
            route:"login"
        }
    }
    changeRoute = () =>{
        //console.log(this.state.route)
        if(this.state.route === "login"){
            this.setState({
                route:"register"
            })
        }
        else{
            this.setState({
                route:"login"
            })
        }
       // console.log(this.state.route)
    }
    render = () =>{
      
        return (
            <div className="login-layout">
                {(this.state.route === "login")?
                <LoginCard changeRoute={this.changeRoute} getUserLoggedIn={this.props.getUserLoggedIn}/>:
                <RegisterCard changeRoute={this.changeRoute}/>
                }
                
                
            </div>
        )
    }
}

export default Login;