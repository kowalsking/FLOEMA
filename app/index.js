import each from 'lodash/each'
import About from 'pages/About'
import Collections from 'pages/Collections'
import Detail from 'pages/Detail'
import Home from 'pages/Home'
import Preloader from 'components/Preloader'
import Navigation from 'components/Navigation'
import Canvas from 'components/Canvas'
import NormalizeWheel from 'normalize-wheel'

class App {
  constructor() {
    this.createContent()
    this.createNavigation()
    this.createCanvas()
    this.createPreloader()
    this.createPages()
    this.addLinkListeners()
    this.addEventListeners()
    this.onResize()

    this.update()
  }

  createNavigation() {
    this.navigation = new Navigation({
      template: this.template
    })
  }

  createPreloader() {
    this.preloader = new Preloader({
      canvas: this.canvas
    })

    this.preloader.once('completed', this.onPreloaded.bind(this))
  }

  createCanvas() {
    this.canvas = new Canvas({
      template: this.template
    })
  }

  createContent() {
    this.content = document.querySelector('.content')
    this.template = this.content.getAttribute('data-template') // this.content.dataset.template
  }

  createPages() {
    this.pages = {
      home: new Home(),
      collections: new Collections(),
      detail: new Detail(),
      about: new About()
    }

    this.page = this.pages[this.template]
    this.page.create()
  }

  /**
   * Events.
   */
  onPreloaded() {
    this.onResize()
    this.canvas.onPreloaded()
    this.page.show()
  }

  async onChange(url) {
    this.canvas.onChangeStart(this.template, url)
    await this.page.hide()
    const request = await window.fetch(url)

    if (request.status === 200) {
      const html = await request.text()
      const div = document.createElement('div')

      window.history.pushState({}, '', url)
      div.innerHTML = html

      const divContent = div.querySelector('.content')

      this.template = divContent.getAttribute('data-template')

      this.navigation.onChange(this.template)
      this.content.setAttribute('data-template', this.template)
      this.content.innerHTML = divContent.innerHTML

      this.canvas.onChangeEnd(this.template)

      this.page = this.pages[this.template]
      this.page.create()

      this.onResize()
      this.page.show()

      this.addLinkListeners()
    } else {
      console.error('Error!')
    }
  }

  onResize() {
    this.page?.onResize()

    window.requestAnimationFrame(_ => {
      if (this.canvas && this.canvas.onResize) this.canvas.onResize()
    })
  }

  onTouchDown(event) {
    this.canvas?.onTouchDown(event)
  }

  onTouchMove(event) {
    this.canvas?.onTouchMove(event)
  }

  onTouchUp(event) {
    this.canvas?.onTouchUp(event)
  }

  onWheel(event) {
    const normalizedWheel = NormalizeWheel(event)
    this.canvas?.onWheel(normalizedWheel)
    this.page?.onWheel(normalizedWheel)
  }

  /**
   * Loop.
   */
  update() {
    this.page?.update()
    this.canvas?.update(this.page.scroll)
    this.frame = window.requestAnimationFrame(this.update.bind(this))
  }

  /**
   * Listeners.
   */
  addEventListeners() {
    window.addEventListener('mousewheel', this.onWheel.bind(this))

    window.addEventListener('mousedown', this.onTouchDown.bind(this))
    window.addEventListener('mousemove', this.onTouchMove.bind(this))
    window.addEventListener('mouseup', this.onTouchUp.bind(this))

    window.addEventListener('touchstart', this.onTouchDown.bind(this))
    window.addEventListener('touchmove', this.onTouchMove.bind(this))
    window.addEventListener('touchend', this.onTouchUp.bind(this))

    window.addEventListener('resize', this.onResize.bind(this))
  }

  addLinkListeners() {
    const links = document.querySelectorAll('a')

    each(links, link => {
      link.onclick = event => {
        event.preventDefault()
        const { href } = link

        this.onChange(href)
      }
    })
  }
}

new App()
