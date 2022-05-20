import Component from '../classes/Component'
import { Texture } from 'ogl'
import GSAP from 'gsap'
import { split } from 'utils/text'

export default class Preloader extends Component {
  constructor({ canvas }) {
    super({
      element: '.preloader',
      elements: {
        title: '.preloader__text',
        number: '.preloader__number',
        numberText: '.preloader__number__text'
      }
    })

    this.canvas = canvas

    window.TEXTURES = {}

    split({
      element: this.elements.title,
      expression: '<br>'
    })

    split({
      element: this.elements.title,
      expression: '<br>'
    })

    this.elements.titleSpans = this.elements.title.querySelectorAll('span span')
    this.length = 0
    this.createLoader()
  }

  createLoader() {
    window.ASSETS.forEach(image => {
      if (!image) image = 'https://images.prismic.io/floema-k/6a32bbf4-f600-4f1c-a9ea-46ba0395452c_9.jpg?auto=compress,format'
      const texture = new Texture(this.canvas.gl, {
        generateMipmaps: false
      })

      const media = new window.Image()

      media.crossOrigin = 'anonymous'
      media.src = image
      media.onload = _ => {
        texture.image = media

        this.onAssetLoaded()
      }

      window.TEXTURES[image] = texture
    })
  }

  onAssetLoaded(image) {
    this.length += 1
    const percent = this.length / window.ASSETS.length
    this.elements.numberText.innerHTML = `${Math.round(percent * 100)}%`
    if (percent === 1) {
      this.onLoaded()
    }
  }

  onLoaded() {
    return new Promise(resolve => {
      this.animateOut = GSAP.timeline({
        delay: 2
      })

      this.animateOut.to(this.elements.titleSpans, {
        y: '100%',
        duration: 1.5,
        ease: 'expo.out',
        stagger: 0.1
      })

      this.animateOut.to(this.elements.numberText, {
        y: '100%',
        duration: 1.5,
        ease: 'expo.out',
        stagger: 0.1
      }, '-=1.4')

      this.animateOut.to(this.element, {
        scaleY: 0,
        transformOrigin: '100% 100%',
        duration: 1.5,
        ease: 'expo.out',
      }, '-=1')

      this.animateOut.call(_ => {
        this.emit('completed')
      })
    })
  }

  destroy() {
    this.element.parentNode.removeChild(this.element)
  }
}
