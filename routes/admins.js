const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const fs = require("fs");
const path = require("path");
require('dotenv').config();
const fileWithPath = path.join(__dirname,"admin.json");
const data = JSON.parse(fs.readFileSync(fileWithPath , "utf-8"));

router.post('/login',(req,res)=>{
    const {username,password} = req.body;
    const index = data.find(a => a.username===username && a.password === password);
    if(index){
        const token = jwt.sign(
            { username: username},
            process.env.ACSES_TOKEN,
            { expiresIn: "1h" }

       );
       return res.json({"token": token });
    }
    res.status(401).json({ message: "Invalid credentials" });
})


const auth = (req, res, next)=> {

const header = req.headers["authorization"];
const  token = header.split(" ")[1];
if(!token){
    return  res.status(501).send("no token was sent");
}
jwt.verify(token, process.env.ACSES_TOKEN,(err,username)=>{
    if(err){
        return res.status(403).json({ message: "Invalid token" });
    }
    req.username = username;
})
next();
};



router.get("/homepage",auth,(req,res)=>{
    res.json(req.username);
})


router.get("/" , (req,res)=>{
    
    try {
            const data = fs.readFileSync(fileWithPath , "utf-8");
            if(!data){
                return res.status(404).send("No Products in file");
            }
            const products = JSON.parse(data);
            res.status(200).json(products);
    
    } catch (error) {
            res.send([]);
    }
    
});

router.get("/:id", (req,res)=>{
    const idFromParams = req.params.id;
    const data = JSON.parse(fs.readFileSync(fileWithPath , "utf-8"));
    const index = data.findIndex(p => p.id === idFromParams);
    if (index !== -1) {
       return res.status(200).send(data[index]);
    }
    
    res.status(404).send("data not found");
});

router.post("/",(req,res)=>{
    const id = req.body.id;
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;

    const data = JSON.parse(fs.readFileSync(fileWithPath,"utf-8"));
    const index = data.find(p => p.id === id);
    const indexUesrname = data.find(p=>p.username === username)
        
    if(index !== undefined || indexUesrname || id === undefined || name===undefined || password===undefined || username===undefined){
        return res.status(409).send("admin exsits already or not filed as needed!!")
    }

    const products = req.body;
    
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {

        products.password = hash;   // כאן כבר מוצפן
        data.push(products);        // עכשיו שומרים
        fs.writeFileSync(fileWithPath, JSON.stringify(data));
        res.status(201).json("new admin was added successfully");
        });
    });

});


router.put("/:id",(req,res)=>{
    const idFromParams = req.params.id;
    const updatedId = req.body;
    const data = JSON.parse(fs.readFileSync(fileWithPath,"utf-8"));
    const index = data.findIndex(p => p.id === idFromParams);
    
    if(index === -1){
      return res.status(404).send("admin not found!!");
    } 

    updatedId.id=idFromParams;
    data[index] = updatedId;
    fs.writeFileSync(fileWithPath, JSON.stringify(data));
    res.status(200).json("new admin was edited successfully");
});

router.delete("/:id",(req,res)=>{
    const idFromParams = req.params.id;
    const data = JSON.parse(fs.readFileSync(fileWithPath,"utf-8"));
    const index = data.findIndex(p => p.id === idFromParams);
    
    if(index === -1){
        return res.status(404).send("admin not found");
    } 

    data.splice(index, 1);
    fs.writeFileSync(fileWithPath, JSON.stringify(data));
    res.status(200).json("admin was deleted successfully");
});

module.exports = router;