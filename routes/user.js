const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
//login route
router.post("/login", userController.userLogin);
// signup route
router.post("/signup",userController.userSignup);
// get all users route
router.get("/allUsers",userController.getAllUsers);
// router.get("/history",userController.getOrderistory);




module.exports = router;