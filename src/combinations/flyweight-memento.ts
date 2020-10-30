import { log } from '../utils';

interface ImageShared {
  data: string;
  name: string;
  size: number;
}

interface ImageUnique {
  height: number;
  width: number;
  x: number;
  y: number;
}

interface Image extends ImageShared {
  height: number;
  width: number;
  x: number;
  y: number;
}

interface SlideImage {
  raw: Image;
  html: string;
}

interface ImageFlyweights {
  [key: string]: ImageFlyweight;
}

interface Memento {
  getState(): string;
  getName(): string;
  getDate(): string;
}

class ConcreteMemento implements Memento {
  private state: any;
  private date: string;

  constructor(state: any) {
    this.state = state;
    this.date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  }

  public getState(): string {
    return this.state;
  }

  public getName(): string {
    return `${this.date} / (${JSON.stringify(this.state).substr(0, 9)}...)`;
  }

  public getDate(): string {
    return this.date;
  }
}

class ImageFlyweight {
  private sharedState: ImageShared;

  constructor(sharedState: ImageShared) {
    this.sharedState = sharedState;
  }

  public toHTML(uniqueState: ImageUnique): string {
    const { height, width, x, y } = uniqueState;
    return `<img height=${height} width=${width} left=${x} top=${y} />`;
  }
}

/**
 * The Flyweight Factory creates and manages the Flyweight objects. It ensures
 * that flyweights are shared correctly. When the client requests a flyweight,
 * the factory either returns an existing instance or creates a new one, if it
 * doesn't exist yet.
 */
class ImageFlyweightFactory {
  // private flyweights: { [key: string]: Flyweight; } = <any>{};
  private flyweights: ImageFlyweights = {};

  constructor(initialFlyweights: ImageShared[]) {
    Object.values(initialFlyweights).forEach((state) => {
      this.flyweights[this.getKey(state)] = new ImageFlyweight(state);
    });
  }

  /*
   * Returns a Flyweight's string hash for a given state.
   */
  private getKey(state: ImageShared): string {
    const { name, size } = state;
    return [name, size].join('_');
  }

  /*
   * Returns an existing Flyweight with a given state or creates a new one.
   */
  public getFlyweight(sharedState: ImageShared): ImageFlyweight {
    const key = this.getKey(sharedState);

    if (key in this.flyweights) {
      // log('FlyweightFactory: Reusing existing flyweight.');
    } else {
      // log("FlyweightFactory: Can't find a flyweight, creating new one.");
      this.flyweights[key] = new ImageFlyweight(sharedState);
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
  images: SlideImage[] = [];
  imageFactory: ImageFlyweightFactory;
  text: string[] = [];

  constructor(imageFactory: ImageFlyweightFactory) {
    this.imageFactory = imageFactory;
  }

  // -> user selects existing image. can duplicate and change coordinates
  addImageToSlide(userImageSelection: Image) {
    const { height, width, x, y } = userImageSelection;
    const image = this.imageFactory.getFlyweight(userImageSelection);
    this.images.push({ raw: userImageSelection, html: image.toHTML({ height, width, x, y }) });
  }

  render() {
    // print images and text blocks
  }

  public save(): Memento {
    return new ConcreteMemento({ images: this.images, text: this.text });
  }

  public restore(memento: Memento): void {
    const state = memento.getState();
    log(`Originator: My state has changed to: ${JSON.stringify(state)}`);
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
    log("\nCaretaker: Saving Originator's state...");
    this.mementos.push(this.originator.save());
  }

  public undo(): void {
    if (this.mementos.length === 0) {
      log('Caretaker: Nothing left to undo.');
      return;
    }

    const memento = this.mementos.pop() as Memento;

    log(`Caretaker: Restoring state to: ${memento.getName()}`);
    this.originator.restore(memento);
  }

  public showHistory(): void {
    log("Caretaker: Here's the list of mementos:");
    for (const memento of this.mementos) {
      log(memento.getName());
    }
  }
}

export function main() {
  const factory = new ImageFlyweightFactory([
    { data: '101010', name: 'butterfly', size: 1000 },
    { data: '101001', name: 'flower', size: 1001 },
    { data: '101101', name: 'sun', size: 1002 },
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
  const slide1History = new History(slide1);
  slide1.save();
  slide1History.showHistory();
  slide1.addImageToSlide({
    data: '101010', name: 'butterfly', size: 1000,
    ...defaultUniqueProperties,
  });
  slide1.addImageToSlide({
    data: '101010', name: 'butterfly', size: 1000,
    ...defaultUniqueProperties,
    x: 100,
  });
  slide1.render();
}

export const name = 'Flyweight Memento';
