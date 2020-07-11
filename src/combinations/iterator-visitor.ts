import { log } from '../utils';

// initialized with a collection, defer processing the collection to Visitor
interface Component {
  accept(visitor: Visitor): void;
  getCollection(): any;
}

// Doesn't access collection directly, does so through component
// the collection processing logic is handled here
interface Visitor {
  visitWordsDisplay(element: Component): void;
}

const iteratorMap = (iterator: Iterator<string>, mapFn: Function): any[] => {
  const collection = [];

  while (iterator.valid()) {
    collection.push(mapFn(iterator.current()));
    iterator.next();
  }

  return collection;
};

const getHTMLForAnyIterator = (iterator: Iterator<string>) =>
  ['<html><body><ul>']
    .concat(iteratorMap(iterator, (item: string) => `<li>${item}</li>`))
    .concat('</ul></body></html>')
    .join('\n');

const getJSONForAnyIterator = (iterator: Iterator<string>): string =>
  JSON.stringify({
    items: iteratorMap(iterator, (item: string) => item),
  });

export class HTMLDisplayVisitor implements Visitor {
  public visitWordsDisplay(element: Component): string {
    return getHTMLForAnyIterator(element.getCollection().getIterator());
  }
}

export class HTMLReverseDisplayVisitor implements Visitor {
  public visitWordsDisplay(element: Component): string {
    return getHTMLForAnyIterator(element.getCollection().getReverseIterator());
  }
}

export class JSONDisplayVisitor implements Visitor {
  public visitWordsDisplay(element: Component): string {
    return getJSONForAnyIterator(element.getCollection().getIterator());
  }
}

/**
 * Iterator Design Pattern
 *
 * Intent: Lets you traverse elements of a collection without exposing its
 * underlying representation (list, stack, tree, etc.).
 */

interface Iterator<T> {
  // Return the current element.
  current(): T;

  // Return the current element and move forward to next element.
  next(): T;

  // Return the key of the current element.
  key(): number;

  // Checks if current position is valid.
  valid(): boolean;

  // Rewind the Iterator to the first element.
  rewind(): void;
}

interface Aggregator {
  // Retrieve an external iterator.
  getIterator(): Iterator<string>;
}

/**
 * Concrete Iterators implement various traversal algorithms. These classes
 * store the current traversal position at all times.
 */

class AlphabeticalOrderIterator implements Iterator<string> {
  private collection: WordsCollection;

  /**
   * Stores the current traversal position. An iterator may have a lot of
   * other fields for storing iteration state, especially when it is supposed
   * to work with a particular kind of collection.
   */
  private position = 0;

  /**
   * This variable indicates the traversal direction.
   */
  private reverse = false;

  constructor(collection: WordsCollection, reverse = false) {
    this.collection = collection;
    this.reverse = reverse;

    if (reverse) {
      this.position = collection.getCount() - 1;
    }
  }

  /** Moves position to beginning of collection, end of collection if reversed */
  public rewind() {
    this.position = this.reverse ? this.collection.getCount() - 1 : 0;
  }

  public current(): string {
    return this.collection.getItems()[this.position];
  }

  public key(): number {
    return this.position;
  }

  public next(): string {
    const item = this.collection.getItems()[this.position];
    this.position += this.reverse ? -1 : 1;
    return item;
  }

  public valid(): boolean {
    if (this.reverse) {
      return this.position >= 0;
    }

    return this.position < this.collection.getCount();
  }
}

/**
 * Concrete Collections provide one or several methods for retrieving fresh
 * iterator instances, compatible with the collection class.
 */
export class WordsCollection implements Aggregator {
  private items: string[] = [];

  public getItems(): string[] {
    return this.items;
  }

  public getCount(): number {
    return this.items.length;
  }

  public addItem(item: string): void {
    // this might be where I sort the items
    this.items.push(item);
  }

  public getIterator(): Iterator<string> {
    return new AlphabeticalOrderIterator(this);
  }

  public getReverseIterator(): Iterator<string> {
    return new AlphabeticalOrderIterator(this, true);
  }
}

export class WordsDisplayComponent implements Component {
  private collection: WordsCollection;
  private currentDisplay: any;

  constructor(collection: WordsCollection) {
    this.collection = collection;
  }

  // public getter for word collection
  getCollection() {
    return this.collection;
  }

  accept(visitor: Visitor): void {
    this.currentDisplay = visitor.visitWordsDisplay(this);
  }

  display() {
    if (!this.currentDisplay) {
      log('');
      return;
    }
    log(this.currentDisplay);
  }
}

export function main() {
  log('Iterator Visitor Combination');
}

export const name = 'Iterator-Visitor';
