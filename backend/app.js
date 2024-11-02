const express = require("express")
const cors = require("cors")
const seq = require('./util/database')
const formRoutes = require("./routes/form-route")
const app = express()

//Handling CORS error
app.use(cors({
    origin: "*"
}))

//Parsing
app.use(express.json())

//Forwarding
app.use("/", formRoutes)

//Error Handling
app.use((err, req, res, next) => {
    const code = err.statusCode || 500 
    const message = err.message || 'Internal Server Error' 
    return res.status(code).json({ message: message })
})

//Connecting
seq.authenticate().then(() => console.log('Database connected')).catch((err) => console.error('Unable to connect to the database:', err))
seq.sync().then(() => app.listen(3000, () => console.log("Server running on port 3000"))).catch((err) => console.error("Failed to sync database:", err))