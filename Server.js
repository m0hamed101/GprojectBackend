const express = require('express')
const app = express()
const mongoose = require("mongoose")
// const dotenv = require('dotenv')
// dotenv.config();
const port = 5000
app.use(express.json());
const cors = require("cors")
app.use(cors())

// import 
const authRouter= require('./router/authRoute');
const courseRouter= require('./router/courseRouter');



// routes
app.use('/api/user', authRouter)
app.use('/api/course', courseRouter)


// connection To DataBase
mongoose.connect(process.env.CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("DB Connection Successfull!"))
    .catch((err) => {
        console.log(err);
    });

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})