const express = require("express")
const router = express.Router()

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const prisma = require("../utils/prisma.js")

router.post("/", async (req, res) => {
	const { username, password } = req.body
	// Get the username and password from the request body

	// Check that a user with that username exists in the database
	// Use bcrypt to check that the provided password matches the hashed password on the user
	// If either of these checks fail, respond with a 401 "Invalid username or password" error

	const existingUser = await prisma.user.findFirst({
		where: {
			username: username,
		},
	})

	const correctPass = await bcrypt.compare(
		password,
		existingUser.password
	)

	if (existingUser && correctPass) {
		const payload = { username: existingUser.username }
		const token = jwt.sign(payload, process.env.JWT_SECRET)
		res.status(200).json({ token })
	} else {
		res.status(401).json({
			error: "Incorect username or password. Please try again",
		})
	}

	// If the user exists and the passwords match, create a JWT containing the username in the payload
	// Use the JWT_SECRET environment variable for the secret key

	// Send a JSON object with a "token" key back to the client, the value is the JWT created
})

module.exports = router
