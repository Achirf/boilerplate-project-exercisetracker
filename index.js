const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')

const uri = process.env.MONGO_URI

//!Middleware
app.use(express.urlencoded({extended: true}))
app.use(express.json())
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
  user_id:{
    type: 'string',
    required: true
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
const User = mongoose.model('User', userSchema)
const Exercise = mongoose.model('Excersise', exerciseSchema)
const Log = mongoose.model('Log', logSchema)
//!Models

//*API ENDPOINTS
//!Creating a new User
app.post('/api/users', async(req, res) =>{
  const newUser = req.body.username
  const userObj = new User({
    username: newUser
  }) 
  try {
    const user = await userObj.save() 
    console.log(user)
    res.send(user)
  } catch (error) {
    console.log(error)
  }
})
//!Creating a new User

//!Get all users
app.get('/api/users', async(req, res) => {
  const users = await User.find({}).select("_id username")
  if(!users){
    res.send('No users found')
  } else {
    res.json(users)
  }
})
//!Get all users

//!Creating a new exercise
app.post('/api/users/:_id/exercises', async(req, res) => {
  const id = req.params._id
  const { description, duration, date } = req.body
  
  try {
    const user = await User.findById(id)
    if (!user) {
      res.send("User not found")
    } else {
      const exerciseObj = new Exercise({
        user_id: user._id,
        description,
        duration,
        date: date ? new Date(date) : new Date()
      })
      const exercise = await exerciseObj.save()
      res.send ({
        _id: user._id,
        username: user.username,
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date.toDateString()
      })
    }
  } catch (error) {
    console.log(error)
  }
})
//!Creating a new exercise

//!Getting user excercise logs
app.get('/api/users/:_id/logs', async (req, res) => {
  const {from, to, limit} = req.query
  const id = req.params._id
  const user = await User.findById(id)

  if(!user) {
    res.send('user not found')
    return
  }
  let dateObj = {}
  if (from){
    dateObj["$gte"] = new Date(from)
  }
  if (to){
    dateObj["$lte"] = new Date(to)
  }
  let filter = {
    user_id: id
  }
  if(from || to) {
    filter.date = dateObj
  }

  const excercises = await Exercise.find(filter).limit(+limit ?? 500)

  const log = excercises.map(e => ({
    description: e.description,
    duration: e.duration,
    date: e.date.toDateString()
  }))

  res.json({
    username: user.username,
    count: excercises.length,
    _id: user._id,
    log 
  })
})
//!Getting user excercise logs

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
