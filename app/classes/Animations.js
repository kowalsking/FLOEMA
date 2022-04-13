import Component from 'classes/Component'

export default class Animation extends Component {
  constructor({ element, elements }) {
    super({
      element,
      elements,
    })
    // this.element = element
    this.createObserver()
    this.animateOut()
  }

  createObserver() {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log('animatein')
          this.animateIn()
        } else {
          console.log('animatout')
          this.animateOut()
        }
      })
    })

    this.observer.observe(this.element)
  }

  animateIn() {

  }

  animateOut() {

  }
}
