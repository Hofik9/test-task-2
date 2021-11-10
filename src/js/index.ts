class CardStack {
  cards: Card[] = []
  rotatedCard: Card | null = null
  isExpanded = false

  addCard = (card: Card) => {
    this.cards = [...this.cards, card]
  }

  expand = () => {
    this.isExpanded = true
    this.cards.forEach((card) => {
      card.expand()
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

interface Window {
  Swiper: any
}

class Card {
  private cardStack: CardStack
  private randomSeed = [0, 0, 0]
  private transform = { x: 0, y: 0, rotation: 0 }
  private isRotated = false
  private element: HTMLDivElement
  private lastTouchStart = 0

  constructor(cardElement: HTMLDivElement, stack: CardStack) {
    this.element = cardElement
    this.cardStack = stack
    this.randomSeed = [
      (Math.random() > 0.5 ? -1 : 1) * Math.random() * 2, // random shift on X axis
      (Math.random() > 0.5 ? -1 : 1) * Math.random() * 1, // random shift on Y axis
      (Math.random() > 0.5 ? -1 : 1) * Math.random() * 12, // random rotation
    ]

    new window.Swiper('.swiper', {
      direction: 'vertical',
      slidesPerView: 'auto',
      freeMode: true,
      scrollbar: {
        el: '.swiper-scrollbar',
        hide: true,
      },
      mousewheel: true,
    })

    this.element.addEventListener('pointerdown', (evt) => {
      this.lastTouchStart = evt.clientY
    })
    this.element.addEventListener('pointerup', this.handleClick)
    this.returnToStack()
  }

  private applyTransform = () => {
    const { x, y, rotation } = this.transform
    this.element.style.transform = `translateX(${x}rem) translateY(${y}rem) rotateZ(${rotation}deg) rotateY(${
      this.isRotated ? '180deg' : '0deg'
    })`
  }

  handleClick = (evt: PointerEvent) => {
    // Prevent a card from rotation if dragging was detected
    if (Math.abs(evt.clientY - this.lastTouchStart) > 20) {
      return
    }

    if (!this.cardStack.isExpanded) {
      this.cardStack.expand()
    } else {
      if (this.isRotated) {
        this.hideFrontSide()
      } else {
        this.showFrontSide()
      }
    }
  }

  expand = () => {
    this.element.classList.add('card--placed')
    this.element.style.transform = ''
  }

  showFrontSide = () => {
    this.element.classList.add('card--rotated')
    this.element.classList.remove('card--hidden')
    this.isRotated = true
    this.cardStack.returnOtherCards(this)
  }

  hideFrontSide = () => {
    if (this.isRotated) {
      this.element.classList.add('card--hidden')
      this.element.classList.remove('card--rotated')
      this.isRotated = false
    }
  }

  returnToStack = () => {
    const [x, y, rotation] = this.randomSeed
    this.transform = { x, y, rotation }
    this.applyTransform()
  }
}

const cardStack = new CardStack()

document
  .querySelectorAll<HTMLDivElement>('.card')
  .forEach((c) => cardStack.addCard(new Card(c, cardStack)))
