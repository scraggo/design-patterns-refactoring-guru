import { Observer, Subject } from '../behavioral/observer';
import { log } from '../utils';

interface StateInterface {
  event: string;
  data: string;
}

const INITIAL_STATE: StateInterface = {
  data: 'init_message',
  event: 'init',
};

export enum CompanyLevel {
  'boss' = 'boss',
  'department' = 'department',
  'employee' = 'employee',
}

/**
 * The Subject owns some important state and notifies observers when the state
 * changes.
 */
export class NotificationSystem implements Subject<StateInterface> {
  /**
   * @type {number} For the sake of simplicity, the Subject's state, essential
   * to all subscribers, is stored in this variable.
   */
  public state = INITIAL_STATE;

  /**
   * @type {Observer[]} List of subscribers. In real life, the list of
   * subscribers can be stored more comprehensively (categorized by event
   * type, etc.).
   */
  private observers: Observer<StateInterface>[] = [];

  /*
   * The subscription management methods.
   */
  public attach(observer: Observer<StateInterface>): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return log('Subject: Observer has been attached already.');
    }

    this.observers.push(observer);
  }

  public detach(observer: Observer<StateInterface>): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return log('Subject: Nonexistent observer.');
    }

    this.observers.splice(observerIndex, 1);
  }

  /**
   * Trigger an update in each subscriber.
   */
  public notify(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }

  /**
   * Usually, the subscription logic is only a fraction of what a Subject can
   * really do. Subjects commonly hold some important business logic, that
   * triggers a notification method whenever something important is about to
   * happen (or after it).
   * @param {CompanyLevel} level CompanyLevel
   */
  public someBusinessLogic(level: CompanyLevel): void {
    this.state = {
      data: `${level}_message`,
      event: level,
    };
    this.notify();
  }
}

// a jumbling of composite and observer
abstract class Component implements Observer<StateInterface> {
  companyLevel: string;

  // composite methods:
  protected parent!: Component | null;
  public abstract add(component: Component): void;
  public abstract remove(component: Component): void;
  public isComposite(): boolean {
    return false;
  }
  public abstract operation(): string;

  // observer methods:

  constructor(companyLevel: string) {
    this.companyLevel = companyLevel;
  }

  public abstract update(subject: Subject<StateInterface>): void;

  public print(update: StateInterface) {
    log(`Event: ${update.event} - Data: ${update.data}`);
  }
}

export class Leaf extends Component {
  public operation(): string {
    return 'Leaf';
  }

  public add(): void {
    // empty
  }
  public remove(): void {
    // empty
  }

  update(subject: Subject<StateInterface>) {
    this.print(subject.state);
  }
}

export class Composite extends Component {
  protected children: Component[] = [];

  public add(component: Component): void {
    this.children.push(component);
  }

  public remove(component: Component): void {
    const componentIndex = this.children.indexOf(component);
    this.children.splice(componentIndex, 1);
  }

  public isComposite(): boolean {
    return true;
  }

  public update(subject: Subject<StateInterface>) {
    const { event } = subject.state;

    if (this.companyLevel === event) {
      this.print(subject.state);
    }

    for (const child of this.children) {
      child.update(subject);
    }
  }

  public operation(): string {
    const results = [];
    for (const child of this.children) {
      results.push(child.operation());
    }

    return `Branch(${results.join('+')})`;
  }
}

export function createCompany() {
  // make "company" with "dev" and "revenue" teams
  const boss = new Composite('boss');
  const dev = new Composite('dev');
  const revenue = new Composite('revenue');
  const dev1 = new Leaf('dev1');
  const dev2 = new Leaf('dev2');
  const rev1 = new Leaf('rev1');

  revenue.add(rev1);
  dev.add(dev1);
  dev.add(dev2);
  boss.add(dev);
  boss.add(revenue);

  return boss;
}

export function main() {
  const notifications = new NotificationSystem();

  const boss = createCompany();
  notifications.attach(boss);

  notifications.someBusinessLogic(CompanyLevel.boss);
  notifications.someBusinessLogic(CompanyLevel.department);
  notifications.someBusinessLogic(CompanyLevel.employee);
}

export const name = 'Composite Observer';
