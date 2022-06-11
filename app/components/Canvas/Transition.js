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

  createProgram() {
    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 1 },
        tMap: { value: null }
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
   * Element.
   */

  setElement(element) {
    console.log(element.id)
    if (element.id === 'collections') {
      const { index, medias } = element
      const media = medias[index]

      console.log(media)

      this.mesh.scale.x = media.mesh.scale.x
      this.mesh.scale.y = media.mesh.scale.y
      this.mesh.scale.z = media.mesh.scale.z

      this.mesh.position.z = media.mesh.position.z + 0.01

      this.program.uniform.tMap.value = media.texture
    } else {
      this.mesh.scale.x = element.mesh.scale.x
      this.mesh.scale.y = element.mesh.scale.y
      this.mesh.scale.z = element.mesh.scale.z

      this.mesh.position.z = element.mesh.position.z + 0.01

      this.program.uniform.tMap.value = element.texture
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
