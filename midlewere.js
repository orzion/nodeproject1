const router = require('express').Router();

const validateAdmin = (req, res, next) => {
    const fs  = require("fs");
    const adminPath = path.join(__dirname, "admin.json");
    const admins = JSON.parse(fs.readFileSync(adminPath, "utf-8"));

    const username = req.query.username;
    const password = req.query.password;

    const isAdmin = admins.find(a => a.password === password && a.username === username);

    if (isAdmin  === -1) {
        return res.status(401).send("You are not admin");
    }

    next();
};

router.use('/',validateAdmin);

/*module.exports  = router;*/