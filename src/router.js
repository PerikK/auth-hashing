const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const router = express.Router()

const {
	MissingFieldsError,
	ExistingUserError,
	UserNotFoundError,
	InvalidPasswordError,
} = require("./errors/errors.js")

router.post("/register", async (req, res) => {
	const { username, password } = req.body

	if (!username || !password) {
		throw new MissingFieldsError(
			"Username AND password must be provided in order to create a new user"
		)
	}

	const existingUserName = await prisma.user.findFirst({
		where: {
			username: username,
		},
	})

	if (existingUserName) {
		throw new ExistingUserError(
			"A user with this username already exists"
		)
	}

	const passHash = await bcrypt.hash(password, 8)
	console.log(passHash)

	const newUser = await prisma.user.create({
		data: {
			username: username,
			password: passHash,
		},
	})

	res.status(200).json({
		username: newUser.username,
		password: newUser.password,
	})
})

router.post("/login", async (req, res) => {
	const { username, password } = req.body

	if (!username || !password) {
		throw new MissingFieldsError(
			"Username AND password must be provided in order to create a new user"
		)
	}

	const existingUser = await prisma.user.findFirst({
		where: {
			username: username,
		},
	})

	// let validPass
	if (!existingUser) {
		throw new UserNotFoundError("There is no user with this username")
	}

	const validPass = await bcrypt.compare(
		password,
		existingUser.password
	)

	if (!validPass) {
		throw new InvalidPasswordError(
			"Invalid password provided. Please try again"
		)
	}

    const payload = { username: existingUser.username }
    const token = jwt.sign(payload, process.env.JWT_SECRET)
    res.status(200).json({ token })
    
	// if (validPass && existingUser) {
	// } else {
	// 	throw new InvalidPasswordError(
	// 		"Invalid password provided. Please try again"
	// 	)
	// }
})

module.exports = router
