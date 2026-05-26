const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const JWT_SECRET = "my_secret_key";

app.use(express.json());

const users = []; 

function auth(req,res,next){
    const token = req.headers.authorization;

    if(token){
        jwt.verify(token,JWT_SECRET,(err,decoded)=>{
            if(err){
                return res.status(401).send({message : "Unauthorized!"});
            }
            else{
                req.user = decoded;
                next();
            }
        })
    }
    else{
        return res.status(401).send({message : "Unauthorized!"});
    }
}

app.post("/signin",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    let user = users.find(user=>{
        return user.username === username && user.password===password;
    })
    if(!user){
        res.status(403).json({message : "Invalid username or password"});
    }
    else{
        let token = jwt.sign({username : username}, JWT_SECRET);
        user.token = token;
        res.json({message : "You have signed in!", token : token});
    }
})

app.post("/signup",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    users.push({username,password});
    res.json({message : "You have signed up"});
});

app.get("/me",auth,(req,res)=>{
    res.status(200).send({username : req.user.username});  
})


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})