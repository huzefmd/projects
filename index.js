const express=require("express")
const app=express()
const jwt=require('jsonwebtoken')
const jwt_secret="jhdasfkjh"
const user=[]
app.use(express.json())
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


//midlewaress

const auth=(req,res,nxt)=>{
    const token=req.headers.token
    const decode_token=jwt.verify(token,jwt_secret)
    if(decode_token){
        req.username=decode_token.username
        nxt()
    }
    else{
        res.json({
            msg:"unathorized token"
        })
    }
}

const looger=(req,res,nxt)=>{
    console.log(`the type of request is ${req.method}`)
    nxt()
}

app.get('/',(req,res)=>{
    // res.sendFile(__dirname+'/public/index.html')
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.post('/signin',looger,(req,res)=>{
    const username=req.body.username
    const password=req.body.password
    user.push({
        username,
        password
    })
    res.json({
        msg:"Succesfully Signed in"
    })
    console.log(user)
})


app.post('/login',looger,(req,res)=>{
    const username=req.body.username
    const password=req.body.password
    founduser=null;
    for(let i=0;i<user.length;i++){
        if (user[i].username===username && user[i].password===password){
            founduser=[user[i]]
        }
    }
    if(founduser){
        let token=jwt.sign({username},jwt_secret)
        res.json({
            token:token
        })
    }else{
        res.json({
            msg:"invalid user name and password"
        })
    }
    console.log(user)
})

app.get('/me',auth,(req,res)=>{
    founduser=null;
    for(let i=0;i<user.length;i++){
        if(user[i].username===req.username){
            founduser=user[i]
        }
    }
    if(founduser){
        res.json({
            username:founduser.username,
            password:founduser.password
        })
    }
    else{
        res.json({
            msg:"invalid token proivieded"
        })
    }
})


app.listen(3000,()=>{
    console.log("server is running on port 30000")
})