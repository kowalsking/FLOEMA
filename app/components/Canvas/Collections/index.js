import Media from './Media'
import map from 'lodash/map'
import { Plane, Transform } from 'ogl'
import GSAP from 'gsap'

export default class {
  constructor({ gl, scene, sizes }) {
    this.group = new Transform()
    this.gl = gl
    this.scene = scene

    this.galleryElement = document.querySelector('.collections__gallery__wrapper')

    this.collectionsElements = document.querySelectorAll('.collections__article')
    this.collectionsElementsActive = 'collections__article--active'

    this.mediasElements = document.querySelectorAll('.collections__gallery__media')
    this.sizes = sizes

    this.scroll = {
      current: 0,
      target: 0,
      start: 0,
      lerp: 0.1,
      velocity: 1
    }

    this.createGeometry()
    this.createGallery()

    this.group.setParent(this.scene)

    this.show()
  }

  createGeometry() {
    this.geometry = new Plane(this.gl)
  }

  createGallery() {
    this.medias = map(this.mediasElements, (element, index) => {
      return new Media({
        element,
        index,
        gl: this.gl,
        geometry: this.geometry,
        scene: this.group,
        sizes: this.sizes
      })
    })
  }

  /**
   * Animations
   */
  show() {
    map(this.medias, media => media.show())
  }

  hide() {
    map(this.medias, media => media.hide())
  }


  /**
   * Events.
   */
  onResize(event) {
    this.sizes = event.sizes

    this.bounds = this.galleryElement.getBoundingClientRect()

    this.scroll.last = this.scroll.target = 0

    map(this.medias, media => media.onResize(event, this.scroll))

    this.scroll.limit = this.bounds.width - this.medias[0].element.clientWidth
  }

  onTouchDown({ x, y }) {
    this.scroll.last = this.scroll.current
  }

  onTouchMove({ x, y }) {
    const distance = x.start - x.end

    this.scroll.target = this.scroll.last - distance
  }

  onTouchUp({ x, y }) {

  }

  onWheel({ pixelX }) {
    this.scroll.target += pixelX
  }

  /**
   * Changed.
   */

  onChange(index) {
    this.index = index

    const selectedCollection = parseInt(this.mediasElements[this.index].getAttribute('data-index'))

    console.log(selectedCollection)

    map(this.collectionsElements, (element, elementIndex) => {
      if (elementIndex === selectedCollection) {
        element.classList.add(this.collectionsElementsActive)
      } else {
        element.classList.remove(this.collectionsElementsActive)
      }
    })
  }

  /**
   * Update.
   */
  update() {
    if (!this.bounds) return

    this.scroll.target = GSAP.utils.clamp(-this.scroll.limit, 0, this.scroll.target)

    this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, this.scroll.lerp)

    if (this.scroll.last < this.scroll.current) {
      this.scroll.direction = 'right'
    } else if (this.scroll.last > this.scroll.current) {
      this.scroll.direction = 'left'
    }

    this.scroll.last = this.scroll.current

    map(this.medias, media => {
      media.update(this.scroll.current)
    })

    const index = Math.floor(Math.abs(this.scroll.current / this.scroll.limit) * this.medias.length)

    if (this.index !== index) {
      this.onChange(index)
    }
  }

  /**
   * Destroy.
   */

  destroy() {
    this.scene.removeChild(this.group)
  }
}
