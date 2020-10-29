import { log } from '../utils';

interface ImageShared {
  data: string;
  name: string;
  size: number;
}

interface Image extends ImageShared {
  height: number;
  width: number;
  x: number;
  y: number;
}

interface ImageFlyweights {
  [key: string]: ImageFlyweight;
}

class ImageFlyweight {
  private sharedState: ImageShared;

  constructor(sharedState: ImageShared) {
    this.sharedState = sharedState;
  }

  public operation(uniqueState: any): string {
    const s = JSON.stringify(this.sharedState);
    const u = JSON.stringify(uniqueState);
    return `Flyweight: Displaying shared (${s}) and unique (${u}) state.`;
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

export function main() {
  const factory = new ImageFlyweightFactory([
    { data: '101010', name: 'butterfly', size: 1000 },
    { data: '101001', name: 'flower', size: 1001 },
    { data: '101101', name: 'sun', size: 1002 },
    // ...
  ]);
  factory.listFlyweights();

  function addImageToDatabase(ff: ImageFlyweightFactory, imageDetails: Image) {
    const { data, name, size, height, width, x, y } = imageDetails;
    const flyweight = ff.getFlyweight({ data, name, size });
    return flyweight.operation({ height, width, x, y });
  }

  const defaultUniqueProperties = {
    height: 100,
    width: 100,
    x: 0,
    y: 0,
  };

  addImageToDatabase(factory, {
    data: '101010', name: 'butterfly', size: 1000,
    ...defaultUniqueProperties,
  });
  addImageToDatabase(factory, {
    data: '101010', name: 'butterfly', size: 1000,
    ...defaultUniqueProperties,
  });

  factory.listFlyweights();
}

export const name = 'Flyweight';
