const router = require('express').Router();

const fs = require('fs');
const path = require("path");
const { Module } = require('vm');

const filePath = path.join(__dirname, "products.json");

const products  = [];

router.get('/',(req,res)=>{

})


module.exports =  router;