import { log } from '../utils';

interface ImageShared {
  data: string;
  name: string;
}

interface ImageUnique {
  height: number;
  width: number;
  x: number;
  y: number;
}

// what about ImageFlyweight?
// interface Image extends ImageShared, ImageUnique {}

// interface SlideImage {
//   raw: Image;
//   html: string;
// }

interface ImageFlyweights {
  [key: string]: ImageShared;
}

interface AppHistory {
  [key: string]: History;
}

// think through this more
interface Memento {
  getState(): object;
  getName(): string;
  getDate(): string;
}

interface SlideMemento {
  images: Image[];
  text: string[];
}

// should probably make an ImageMemento and a TextMemento
class ConcreteMemento implements Memento {
  private state: object;
  private date: string;

  constructor(state: object) {
    this.state = state;
    this.date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  }

  public getState(): object {
    return this.state;
  }

  public getName(): string {
    return `${this.date} / (${JSON.stringify(this.state).substr(0, 100)}...)`;
  }

  public getDate(): string {
    return this.date;
  }
}

// replace ImageFlyweight
class Image {
  private sharedState: ImageShared;
  private uniqueState: ImageUnique;

  constructor(sharedState: ImageShared, uniqueState: ImageUnique) {
    this.sharedState = sharedState;
    this.uniqueState = uniqueState;
  }

  public setUniqueState(uniqueState: ImageUnique) {
    this.uniqueState = uniqueState;
  }

  public toHTML(): string {
    const { data } = this.sharedState;
    const { height, width, x, y } = this.uniqueState;
    return `<img src=${data} height=${height} width=${width} left=${x} top=${y} />`;
  }
}

class ImageFlyweightFactory {
  // private flyweights: { [key: string]: Flyweight; } = <any>{};
  private flyweights: ImageFlyweights = {};

  constructor(initialFlyweights: ImageShared[]) {
    Object.values(initialFlyweights).forEach((state) => {
      this.flyweights[this.getKey(state)] = state;
    });
  }

  private getKey(state: ImageShared): string {
    return state.name;
  }

  public getFlyweight(sharedState: ImageShared): ImageShared {
    const key = this.getKey(sharedState);

    if (key in this.flyweights) {
      // log('FlyweightFactory: Reusing existing flyweight.');
    } else {
      // log("FlyweightFactory: Can't find a flyweight, creating new one.");
      this.flyweights[key] = sharedState;
    }

    return this.flyweights[key];
  }

  public listFlyweights(): void {
    const count = Object.keys(this.flyweights).length;
    log(`\nFlyweightFactory: I have ${count} flyweights:`);

    Object.keys(this.flyweights).forEach((key) => {
      log(key);
    });
  }
}

/*
class Slide (Originator)
  getState() -> grab all extrinsicData values, combine with flyweights?
      recombining/restoring - factory.getFlyweight(name)
  save() -> return new ConcreteMemento(this.getState)
  restore(memento: Memento): { this.state = memento.getState(); }
*/
class Slide {
  imageFactory: ImageFlyweightFactory;
  images: Image[] = [];
  text: string[] = [];

  constructor(imageFactory: ImageFlyweightFactory) {
    this.imageFactory = imageFactory;
  }

  // -> user selects existing image. can duplicate and change coordinates
  addImage(imageShared: ImageShared, imageUnique: ImageUnique) {
    // this is what's stored in history, better make it good!
    this.images.push(new Image(imageShared, imageUnique));
  }

  addText(text: string) {
    this.text.push(text);
  }

  // print images and text blocks
  render() {
    log(
      'images',
      this.images.map((image) => image.toHTML())
    );
    log(
      'text',
      this.text.map((line) => `<div>${line}</div>`)
    );
  }

  public save(): Memento {
    return new ConcreteMemento({ images: this.images, text: this.text });
  }

  public restore(memento: Memento): void {
    const { images, text } = memento.getState() as SlideMemento;
    this.images = images;
    this.text = text;
  }
}

// class History (Caretaker) // handle stack of mementos
// calls Slide’s backup related methods
class History {
  private mementos: Memento[] = [];

  private originator: Slide;

  constructor(originator: Slide) {
    this.originator = originator;
  }

  public backup(): void {
    this.mementos.push(this.originator.save());
  }

  public undo(): void {
    if (this.mementos.length === 0) {
      return;
    }

    const memento = this.mementos.pop() as Memento;
    this.originator.restore(memento);
  }

  public showHistory(): void {
    for (const memento of this.mementos) {
      log(memento.getName());
    }
  }
}

export function main() {
  // default images
  const butterflyImage: ImageShared = { data: '101010', name: 'butterfly' };
  const flowerImage: ImageShared = { data: '101001', name: 'flower' };
  const sunImage: ImageShared = { data: '101101', name: 'sun' };

  // add default images
  const factory = new ImageFlyweightFactory([
    butterflyImage,
    flowerImage,
    sunImage,
    // ...
  ]);
  factory.listFlyweights();

  const defaultUniqueProperties = {
    height: 100,
    width: 100,
    x: 0,
    y: 0,
  };

  const slide1 = new Slide(factory);

  const appHistory: AppHistory = {
    slide1: new History(slide1),
  };

  slide1.addImage(butterflyImage, defaultUniqueProperties);
  slide1.addImage(butterflyImage, {
    ...defaultUniqueProperties,
    x: 100,
  });
  slide1.render();
  appHistory.slide1.backup();
  appHistory.slide1.showHistory();
}

export const name = 'Flyweight Memento';
