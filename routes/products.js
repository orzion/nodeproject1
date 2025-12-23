const router = require('express').Router();
//const validateAdmin = require('../midlewere.js')
const fs = require('fs');
const path = require("path");
//router.use(validateAdmin);
const fileWithPath = path.join(__dirname, "products.json");

const products  = [];

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
    const idFromParams = Number(req.params.id);
    const data = JSON.parse(fs.readFileSync(fileWithPath , "utf-8"));
    const index = data.findIndex(p => p.id === idFromParams);
    if (index !== -1) {
       return res .status(200).send(index);
    }
    
    res.status(404).send("data not found");
});


const validateAdmin = (req, res, next) => {
    const fs  = require("fs");
    const adminPath = path.join(__dirname, "admin.json");
    const admins = JSON.parse(fs.readFileSync(adminPath, "utf-8"));

    const username = req.query.username;
    const password = req.query.password;

    const isAdmin = admins.find(a => a.password === password && a.username === username);

    if (!isAdmin) {
        return res.status(401).send("You are not admin");
    }
    
    next();
};


router.post("/", validateAdmin, (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const price = Number(req.body.id);
    const quantity = Number(req.body.id);
    const data = JSON.parse(fs.readFileSync(fileWithPath , "utf-8"));
    const index = data.findIndex(p => p.id === id);

    if(!index){
        return res.status(409).send("product exsits already");
    }

    const product = req.body;
    fs.writeFileSync(fileWithPath, JSON.stringify(product));
    res.status(201).json("new product was added successfully");

});

module.exports =  router;