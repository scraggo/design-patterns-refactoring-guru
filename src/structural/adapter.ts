import { log } from '../utils';

/**
 * The Target defines the domain-specific interface used by the client code.
 */
class Target {
  public request(): string {
    return 'Target: The default target\'s behavior.';
  }
}

/**
 * The Adaptee contains some useful behavior, but its interface is incompatible
 * with the existing client code. The Adaptee needs some adaptation before the
 * client code can use it.
 */
class Adaptee {
  public specificRequest(): string {
    return '.eetpadA eht fo roivaheb laicepS';
  }
}

/**
 * The Adapter makes the Adaptee's interface compatible with the Target's
 * interface.
 */
class Adapter extends Target {
  private adaptee: Adaptee;

  constructor(adaptee: Adaptee) {
    super();
    this.adaptee = adaptee;
  }

  public request(): string {
    const result = this.adaptee.specificRequest().split('').reverse().join('');
    return `Adapter: (TRANSLATED) ${result}`;
  }
}

/*
 * The client code supports all classes that follow the Target interface.
 */
function clientCode(target: Target) {
  log(target.request());
}

export function main() {
  log('Client: I can work just fine with the Target objects:');
  const target = new Target();
  clientCode(target);

  log('');

  const adaptee = new Adaptee();
  log(
    "Client: The Adaptee class has a weird interface. See, I don't understand it:"
  );
  log(`Adaptee: ${adaptee.specificRequest()}`);

  log('');

  log('Client: But I can work with it via the Adapter:');
  const adapter = new Adapter(adaptee);
  clientCode(adapter);
}

export const name = 'Adapter';
