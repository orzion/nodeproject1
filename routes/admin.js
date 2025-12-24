const router = require("express").Router();

const fs = require("fs");
const path = require("path");
const fileWithPath = path.join(__dirname,"admin.json");

router.get("/" , (req,res)=>{
    try {
        const data = fs.readFileSync(fileWithPath , "utf-8");
        if(!data){
            return res.send("No Products in file")
        }
        const products = JSON.parse(data);
        res.json(products);
    } catch (error) {
        res.send([]);
    }
});





module.exports = router;