const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const qrcode = require('qrcode')
const app = express()
require('dotenv').config();

mongoose.connect(process.env.MONGODB_CONNECT_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
})


app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.use(express.static('public'));


app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {

    await ShortUrl.create({ 
        Full_Url: req.body.fullUrl, 
    })

    res.redirect('/')
})


app.get('/:id', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ Short_Url: req.params.id })

    if (shortUrl == null) return res.sendStatus(404)

    const ipAddress =  req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.headers['x-forwarded-for'] ;
    shortUrl.ipAddress = ipAddress;

    shortUrl.clicks++
    shortUrl.save()
    res.redirect(shortUrl.Full_Url)
})

app.get('/generate/:id', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ Short_Url: req.params.id })

    if (shortUrl == null) return res.sendStatus(404)

    qrcode.toDataURL("https://short-url-ciqa.onrender.com/"+shortUrl.Short_Url, (err, qrCodeData) => {
        if (err) {
            console.error(err)
            return res.sendStatus(500)
        }

        shortUrl.qrCode = qrCodeData
        shortUrl.save()

        res.render('generate', { shortUrl: shortUrl })
    })
})

app.post('/delete/:id', async (req, res) => {
    const idToDelete = req.params.id;
    try {
        await ShortUrl.findByIdAndRemove(idToDelete);
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting short URL:', error);
        res.sendStatus(500);
    }
})

const PORT = process.env.PORT

app.listen(PORT,() =>{
    console.log("Server is running on port" + PORT)
})