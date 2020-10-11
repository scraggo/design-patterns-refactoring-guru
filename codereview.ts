/**
 * @module Police Car Database
 * The intent is to add cars to the Police Car Database and we do it by storing the car's shared state in a factory but then we can add unique state to get the car
 *
 * TODO: fix linting errors
 */

/**
 * Car uses flyweight design pattern
 */
class Car {
  private sharedState: any;

  constructor(sharedState: any) {
    this.sharedState = sharedState;
  }

  public operation(uniqueState): void {
    const s = JSON.stringify(this.sharedState);
    const u = JSON.stringify(uniqueState);
    console.log(`Flyweight: Displaying shared (${s}) and unique (${u}) state.`);
  }
}

/**
* Make a Car or return pre-existing car
*/
class GetCar {
  private flyweights: { [key: string]: Car; } = <any>{};

  constructor(initialFlyweights: string[][]) {
    for (const state of initialFlyweights) {
      this.flyweights[this.getKey(state)] = new Car(state);
    }
  }

  /**
   * Returns a Car's string hash for a given state.
   */
  private getKey(state: string[]): string {
    return state.join('_');
  }

  /**
   * Returns an existing Car with a given state or creates a new one.
   */
  public getFlyweight(sharedState: string[]): Car {
    const key = this.getKey(sharedState);

    if (!(key in this.flyweights)) {
      console.log('getFlyweight: Can\'t find a car, creating new one.');
      this.flyweights[key] = new Car(sharedState);
    } else {
      console.log('getFlyweight: Reusing existing car.');
    }

    return this.flyweights[key];
  }

  public listFlyweights(): void {
    const count = Object.keys(this.flyweights).length;
    console.log(`\nFlyweightFactory: I have ${count} flyweights:`);
    for (const key in this.flyweights) {
      console.log(key);
    }
  }
}

// Client code

/**
* initialization the application.
*/
const factory = new GetCar([
  ['Chevrolet', 'Camaro2018', 'pink'],
  ['Mercedes Benz', 'C300', 'black'],
  ['Mercedes Benz', 'C500', 'red'],
  ['BMW', 'M5', 'red'],
  ['BMW', 'X6', 'white'],
  // ...
]);
factory.listFlyweights();

// ...

function addCarToPoliceDatabase(
  ff: GetCar, plates: string, owner: string,
  brand: string, model: string, color: string,
) {
  console.log('\nClient: Adding a car to database.');
  const flyweight = ff.getFlyweight([brand, model, color]);

  // The client code either stores or calculates extrinsic state and passes it
  // to the flyweight's methods.
  flyweight.operation([plates, owner]);
}

addCarToPoliceDatabase(factory, 'CL234IR', 'James Doe', 'BMW', 'M5', 'red');

addCarToPoliceDatabase(factory, 'CL234IR', 'James Doe', 'BMW', 'X1', 'red');

factory.listFlyweights();
