import React,{Component} from 'react';
import AllRoutes from './routes';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';


const client = new ApolloClient({
   uri:'http://localhost:4000/graphql',
 })
 

class App extends Component{
   

 render(){
    
    return(
      
        <ApolloProvider client={client}>
            <AllRoutes/>
        </ApolloProvider>
       
    );
 }   

} 
export default App;