import { Mesh, Plane, Program } from 'ogl'
import vertex from 'shaders/plane-vertex.glsl'
import fragment from 'shaders/plane-fragment.glsl'
import GSAP from 'gsap'

export default class {
  constructor({ gl, scene, sizes }) {
    this.gl = gl
    this.element = document.querySelector('.detail__media__image')
    this.scene = scene
    this.sizes = sizes

    this.geometry = new Plane(this.gl)

    this.createTexture()
    this.createProgram()
    this.createMesh()
  }

  createTexture() {
    const image = image.getAttribute('data-src')

    this.texture = window.TEXTURES[image]
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

  }

  hide() {

  }

  /**
   * Events.
   */
  onResize(sizes) {
    this.createBounds(sizes)
    this.updateX()
    this.updateY()
  }

  /**
   * Loop.
   */
  updateScale({ height, width }) {
    this.height = this.bounds.height / window.innerHeight
    this.width = this.bounds.width / window.innerWidth

    this.mesh.scale.x = this.sizes.width * this.width
    this.mesh.scale.y = this.sizes.height * this.height

  }

  updateX() {
    this.x = (this.bounds.left) / window.innerWidth

    this.mesh.position.x = (-this.sizes.width / 2) + (this.mesh.scale.x / 2) + (this.x * this.sizes.width)
  }

  updateY() {
    this.y = (this.bounds.top) / window.innerHeight

    this.mesh.position.y = (this.sizes.height / 2) - (this.mesh.scale.y / 2) - (this.y * this.sizes.height)
  }

  update() {
    if (!this.bounds) return

    this.updateX()
    this.updateY()
  }
}