const express = require('express')
const mongoose = require('mongoose')
const cors  = require('cors')
require('dotenv').config()
const router = require('./routers/index')
const errorHandler = require('./helpers/errorHandler')
const app = express()

mongoose.connect(process.env.ATLAS_DATABASE_URL,()=>{
    console.log('connected to database');
})


app.use(cors())
app.use(express.json())
app.use('/cooking',router)
app.use(errorHandler);


app.listen(process.env.PORT,()=>{
    console.log(`listen on port ${process.env.PORT}`);
})