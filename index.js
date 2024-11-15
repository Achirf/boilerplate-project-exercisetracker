const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')

const uri = process.env.MONGO_URI

//!Middleware
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
//!Middleware

//!Database connection
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
mongoose.connect(uri, clientOptions)
.then(() => {
    console.log('Database connection established')
})
.catch((err) => {
    console.log(err)
})
//!Database connection

//!User schema
const userSchema = new mongoose.Schema({
  username:{
    type: 'string',
    required: true,
    unique: true
  }
})
//!User schema

//!Exercise schema
const exerciseSchema = new mongoose.Schema({
  username:{
    type: 'string',
    required: true,
    unique: true
  },
  date:{
    type: 'date',
  },
  duration:{
    type: 'number'
  },
  description:{
    type: 'string'
  }
})
//!Exercise schema

//!Log schema
const logSchema = new mongoose.Schema({
  username:{
    type: 'string',
    required: true,
    unique: true
  },
  count:{
    type: 'number',
  },
  log:{
    type: 'array'
  }
})
//!Log schema

//!Models
const user = mongoose.model('User', userSchema)
const excersise = mongoose.model('Excersise', exerciseSchema)
const log = mongoose.model('Log', logSchema)
//!Models

//!Creating a new User
app.post('/api/users', (req, res) =>{
  let newUser = req.body
})
//!Creating a new User

//!Get all users
app.get('/api/users',(req, res) => {
  res.send('all users')
})
//!Get all users

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
