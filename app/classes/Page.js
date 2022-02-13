export default class Page {
  constructor ({
    element,
    elements,
    id
  }) {
    this.selector = element
    this.selectorChildren = {
      ...elements
    }
    this.id = id
  }

  create () {
    this.element = document.quearySelector(this.selector)
    this.elements = {}

    this.selectorChildren.forEach(entry => {
      console.log(entry)
    })

    console.log('create', this.id)
  }
}
