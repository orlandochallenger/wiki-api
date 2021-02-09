//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true });


const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

///////////////////////////Request Targeting All Articles//////////////////////////////

app.route("/articles")
.get((req, res) =>{
    Article.find((err, foundArticles)=>{
        if(!err){
            res.send(foundArticles);
        }else{
            res.send(err);
        }       
    });
})

.post((req, res)=>{

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    
    newArticle.save((err)=>{
        if(!err){
            res.send("Successfully added a new article.");
        }else{
            res.send(err);
        }
    });
})

.delete((req, res)=>{
    Article.deleteMany((err) =>{
        if(!err){
            res.send("Successfully deleted all articles.")
        }else{
            res.send(err);
        }
    });
});

///////////////////////////Request Targeting Specific Articles//////////////////////////////

app.route("/articles/:articleTitle")

.get((req, res) =>{
    Article.findOne({title: req.params.articleTitle}, (err, foundArticles)=>{
        if(foundArticles){
            res.send(foundArticles);
        }else{
            res.send("No Articles matching that title was found.")
        }
    });
})

.put((req, res) =>{
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true}, 
        (err)=>{
            if(!err){
                res.send("Successfully updated article.")
            }
        }
    )
})

.patch((req, res) =>{
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        (err)=>{
            if(!err){
                res.send("Successfully updated article.");
            }else{
                res.send(err);
            }
        }
    );
})

.delete((req, res) =>{
    Article.deleteOne(
        {title: req.params.articleTitle},
        (err)=>{
            if(!err){
                res.send("Successfully deleted the article.");
            }else{
                res.send(err);
            }
        }
    );
});

app.listen(process.env.PORT || 3000, () =>{
    console.log("Server is running on port 3000");
});