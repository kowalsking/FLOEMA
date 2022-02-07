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
    console.log('create', this.id)
  }
}
