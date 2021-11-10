class CardStack {
  cards: Card[] = []
  rotatedCard: Card | null = null
  isExpanded = false

  addCard = (card: Card) => {
    this.cards = [...this.cards, card]
  }

  expand = () => {
    this.isExpanded = true
    this.cards.forEach((card, index) => {
      card.moveToPosition(index * 12 - 25, 0)
    })
  }

  returnOtherCards = (card: Card) => {
    this.cards.forEach((c) => {
      if (c !== card) {
        c.hideFrontSide()
      }
    })
  }
}

class Card {
  private cardStack: CardStack
  private randomSeed = [0, 0, 0]
  private transform = { x: 0, y: 0, rotation: 0 }
  private isRotated = false
  private element: HTMLDivElement

  constructor(cardElement: HTMLDivElement, stack: CardStack) {
    this.element = cardElement
    this.cardStack = stack
    this.randomSeed = [
      (Math.random() > 0.5 ? -1 : 1) * Math.random() * 2, // random shift on X axis
      (Math.random() > 0.5 ? -1 : 1) * Math.random() * 1, // random shift on Y axis
      (Math.random() > 0.5 ? -1 : 1) * Math.random() * 12, // random rotation
    ]

    this.element.addEventListener('click', this.handleClick)
    this.returnToStack()
  }

  private applyTransform = () => {
    const { x, y, rotation } = this.transform
    this.element.style.transform = `translateX(${x}vw) translateY(${y}vw) rotateZ(${rotation}deg) rotateY(${
      this.isRotated ? '180deg' : '0deg'
    })`
  }

  handleClick = () => {
    if (!this.cardStack.isExpanded) {
      this.cardStack.expand()
    } else {
      this.isRotated = !this.isRotated
      this.applyTransform()

      if (this.isRotated) {
        this.element.classList.add('card--rotated')
        this.cardStack.returnOtherCards(this)
      } else {
        this.element.classList.remove('card--rotated')
      }
    }
  }

  hideFrontSide = () => {
    this.element.classList.remove('card--rotated')
    this.isRotated = false
    this.applyTransform()
  }

  returnToStack = () => {
    const [x, y, rotation] = this.randomSeed
    this.transform = { x, y, rotation }
    this.applyTransform()
  }

  moveToPosition = (x: number, y: number) => {
    this.transform = { ...this.transform, x, y, rotation: 0 }
    this.applyTransform()
  }
}

const cardStack = new CardStack()

document
  .querySelectorAll<HTMLDivElement>('.card')
  .forEach((c) => cardStack.addCard(new Card(c, cardStack)))
