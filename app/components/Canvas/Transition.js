import { Mesh, Program, Plane } from 'ogl'
import vertex from 'shaders/plane-vertex.glsl'
import fragment from 'shaders/plane-fragment.glsl'
import GSAP from 'gsap'

export default class {
  constructor({ collections, gl, scene, sizes, url }) {
    this.gl = gl
    this.collections = collections
    this.url = url
    this.scene = scene
    this.sizes = sizes

    this.geometry = new Plane(this.gl)

    this.createTexture()
    this.createProgram()
    this.createMesh()
  }

  createTexture() {
    const { index, medias } = this.collections
    this.media = medias[index]
  }

  createProgram() {
    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 1 },
        tMap: { value: this.media.texture }
      }
    })
  }

  createMesh() {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })

    this.mesh.scale.x = this.media.mesh.scale.x
    this.mesh.scale.y = this.media.mesh.scale.y
    this.mesh.scale.z = this.media.mesh.scale.z

    this.mesh.position.z = this.media.mesh.position.z + 0.01

    this.mesh.setParent(this.scene)
  }

  /**
   * Element.
   */

  setElement(element) {
    this.scale = {
      x: this.element.mesh.scale.x,
      y: this.element.mesh.scale.y,
      z: this.element.mesh.scale.z
    }

    this.position = {
      x: this.element.mesh.position.x,
      y: this.element.mesh.position.y,
      z: this.element.mesh.position.z
    }
  }
  /**
   * Animations.
   */
  animate(onComplete, flag) {
    if (flag === 'detail') {
      GSAP.to(this.mesh.scale, {
        duration: 1.5,
        ease: 'expo.inOut',
        ...this.scale
      })

      GSAP.to(this.mesh.position, {
        duration: 1.5,
        ease: 'expo.inOut',
        ...this.position,
        onComplete
      })
    }
  }
}
