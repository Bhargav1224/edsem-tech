const express = require("express");
const router = express.Router();
//For validations using express-validator
const { body, validationResult } = require("express-validator");
//UserSchema from user models
const User = require("../models/user.models");
//jsonwebtoken for authentication
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Generating new Token for user using jsonwebtoken
const newToken = (user) => {
	return jwt.sign({ id: user.id }, "EDSEM");
};

//posting data to MongooDB database
//signup
//validation for first_name ,email and password
router.post(
	"singup",
	body("first_name")
		.trim()
		.not()
		.isEmpty()
		.withMessage("First Name cannot be Empty"),
	body("email").isEmail().withMessage("Please enter a valid Email Address"),
	body("password")
		.trim()
		.isLength({ min: 6 })
		.withMessage("Password length should be 6 or more"),
	async (req, res) => {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return res.status(401).json({ message: result.array()[0].param });
		}

		let user;
		try {
			user = await User.create(req.body);
			const token = newToken(user);

			return res
				.status(201)
				.send({ message: "Success", userData: user, token });
		} catch (err) {
			return res.status(500).send({ message: "Failed" });
		}
	}
);

//Getting all the register data from database

router.get("singup", async (req, res) => {
	try {
		const users = await User.find().lean().exec();
		return res.status(200).json({ userData: users });
	} catch (err) {
		console.log("Bad request");
		return res.status(400).json({ message: "Bad Request" });
	}
});

//login the user

router.post("signin", async (req, res) => {
	let user;
	try {
		user = await User.findOne({ email: req.body.email }).exec();
		//checking email id
		if (!user) {
			return res
				.status(401)
				.json({ message: "Email or Password is Incorrect" });
		}

		//checking password
		const match = await user.checkPassword(req.body.password);

		if (!match) {
			return res
				.status(401)
				.json({ message: "Email or Password is Incorrect" });
		}
		//generating token

		const token = newToken(user);
		res.status(201).json({ status: "Success", userData: user, token });
	} catch (error) {
		return res.status(500).json({ error: "Failed" });
	}
});

module.exports = router;
