import GSAP from 'gsap'
import Animation from 'classes/Animations'

export default class Paragraph extends Animation {
  constructor({ element, elements }) {
    super({
      element,
      elements
    })
  }

  animateIn() {
    this.timelineIn = GSAP.timeline({
      delay: 0.5
    })
    this.timelineIn.to(this.element, {
      autoAlpha: 1,
      duration: 1
    })
  }

  animateOut() {
    GSAP.set(this.element, {
      autoAlpha: 0
    })
  }
}
