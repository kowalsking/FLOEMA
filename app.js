require('dotenv').config()

const express = require('express')
// const errorHandler = require('errorhandler')
const app = express()
const path = require('path')
const port = 3000

const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')

const initApi = req => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req
  })
}

const handleLinkResolver = doc => {
  return '/'
}

// app.use(errorHandler())

app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: handleLinkResolver
  }

  res.locals.PrismicDOM = PrismicDOM

  next()
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('pages/home')
})

app.get('/about', async (req, res) => {
  const api = await initApi(req)
  const about = await api.getSingle('about')
  res.render('pages/about', {
    about
  })
})

app.get('/collections', async (req, res) => {
  const api = await initApi(req)
  const { results: collections } = await api.query(Prismic.Predicates.at('document.type', 'collectu'), {
    fetchLinks: 'product.image'
  })

  console.log(collections)

  collections.forEach(collection => {
    console.log(collection.data.products[0].products_product)
  })

  res.render('pages/collections', {
    collections
  })
})

app.get('/detail/:uid', async (req, res) => {
  const api = await initApi(req)
  const product = await api.getByUID('product', req.params.uid, {
    fetchLinks: 'collectu.title'
  })
  res.render('pages/detail', {
    product
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
