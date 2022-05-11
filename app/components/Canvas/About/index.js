import Gallery from './Gallery'
import map from 'lodash/map'
import { Plane, Transform } from 'ogl'

export default class {
  constructor({ gl, scene, sizes }) {
    this.group = new Transform()
    this.gl = gl

    this.sizes = sizes

    this.createGeometry()
    this.createGalleries()

    this.group.setParent(scene)
  }

  createGeometry() {
    this.geometry = new Plane(this.gl)
  }

  createGalleries() {
    this.galleriesElements = document.querySelectorAll('.about__gallery')

    this.galleries = map(this.galleriesElements, (element, index) => {
      return new Gallery({
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
   * Events.
   */

  onResize(event) {
    map(this.galleries, gallery => gallery.onResize(event))
  }

  onTouchDown({ x, y }) {
    map(this.galleries, gallery => gallery.onTouchDown(event))
  }

  onTouchMove({ x, y }) {
    map(this.galleries, gallery => gallery.onTouchMove({ x, y }))
  }

  onTouchUp({ x, y }) {
    map(this.galleries, gallery => gallery.onTouchUp(event))
  }

  onWheel({ pixelX, pixelY }) {

  }

  /**
   * Update.
   */
  update() {
    map(this.galleries, gallery => gallery.update())
  }

  /**
   * Destroy.
   */
  destroy() {
    map(this.galleries, gallery => gallery.destroy())
  }
}
