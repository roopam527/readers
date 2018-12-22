const express = require("express");
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const cors = require("cors");
const schema = require('./schema/schema');
const PORT = 4000;
const app = express();
app.use(cors());



mongoose.connect("mongodb://roopam2:roopam987@ds121624.mlab.com:21624/readspeak",{useNewUrlParser: true })
mongoose.connection.once('open',() =>{
    console.log("Connected to database")

})


app.use("/graphql",graphqlHTTP({
    schema,
    graphiql:true
}))
app.listen(PORT,()=>{
    console.log("Server is running at PORT " + PORT)
})

