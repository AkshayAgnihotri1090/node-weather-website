const express=require('express')
const hbs =require('hbs')
const path=require('path')
const geocode=require('./utils/geocode')
const forecast=require('./utils/forecast')

console.log(__dirname)
console.log(path.join(__dirname,'../public'))

const app=express()
const port =process.env.PORT || 3000

//Define Paths
const publicAppUrl=path.join(__dirname,'../public')
const viewsPath=path.join(__dirname,'../templates/views')
const partialsPath=path.join(__dirname,'../templates/partials')
//Setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)
//setup static page
app.use(express.static(publicAppUrl))
app.get('',(req,res)=>{
    res.render('index',{
        title: 'Weather',
        name: 'Akshay'
    })
})
app.get('/about',(req,res)=>{
    res.render('about',{
        title: 'About',
        name: 'Akshay'
    })
})
app.get('/help',(req,res)=>{
    res.render('help',{
        helpText: 'Help me!',
        title: 'Help',
        name: 'Akshay'
    })
})
// app.get('',(req,res)=>{
//     res.send('<h1>Weather</h1>')
// })

// app.get('/help',(req,res)=>{
//     res.send([{
//         name: 'Akshay'
//     },{
//         age: 30
//     }])
// })

// app.get('/about',(req,res)=>{
//     res.send('<h1>About!<h1/>')
// })
app.get('/weather',(req,res)=>{
    if(!req.query.address){
        return res.send({
            error: 'You must provide address'
        })
    }
    geocode(req.query.address,(error,{latitude,longitude,location}={})=>{
        if(error){
            return res.send({error})
        }
        forecast(latitude,longitude,(error,forecastData)=>{
            if(error){
                return res.send({error})
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
    // res.send([{
    //     forecast: 'Its raining'
    // },{
    //     location: 'Hyderabad',
    //     address: req.query.address
    // }])

    
})

app.get('/products',(req,res)=>{
    
    if(!req.query.search){
        return res.send({
            error: 'You must provide search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products:[]
    })
})

app.get('/help/*',(req,res)=>{
    res.render("404",{
        title: '404',
        name: 'Akshay',
        error: 'Help article not found'
    })
})
app.get('*',(req,res)=>{
    res.render("404",{
        title: '404',
        name: 'Akshay',
        error: 'Page not found'
    })
})

app.listen(port,()=>{
    console.log('Server is up on port '+port)
})

