const path = require('path')
const express = require('express')
const hbs = require('hbs')

const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars as view engine, set views location
app.set('view engine', 'hbs') 
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static dir to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Alex Santos'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Alex Santos'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page',
        name: 'Alex Santos',
        helpText: 'This is some helpful information'
    })
})

app.get('/weather', (req, res) => {
    const address = req.query.address

    if (!address) {
        return res.send({
            error: 'You must provide an address'
        })
    }
     // Runs only if we are provided an address
    geocode(address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            
            res.send({
                forecast: forecastData,
                location,
                address: address
            })
          })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            errorMessage: 'You must provide a search term'
        })
    }

    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMessage: 'Help article not found',
        title: '404',
        name: 'Alex Santos'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        errorMessage: 'Page not found',
        title: '404',
        name: 'Alex Santos'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})