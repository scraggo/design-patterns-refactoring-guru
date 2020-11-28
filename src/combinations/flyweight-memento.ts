import { log } from '../utils';

export interface ImageShared {
  data: string;
  name: string;
}

export interface ImageUnique {
  height: number;
  width: number;
  x: number;
  y: number;
}

// what about ImageFlyweight?
// interface Image extends ImageShared, ImageUnique {}

export interface ImageBackupState {
  sharedState: ImageShared;
  uniqueState: ImageUnique;
}

export interface ImageFlyweights {
  [key: string]: ImageShared;
}

export interface AppHistory {
  [key: string]: History;
}

// think through this more
export interface Memento {
  getState(): object;
  getName(): string;
  getDate(): string;
}

export interface SlideMemento {
  images: ImageBackupState[];
  text: string[];
}

// should probably make an ImageMemento and a TextMemento
// private
class ConcreteMemento implements Memento {
  private state: SlideMemento;
  private date: string;

  constructor(state: SlideMemento) {
    this.state = state;
    this.date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  }

  public getState(): SlideMemento {
    return this.state;
  }

  public getName(): string {
    const { images, text } = this.state;
    const imagesAsString = images
      .map(
        (image) =>
          `${image.sharedState.name} - ${JSON.stringify(image.uniqueState)}`
      )
      .join(', ');
    return `${this.date} / text: ${text.join(
      ', '
    )} / images: ${imagesAsString}`;
  }

  public getDate(): string {
    return this.date;
  }
}

// private
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

  public toBackupState(): ImageBackupState {
    return {
      sharedState: this.sharedState,
      uniqueState: this.uniqueState,
    };
  }

  public toHTML(): string {
    const { data, name } = this.sharedState;
    const { height, width, x, y } = this.uniqueState;
    return `<img alt=${name} src=${data} height=${height} width=${width} left=${x} top=${y} />`;
  }
}

// public
export class ImageFlyweightFactory {
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
    const keys = Object.keys(this.flyweights);
    log(`length: ${keys.length} - ${keys}`);
  }
}

/*
class Slide (Originator)
  getState() -> grab all extrinsicData values, combine with flyweights?
      recombining/restoring - factory.getFlyweight(name)
  save() -> return new ConcreteMemento(this.getState)
  restore(memento: Memento): { this.state = memento.getState(); }
*/
// public
export class Slide {
  private imageFactory: ImageFlyweightFactory;
  private images: Image[] = [];
  private text: string[] = [];
  public title = 'Slide 1';

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

  // simple html render
  render() {
    const logSep = () => log('-'.repeat(79));
    logSep();
    log(`<h1>${this.title}</h1>`);
    log(this.text.map((line) => `<div>${line}</div>`).join('\n'));
    log(this.images.map((image) => image.toHTML()).join('\n'));
    logSep();
  }

  public save(): Memento {
    return new ConcreteMemento({
      images: this.images.map((image) => image.toBackupState()),
      text: this.text,
    });
  }

  public restore(memento: Memento): void {
    const { images, text } = memento.getState() as SlideMemento;
    this.images = images.map((image) => {
      const imageFlyweight = this.imageFactory.getFlyweight(image.sharedState);
      return new Image(imageFlyweight, image.uniqueState);
    });
    this.text = text;
  }
}

// class History (Caretaker) // handle stack of mementos
// calls Slide’s backup related methods
// public
export class History {
  private mementos: Memento[] = [];

  private originator: Slide;

  constructor(originator: Slide) {
    this.originator = originator;
  }

  public backup(): void {
    // log('Backing up state...');
    const state = this.originator.save();
    console.log(state);
    this.mementos.push(this.originator.save());
  }

  public undo(): void {
    log('Attempting undo...');
    if (this.mementos.length === 0) {
      log('Nothing to undo.');
      return;
    }

    const memento = this.mementos.pop() as Memento;
    this.originator.restore(memento);
    log('Undo complete.', memento);
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
  slide1.addText('Butterflies');
  slide1.render();
  appHistory.slide1.backup();
  appHistory.slide1.showHistory();
  // slide1.render();
  // slide1.addText('Butterflies');
  appHistory.slide1.undo();
  appHistory.slide1.showHistory();
  slide1.render();
}

export const name = 'Flyweight Memento';
