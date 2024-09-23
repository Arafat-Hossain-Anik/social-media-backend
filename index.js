const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connection = require('./db/db')
const userRoute = require('./routes/userRoute')
const authRoute = require('./routes/authRoute')

require('dotenv').config()
const port = process.env.PORT
const app = express()

// middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors(
    {
        origin: [
            'http://localhost:5173'
        ],
        credentials: true
    }
))
// connection string 
connection();

//api routes
app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})