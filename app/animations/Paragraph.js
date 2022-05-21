import GSAP from 'gsap'
import Animation from 'classes/Animations'
import { calculate, split } from 'utils/text'

export default class Paragraph extends Animation {
  constructor({ element, elements }) {
    super({
      element,
      elements
    })

    this.elementLinesSpans = split({ element: this.element, append: true })
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

  onResize() {
    this.elementsLines = calculate(this.elementLinesSpans)
  }
}
