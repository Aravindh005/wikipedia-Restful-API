const express= require("express")
const bodyparser=require("body-parser")
const ejs=require("ejs")
const mongoose=require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB",{useNewUrlParser:true})
const app=express();

app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

const articleSchema ={
    title:String,
    content:String
}

const Article=mongoose.model("Article",articleSchema)

app.route("/articles")

.get(function(req,res){
    Article.find({}).then(function(foundItems){
        res.send(foundItems);;
    } )
})

.post(function(req,res){
    console.log( req.body.title);
    console.log( req.body.content);
 
    const newArticle= new Article({
     title:req.body.title,
     content:req.body.content
    })
    newArticle.save();
    res.send("received")
 })

.delete(function(req,res){
    Article.deleteMany({}).then(function(err){
        if(err){
            res.send(err);
        }
        else{
            res.send("success");
        }
    })
});

app.route("/articles/:titleName")

.get(function(req,res){
    console.log(req.params.titleName);
    Article.findOne({title:req.params.titleName}).then(function(foundRecord){
        res.send(foundRecord);
        
    })
})

.put(function(req,res){
    Article.updateOne({title:req.params.titleName},{title:req.body.title , content:req.body.content}).then(function
        (err){
            res.send(err);
        })
})

.patch(function(req,res){
    Article.updateOne({title:req.params.titleName},{$set:req.body}).then(function(err){
        res.send(err);
    })
})

.delete(function(req,res){
    Article.deleteOne({title:req.params.titleName}).then(function(err){
        res.send(err);
    })
})


app.listen(3000,function(){
    console.log("server started");
})