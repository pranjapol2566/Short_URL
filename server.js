const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const qrcode = require('qrcode')
const app = express()

mongoose.connect('mongodb+srv://admin:1234@cluster0.meesrfk.mongodb.net/', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))


app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ 
        full: req.body.fullUrl, 
        qr: req.body.fullUrl 
    })

    res.redirect('/')
})

app.get('/:id', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.id })

    if (shortUrl == null) return res.sendStatus(404)



    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000);