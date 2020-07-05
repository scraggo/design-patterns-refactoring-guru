import { log } from '../utils';

interface BaseCar {
  brand: string;
  model: string;
  color: string;
}

interface OwnedCar extends BaseCar {
  owner: string;
  plates: string;
}

interface Flyweights {
  [key: string]: Flyweight;
}

/**
 * The Flyweight stores a common portion of the state (also called intrinsic
 * state) that belongs to multiple real business entities. The Flyweight accepts
 * the rest of the state (extrinsic state, unique for each entity) via its
 * method parameters.
 */
class Flyweight {
  private sharedState: BaseCar;

  constructor(sharedState: BaseCar) {
    this.sharedState = sharedState;
  }

  public operation(uniqueState: any): void {
    const s = JSON.stringify(this.sharedState);
    const u = JSON.stringify(uniqueState);
    log(`Flyweight: Displaying shared (${s}) and unique (${u}) state.`);
  }
}

/**
 * The Flyweight Factory creates and manages the Flyweight objects. It ensures
 * that flyweights are shared correctly. When the client requests a flyweight,
 * the factory either returns an existing instance or creates a new one, if it
 * doesn't exist yet.
 */
class FlyweightFactory {
  // private flyweights: { [key: string]: Flyweight; } = <any>{};
  private flyweights: Flyweights = {};

  constructor(initialFlyweights: BaseCar[]) {
    Object.values(initialFlyweights).forEach((state) => {
      this.flyweights[this.getKey(state)] = new Flyweight(state);
    });
  }

  /*
   * Returns a Flyweight's string hash for a given state.
   */
  private getKey(state: BaseCar): string {
    const { brand, color, model } = state;
    return [brand, model, color].join('_');
  }

  /*
   * Returns an existing Flyweight with a given state or creates a new one.
   */
  public getFlyweight(sharedState: BaseCar): Flyweight {
    const key = this.getKey(sharedState);

    if (key in this.flyweights) {
      log('FlyweightFactory: Reusing existing flyweight.');
    } else {
      log("FlyweightFactory: Can't find a flyweight, creating new one.");
      this.flyweights[key] = new Flyweight(sharedState);
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
  /**
   * The client code usually creates a bunch of pre-populated flyweights in the
   * initialization stage of the application.
   */
  const factory = new FlyweightFactory([
    { brand: 'Chevrolet', model: 'Camaro2018', color: 'pink' },
    { brand: 'Mercedes Benz', model: 'C300', color: 'black' },
    { brand: 'Mercedes Benz', model: 'C500', color: 'red' },
    { brand: 'BMW', model: 'M5', color: 'red' },
    { brand: 'BMW', model: 'X6', color: 'white' },
    // ...
  ]);
  factory.listFlyweights();

  // ...

  function addCarToPoliceDatabase(ff: FlyweightFactory, carDetails: OwnedCar) {
    const { brand, color, model, owner, plates } = carDetails;
    log('\nClient: Adding a car to database.');
    const flyweight = ff.getFlyweight({ brand, model, color });

    // The client code either stores or calculates extrinsic state and passes it
    // to the flyweight's methods.
    flyweight.operation({ plates, owner });
  }

  addCarToPoliceDatabase(factory, {
    plates: 'CL234IR',
    owner: 'James Doe',
    brand: 'BMW',
    model: 'M5',
    color: 'red',
  });
  addCarToPoliceDatabase(factory, {
    plates: 'CL234IR',
    owner: 'James Doe',
    brand: 'BMW',
    model: 'X1',
    color: 'red',
  });

  factory.listFlyweights();
}

export const name = 'Flyweight';
