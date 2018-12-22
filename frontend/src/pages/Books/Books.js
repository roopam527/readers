import React,{Component} from 'react';

//Material Components
import Grid from '@material-ui/core/Grid';

//Components
import Nav from '../../components/nav'
import BookCard from '../../components/BookCard';
import Loader from '../../components/loader';


class Books extends Component{
    _isMounted = false;
    constructor(){
        super();
       
        this.image="";
        this.authors="";
       
        this.state = {
            cards:[],
            loader:<Loader/>
        }
    }
    removeLoader = () =>{
        this.setState({
            loader:""
        })
    }

    filterImages = (book) =>{
        if(book.imageLinks){
            this.image = book.imageLinks.thumbnail
        }
        else{
             this.image = null ;
        }
    }
    filterTitle = (title) =>{
        let newTitle = "";
        if(title.length > 20){
           newTitle = title.substring(0,20)+"..."
            return newTitle
        }
        return title;
    }

    filterDescription = (Description) =>{
       
        let newDescription = "";
        if(Description.length > 100){
            newDescription = Description.substring(0,100)+"..."
             return newDescription;
         }
        return Description
    }

    filterAuthors = (authors) =>{
        
        let authorStr = "";
        if(authors){
            authors = authors.join(",")
            this.authors = authors
            if(authors.length > 20){
               
                authorStr = authors.substring(0,20)+"...";
                
            }else{
            authorStr = authors
            }
        }
        else{
             
            this.authors = authorStr = "An Unknown" ;
        }
      
        return authorStr
    }

    
    searchBook = (bookName) =>{

       if(bookName === ""){
           bookName="Novel"
       }
       this.setState({
        loader:<Loader/>
    })
    
        fetch(`https://cors-anywhere.herokuapp.com/https://www.googleapis.com/books/v1/volumes?q=${bookName}&maxResults=12`)
        .then((res)=>{
           
            
            return res.json();
        })
        .then((resp)=>{
           
           
            let allCards =  resp.items.map((element, index)=>{
                let book = element.volumeInfo 
               this.filterImages(book)
                
                return(
                    
                        <BookCard 
                            LoggedInUserId={this.props.LoggedInUserId}
                            key={element.id}
                            title={this.filterTitle(book.title)} 
                            authors={this.filterAuthors(book.authors)} 
                            fullAuthorName={this.authors}
                            description={this.filterDescription((element.searchInfo)?element.searchInfo.textSnippet:this.authors + " Thinks This books doesn't Need any description")} 
                            thumbnail={this.image}
                            bookLink={element.id}
                            removeLoader= {this.removeLoader}
                        />
                    
                )
            })
            
        
            if(this._isMounted){
            this.setState({
                cards:allCards
            })
        }

        })
    }
    componentWillMount = () =>{
        this._isMounted = true;
        this.searchBook("Novel");
    
    }
    componentWillUnmount() {
        this._isMounted = false;
      }
    
 render(){
    return(
        <div>
            
            <Nav search={this.searchBook}/>
            {this.state.loader}
            <Grid container className="grid" wrap="wrap" justify="center"  >
            {this.state.cards}
            </Grid>
        </div>
    );
 }   

} 
export default Books;