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
  }

  createProgram(texture) {
    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 1 },
        tMap: { value: texture }
      }
    })
  }

  createMesh(mesh) {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })

    this.mesh.scale.x = mesh.scale.x
    this.mesh.scale.y = mesh.scale.y
    this.mesh.scale.z = mesh.scale.z

    this.mesh.position.x = mesh.position.x
    this.mesh.position.y = mesh.position.y
    this.mesh.position.z = mesh.position.z + 0.01

    this.mesh.setParent(this.scene)
  }

  /**
   * Element.
   */

  setElement(element) {
    console.log(element.id)
    if (element.id === 'collections') {
      const { index, medias } = element
      const media = medias[index]

      console.log(media)

      this.createProgram(media.texture)
      this.createMesh(media.mesh)
    } else {
      this.createProgram(element.texture)
      this.createMesh(element)
    }

  }
  /**
   * Animations.
   */
  animate(element, onComplete, flag) {
    if (this.transition === 'detail') {
      GSAP.to(this.mesh.scale, {
        duration: 1.5,
        ease: 'expo.inOut',
        x: this.element.mesh.scale.x,
        y: this.element.mesh.scale.y,
        z: this.element.mesh.scale.z
      })

      GSAP.to(this.mesh.position, {
        duration: 1.5,
        ease: 'expo.inOut',
        onComplete,
        x: this.element.mesh.position.x,
        y: this.element.mesh.position.y,
        z: this.element.mesh.position.z
      })
    } else {

    }
  }
}
