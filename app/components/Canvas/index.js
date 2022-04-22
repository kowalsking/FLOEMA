import { Camera, Renderer, Transform, Box, Program, Mesh } from 'ogl'
import Home from './Home'

export default class Canvas {
  constructor() {
    this.createRenderer()
    this.createCamera()
    this.createScene()
    this.createHome()
  }

  createRenderer() {
    this.renderer = new Renderer()

    this.gl = this.renderer.gl
    document.body.append(this.gl.canvas)
  }

  createCamera() {
    this.camera = new Camera(this.gl)
    this.camera.position.z = 5
  }

  createScene() {
    this.scene = new Transform()
  }

  createHome() {
    this.home = new Home({
      gl: this.gl
    })
  }

  onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.camera.perspective({
      aspect: window.innerWidth / innerHeight
    })
  }

  update() {
    this.mesh.rotation.x += 0.01
    this.mesh.rotation.y += 0.01

    this.renderer.render({
      camera: this.camera,
      scene: this.scene
    })
  }
}
