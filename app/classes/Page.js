export default class Page {
  constructor ({
    element,
    elements,
    id
  }) {
    this.selector = element
    this.selectorChildren = elements
    this.id = id
  }

  create () {
    this.element = document.quearySelector(this.selector)
    this.elements = {}



    console.log('create', this.id)
  }
}
