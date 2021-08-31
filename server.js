const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const port=process.env.PORT;
const app= express();
app.use(cors());
app.use(express.json());
const mongoose=require('mongoose');

//Connected Db
mongoose.connect(process.env.REACT_APP_DB).then(re=>{
    console.log("Connected Successfully");
}).catch(err=>{console.err(`Not Connected....${err}`); })

//Schema
let UserSchema=mongoose.Schema({
    email:String,
    title:String,
    description:String,
    toUSD: Number,
    image_url:String 
})
//Model
let UserModel=mongoose.model('crypto',UserSchema);

// get All of Data
app.get('/',(req,res)=>{
    axios.get('https://crypto-explorer.herokuapp.com/crypto-list/').then(result=>{
        res.json(result.data);
    })
})

//add to favorite
app.post('/add-fav',(req,res)=>{
    let crypto=new UserModel({
        email:req.body.email,
        title:req.body.title,
        description:req.body.description,
        toUSD: req.body.toUSD,
        image_url:req.body.image_url
    
    })
    crypto.save();
    res.send(crypto);


})


// get all Favorite
app.get('/favorite/:email',(req,res)=>{
    let email=req.params.email;
    UserModel.find({email:email} ,(err,data)=>{
        if(err){res.status(500).send(err)}
        else{
            res.send(data);
        }
    })

})
// delete from Favorite
app.delete('/delete-fav/:id',(req,res)=>{
 let id =req.params.id;
 UserModel.findByIdAndDelete(id ,function (err,data){

    if(err){res.status(500).send(err)}
    else{
        res.send(`Delete Successfully ${data}`);
    }
 }  )

})

// update from Favorite
app.put('/update-fav/:id',(req,res)=>{
    let id =req.params.id;
    let newBody={title:req.body.title,
        description:req.body.description,
        toUSD: req.body.toUSD,
        image_url:req.body.image_url}

        UserModel.findByIdAndUpdate(id,{$set:newBody},{new:true}).then(
            resp=>{res.send('Success')}
        ).catch(err=>{res.send(err)})
              
   })



app.listen(port ,()=> console.log(`On Port ${port}`))


