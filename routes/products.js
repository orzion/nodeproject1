const router = require('express').Router();

const fs = require('fs');
const path = require("path");

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
    const fileWithPath2 = path.join(__dirname, "admin.json");
    const data = JSON.parse(fs.readFileSync(fileWithPath2, "utf-8"));

    const adminId = req.body.id; 
    const findAdmin = data.findIndex(p => p.id === adminId);

    if (findAdmin === -1) {
        return res.status(401).send("You are not admin, no permission");
    }

    next();
};

router.post('/', validateAdmin, (req, res) => {
    const id = req.body.id;
    console.log("BODY:", req.body);
    const data = JSON.parse(fs.readFileSync(fileWithPath, "utf-8"));

    const index = data.findIndex(p => p.id === id);

    if (index !== -1) {
        return res.status(409).send('Error: product already exists');
    }

    const newProduct = req.body;
    data.push(newProduct);

    fs.writeFileSync(fileWithPath, JSON.stringify(data));

    res.status(201).json("New product was added successfully");
});

module.exports =  router;