import { Singleton } from './singleton';

/*
 * The client code.
 */
function main() {
  const s1 = Singleton.getInstance();
  const s2 = Singleton.getInstance();

  if (s1 === s2) {
    console.log('s1 ===s2: Singleton works, both variables contain the same instance.');
  } else {
    console.log('Singleton failed, variables contain different instances.');
  }

  s1.someBusinessLogic();
}

const name = 'Singleton';

export { name, main };
