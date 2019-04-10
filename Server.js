const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const fetch = require('node-fetch')
const cheerio = require('cheerio')

const app = express()

app.use(cors())
app.use(morgan('tiny'))

function getResults(body) {
    const $ = cheerio.load(body)
    const rows = $('li.result-row')
    const offerRows = $('._b31be13')
    const results = []

    rows.each((index, element) => {
        const result = $(element)
        const title = result.find('.result-title').text()
        const price = $(result.find('.result-price').get(0)).text()
        const imageData = result.find('a.result-image').attr('data-ids')
        let images = []
        if (imageData) {
            const parts = imageData.split(',')
            images = parts.map((id) => {
                return `https://images.craigslist.org/${id.split(':')[1]}_300x300.jpg`
            })
        }
        const hood = result.find('.result-hood').text().trim().replace("(", "").replace(")", "")

        let url = result.find('.result-title.hdrlnk').attr('href')

        results.push({
            title,
            price,
            images,
            hood,
            url
        })
    })

    offerRows.each((index, element) => {
        const offerResult = $(element)
        const title = offerResult.find('._nn5xny4._y9ev9r').text()
        const images = offerResult.find('img._ipfql6._sheya5').attr('data-src')
        const price = offerResult.find('._s3g03e4').text()
        const hood = offerResult.find('._19rx43s2').text()

        results.push({
            title,
            images,
            price,
            hood
        })
    })
    return results
}

app.get('/', (req, res) => {
    res.json({
        message: 'hell world'
    })
})

app.get('/search/:location/:search_term', async (req, res) => {
    const { location, search_term } = req.params

    allResults = []

    const offerUrl = `https://offerup.com/search/?q=${search_term}`
    const url = `https://${location}.craigslist.org/search/sso?sort=date&query=${search_term}&hasPic=1`

    fetch(offerUrl)
        .then(res => res.text())
        .then(body => {
            const results = getResults(body)
            allResults.push.apply(allResults, results)
            return fetch(url)
        })
        .then(res => res.text())
        .catch(err => console.log(err))
        .then(body => {
            const results = getResults(body)
            allResults.push.apply(allResults, results)
            console.log(allResults)
            res.json({ allResults })
        })
})

app.use((req, res, next) => {
    const error = new Error('Not Found')
    res.status(404)
    next(error)
})

app.use((err, req, res, next) => {
    res.status(res.statusCode || 500)
    res.json({
        message: err.message
    })
})

app.listen(3001, () => { console.log('listening on port 3001...') })
