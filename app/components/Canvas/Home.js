import Media from './Media'
import map from 'lodash/map'
import { Plane, Transform } from 'ogl'

export default class Media {
  constructor({ gl }) {
    this.scene = new Transform()
    this.gl = gl
    this.medias = document.querySelectorAll('.home__gallery__media__image')

    this.createGeometry()
    this.createGallery()
  }

  createGeometry() {
    this.geometry = new Plane(this.gl)
  }

  createGallery() {
    map(this.medias, (element, index) => {
      return new Media({
        element,
        index,
        geometry: this.geometry,
        scene: this.scene
      })
    })
  }
}
