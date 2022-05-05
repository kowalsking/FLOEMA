import Media from './Media'
import map from 'lodash/map'
import { Plane, Transform } from 'ogl'

export default class {
  constructor({ gl, scene, sizes }) {
    this.group = new Transform()
    this.gl = gl
    this.mediasElements = document.querySelectorAll('.home__gallery__media__image')
    this.sizes = sizes

    this.createGeometry()
    this.createGallery()

    this.group.setParent(scene)
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

  onResize(event) {
    map(this.medias, media => media.onResize(event))
  }
}
