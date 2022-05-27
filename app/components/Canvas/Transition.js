import { Mesh, Program, Plane } from 'ogl'
import vertex from 'shaders/plane-vertex.glsl'
import fragment from 'shaders/plane-fragment.glsl'
import GSAP from 'gsap'

export default class {
  constructor({ collections, gl, scene, sizes, url }) {
    this.geometry = new Plane(this.gl)
    this.gl = gl
    this.collections = collections
    this.url = url
    this.scene = scene
    this.sizes = sizes

    this.createTexture()
    this.createProgram()
    this.createMesh()

    this.extra = {
      x: 0,
      y: 0
    }
  }

  createTexture() {
    console.log(this.collections)
    // const image = this.element.querySelector('.collections__gallery__media__image')

    // this.texture = window.TEXTURES[image.getAttribute('data-src')]
  }

  createProgram() {
    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 1 },
        tMap: { value: this.texture }
      }
    })
  }

  createMesh() {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })

    this.mesh.setParent(this.scene)
  }

  /**
   * Animations.
   */
  transition() {}
}
