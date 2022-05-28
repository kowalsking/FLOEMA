import { Mesh, Program } from 'ogl'
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

    this.opacity = {
      current: 0,
      target: 0,
      multiplier: 0,
      lerp: 0.1
    }
  }

  createTexture() {
    const image = this.element.querySelector('.collections__gallery__media__image')

    this.texture = window.TEXTURES[image.getAttribute('data-src')]
  }

  createProgram() {
    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 0 },
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
    GSAP.fromTo(this.opacity, {
      multiplier: 0
    }, {
      multiplier: 1
    })
  }

  hide() {
    GSAP.to(this.opacity, {
      multiplier: 0
    })
  }

  /**
   * Events.
   */
  onResize(sizes, scroll) {
    this.extra = {
      x: 0,
      y: 0
    }

    this.createBounds(sizes)
    this.updateX(scroll && scroll.x)
    this.updateY(scroll && scroll.y)
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

  updateX(x = 0) {
    this.x = (this.bounds.left + x) / window.innerWidth

    this.mesh.position.x = (-this.sizes.width / 2) + (this.mesh.scale.x / 2) + (this.x * this.sizes.width) + this.extra.x
  }

  updateY(y = 0) {
    this.y = (this.bounds.top + y) / window.innerHeight

    this.mesh.position.y = (this.sizes.height / 2) - (this.mesh.scale.y / 2) - (this.y * this.sizes.height) + this.extra.y
  }

  update(scroll, index) {
    if (!this.bounds) return

    this.updateX(scroll)
    this.updateY()

    this.opacity.target = this.index === index ? 1 : 0.4
    this.opacity.current = GSAP.utils.interpolate(this.opacity.current, this.opacity.target, this.opacity.lerp)

    this.program.uniforms.uAlpha.value = this.opacity.current * this.opacity.multiplier
  }
}
