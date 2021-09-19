require('dotenv').config()

const logger = require('morgan')
const express = require('express')
const errorHandler = require('errorhandler')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const app = express()
const path = require('path')
const port = 3000

app.use(logger('dev'))
app.use(errorHandler())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride())

const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')

const initApi = req => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req
  })
}

const handleLinkResolver = doc => {
  if (doc.type === 'product') {
    return `/detail/${doc.slug}`
  }
  if (doc.type === 'about') {
    return `/about/${doc.slug}`
  }

  return '/'
}

app.use((req, res, next) => {
  // res.locals.ctx = {
  //   endpoint: process.env.PRISMIC_ENDPOINT,
  //   linkResolver: handleLinkResolver
  // }

  res.locals.Link = handleLinkResolver

  res.locals.Numbers = index => {
    return index === 0 ? 'One' : index === 1 ? 'Two' : index === 2 ? 'Three' : index === 3 ? 'Four' : ''
  }

  res.locals.PrismicDOM = PrismicDOM

  next()
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', async (req, res) => {
  const api = await initApi(req)
  const home = await api.getSingle('home')
  const preloader = await api.getSingle('preloader')

  const { results: collections } = await api.query(Prismic.Predicates.at('document.type', 'collectu'), {
    fetchLinks: 'product.image'
  })


  res.render('pages/home', {
    home,
    collections,
    preloader
  })
})

app.get('/about', async (req, res) => {
  const api = await initApi(req)
  const about = await api.getSingle('about')
  const preloader = await api.getSingle('preloader')

  res.render('pages/about', {
    about,
    preloader
  })
})

app.get('/collections', async (req, res) => {
  const api = await initApi(req)
  const home = await api.getSingle('home')
  const preloader = await api.getSingle('preloader')

  const { results: collections } = await api.query(Prismic.Predicates.at('document.type', 'collectu'), {
    fetchLinks: 'product.image'
  })

  console.log('pre', preloader)

  res.render('pages/collections', {
    home,
    collections,
    preloader
  })
})

app.get('/detail/:uid', async (req, res) => {
  const api = await initApi(req)
  const preloader = await api.getSingle('preloader')

  const product = await api.getByUID('product', req.params.uid, {
    fetchLinks: 'collectu.title'
  })
  res.render('pages/detail', {
    product,
    preloader
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
