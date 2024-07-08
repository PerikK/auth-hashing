require("dotenv").config()

const app = require("./server.js")

const port = process.env.PORT || 4000

app.listen(port, () => {
	console.log(`\n Server is running on http://localhost:${port}\n`)
})