const express = require("express");
const app = express();

app.use(express.json());

const users = []; 

function generateToken(){
    let token = Math.random().toString();
    return token;
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
        let token = generateToken();
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

app.get("/me",(req,res)=>{
    const token = req.headers.authorization;
    const user = users.find((user)=>{
        return user.token===token;
    })
    if(!user){
        res.status(401).send({message : "Unauthorized!"});
    }
    else{
        res.status(200).send({username : user.username});
    }
})


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})