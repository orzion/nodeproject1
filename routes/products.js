const router = require('express').Router();
const fs = require('fs');
const path = require("path");
const fileWithPath = path.join(__dirname, "products.json");
const bcrypt = require("bcrypt");

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


/*const validateAdmin = (req, res, next) => {
    const fs  = require("fs");
    const adminPath = path.join(__dirname, "admin.json");
    const admins = JSON.parse(fs.readFileSync(adminPath, "utf-8"));

    const username = req.query.username;
    const password = req.query.password;
    bcrypt.compare(password, admins.password, (err, result) => {
        if (!result) {
            return res.status(401).send("username or password incorrect");
        }

        res.status(200).send("login success");
    });

    const isAdmin = admins.find(a => a.password === password && a.username === username);

    if (!isAdmin) {
        return res.status(401).send("You are not admin");
    }



    next();
};*/

const validateAdmin = (req, res, next) => {

    const fileWithPath = path.join(__dirname, "admin.json");
    const admins = JSON.parse(fs.readFileSync(fileWithPath, "utf-8"));

    const username = req.query.username;
    const password = req.query.password;

    // חיפוש אדמין לפי username בלבד
    const admin = admins.find(a => a.username === username);

    if (!admin) {
        return res.status(401).send("You are not admin!");
    }

    // השוואת סיסמה ב-bcrypt
    bcrypt.compare(password, admin.password, (err, result) => {

        if (!result) {
            return res.status(401).send("You are not admin!");
        }

        next(); 
    });
};

router.post("/", validateAdmin,(req,res)=>{
    const id = req.body.id;
    const name = req.body.name;
    const price = Number(req.body.price);
    const quantity = Number(req.body.quantity);
    const category = req.body.category;

    const data = JSON.parse(fs.readFileSync(fileWithPath,"utf-8"));
    const index = data.find(p => p.id === id);
    
    if(index !== undefined || id === undefined || name===undefined || price===null || quantity===null || category===undefined){
        return res.status(409).send("product exsits already or not filed as needed!!")
    } 
    const products = req.body;
    data.push(products);
    fs.writeFileSync(fileWithPath, JSON.stringify(data));
    res.status(201).json("new product was added successfully");
});

router.put("/:id",validateAdmin,(req,res)=>{
    const idFromParams = req.params.id;
    const updatedId = req.body;
    const data = JSON.parse(fs.readFileSync(fileWithPath,"utf-8"));
    const index = data.findIndex(p => p.id === idFromParams);
    
    if(index === -1){
        return res.status(404).send("product not found!!");
    } 

    updatedId.id=idFromParams;
    data[index] = updatedId;
    fs.writeFileSync(fileWithPath, JSON.stringify(data));
    res.status(200).json("product was edited successfully");
});

router.delete("/:id",validateAdmin,(req,res)=>{
    const idFromParams = req.params.id;
    const data = JSON.parse(fs.readFileSync(fileWithPath,"utf-8"));
    const index = data.findIndex(p => p.id === idFromParams);
    
    if(index === -1){
        return res.status(404).send("product not found");
    } 

    data.splice(index, 1);
    fs.writeFileSync(fileWithPath, JSON.stringify(data));
    res.status(200).json("product was deleted successfully");
});

module.exports =  router;