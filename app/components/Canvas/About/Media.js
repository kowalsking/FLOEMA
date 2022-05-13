import { Mesh, Program, Texture } from 'ogl'
import vertex from 'shaders/plane-vertex.glsl'
import fragment from 'shaders/plane-fragment.glsl'
import GSAP from 'gsap'

export default class {
  constructor({ element, geometry, gl, index, scene, sizes }) {
    this.geometry = geometry
    this.gl = gl
    this.element = element
    this.scene = scene
    this.index = index
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
    this.texture = new Texture(this.gl)

    const image = this.element.querySelector('img')

    this.image = new window.Image()
    this.image.crossOrigin = 'anonymous'
    this.image.src = image.getAttribute('data-src')
    this.image.onload = () => this.texture.image = this.image
  }

  createProgram() {
    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        tMap: { value: this.texture },
        uAlpha: { value: 0 }
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

  createBounds({ sizes }) {
    this.sizes = sizes
    this.bounds = this.element.getBoundingClientRect()

    this.updateScale(sizes)
    this.updateX()
    this.updateY()
  }

  /**
   * Animations.
   */
  show() {
    GSAP.fromTo(this.program.uniforms.uAlpha, {
      value: 0
    }, {
      value: 1
    })
  }

  hide() {
    GSAP.to(this.program.uniforms.uAlpha, {
      value: 0
    })
  }

  /**
   * Events.
   */
  onResize(sizes, scroll) {
    this.extra = 0

    this.createBounds(sizes)
    this.updateX(scroll)
    this.updateY(0)
  }

  /**
   * Loop.
   */
  updateRotations() {
    this.mesh.rotation.z = GSAP.utils.mapRange(-this.sizes.width / 2, this.sizes.width / 2, Math.PI * 0.1, -Math.PI * 0.1, this.mesh.position.x)
  }

  updateScale() {
    this.height = this.bounds.height / window.innerHeight
    this.width = this.bounds.width / window.innerWidth

    this.mesh.scale.x = this.sizes.width * this.width
    this.mesh.scale.y = this.sizes.height * this.height
  }

  updateX(x = 0) {
    this.x = (this.bounds.left + x) / window.innerWidth

    this.mesh.position.x = (-this.sizes.width / 2) + (this.mesh.scale.x / 2) + (this.x * this.sizes.width) + this.extra
  }

  updateY(y = 0) {
    this.y = (this.bounds.top + y) / window.innerHeight

    this.mesh.position.y = (this.sizes.height / 2) - (this.mesh.scale.y / 2) - (this.y * this.sizes.height)
    this.mesh.position.y += Math.cos((this.mesh.position.x / this.sizes.width) * Math.PI * 0.1) * 40 - 40
  }

  update(scroll) {
    if (!this.bounds) return

    this.updateRotations()
    this.updateScale()
    this.updateX(scroll)
    this.updateY(0)
  }
}
