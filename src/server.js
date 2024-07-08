const express = require("express")
require("express-async-errors")
const app = express()

const cors = require("cors")
const morgan = require("morgan")

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

const registerLoginRouter = require("./router")

const {
	MissingFieldsError,
	ExistingUserError,
    UserNotFoundError,
    InvalidPasswordError
} = require("./errors/errors.js")

app.use("/", registerLoginRouter)

app.use((error, req, res, next) => {
    if (error instanceof MissingFieldsError) {
        return res.status(400).json({ error: error.message })
    }
    if (error instanceof UserNotFoundError) {
        return res.status(404).json({ error: error.message })
    }
    if (error instanceof ExistingUserError) {
        return res.status(409).json({ error: error.message })
    }
    if (error instanceof InvalidPasswordError) {
        return res.status(401).json({ error: error.message })
    }

    console.error(error)
    res.status(500).json({
        message: "Something went wrong",
    })
})

module.exports = app