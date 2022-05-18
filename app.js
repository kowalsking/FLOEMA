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
app.use(express.static(path.join(__dirname, 'public')))

const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')
const defaults = require('concurrently/src/defaults')

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
  if (doc.type === 'collections') {
    return `/collections`
  }
  if (doc.type === 'about') {
    return `/about`
  }

  return '/'
}

app.use((_, res, next) => {
  res.locals.Link = handleLinkResolver
  res.locals.Numbers = index => index === 0 ? 'One' : index === 1 ? 'Two' : index === 2 ? 'Three' : index === 3 ? 'Four' : ''
  res.locals.PrismicDOM = PrismicDOM
  next()
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

const handleRequest = async api => {
  const preloader = await api.getSingle('preloader')
  const navigation = await api.getSingle('navigation')

  return {
    navigation,
    preloader
  }
}

app.get('/', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  const home = await api.getSingle('home')

  const { results: collections } = await api.query(Prismic.Predicates.at('document.type', 'collectu'), {
    fetchLinks: 'product.image'
  })

  res.render('pages/home', {
    ...defaults,
    home,
    collections,
  })
})

app.get('/about', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  const about = await api.getSingle('about')

  res.render('pages/about', {
    ...defaults,
    about
  })
})

app.get('/collections', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  const home = await api.getSingle('home')

  const { results: collections } = await api.query(Prismic.Predicates.at('document.type', 'collectu'), {
    fetchLinks: 'product.image'
  })

  res.render('pages/collections', {
    ...defaults,
    home,
    collections
  })
})

app.get('/detail/:uid', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  const home = await api.getSingle('home')

  const product = await api.getByUID('product', req.params.uid, {
    fetchLinks: 'collectu.title'
  })

  res.render('pages/detail', {
    ...defaults,
    home,
    product
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
