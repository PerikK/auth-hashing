const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body
    
    const existingUserName = await prisma.user.findFirst({
        where: {
            username: username
        }
    })

    if (existingUserName) {
        throw new Error('A user with this username already exists')
    }

    const passHash = await bcrypt.hash(password, 8)
    console.log(passHash);
    
    const newUser = await prisma.user.create({
        data: {
            username: username,
            password: passHash
        }
    })

    res
			.status(200)
			.json({
				username: newUser.username,
				password: newUser.password,
			})
});

router.post('/login', async (req, res) => {
    
});

module.exports = router;
