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

app.get('/generate/:id', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.id })

    if (shortUrl == null) return res.sendStatus(404)

    // สร้าง QR code จาก shortUrl.full
    qrcode.toDataURL(shortUrl.full, (err, qrCodeData) => {
        if (err) {
            console.error(err)
            return res.sendStatus(500)
        }

        // ให้ shortUrl เก็บข้อมูล QR code
        shortUrl.qrCode = qrCodeData
        shortUrl.save()

        // แสดงหน้า generate.ejs พร้อม QR code
        res.render('generate', { shortUrl: shortUrl })
    })
})


// app.post("/scan", async (req, res) => {
//     const url = "https://www.google.com/";

    
//     qrcode.toDataURL(url, (err, src) => {
//         if (err) res.send("Error occured");
      
//         res.render("scan", { src });
//     });
// });

app.listen(process.env.PORT || 5000);