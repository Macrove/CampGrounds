//Importing Express
const express = require('express')
const app = express()

const path = require('path')

const methodOverride = require('method-override')

//Campground Model
const Campground = require('./models/campground.js')

// Importing mongoose
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/yelpcamp',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('We are connected')
})

//Accessing Port
app.listen(3000,()=>{
    console.log('Serving to Port 3000!')
})

// Basic configurations for express app
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

//middlewares for parsing data in req.body and and getting requests other than GET and POST from forms
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'/public')))

//Root
// WILL USE RESTFUL API

app.get('/',(req,res)=>{
    res.redirect('/campground')
})
//Home
app.get('/campground', async (req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds',{campgrounds})
})

// Coming up CRUD operations
// CREATE

//Form to create new Campground
app.get('/campground/new',(req,res)=>{
    res.render('newCampground')
})
//Creating New Campground
app.post('/campground',async (req,res)=>{
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect('/')
})

//READ

//Showing individual campground
app.get('/campground/:id',async(req,res)=>{
    const {id} = req.params
    const campground =  await Campground.findById(id)
    res.render('showCampground',{campground})
})

//UPDATE

//Editing form individual campground
app.get('/campground/:id/edit',async(req,res)=>{
    const { id } = req.params
    const campground = await Campground.findById( id )
    res.render('editCampground', {campground})
})

//Updating campground request
app.put('/campground/:id',async(req,res)=>{
    const { id } = req.params
    await Campground.findByIdAndUpdate(id, req.body.campground)
    res.redirect(`/campground/${id}`)
})

//DELETE
//Deleting individual campground
app.delete('/campground/:id/delete',async(req,res)=>{
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/')
})