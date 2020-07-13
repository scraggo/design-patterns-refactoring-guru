import { Iterator, WordsCollection } from '../behavioral/iterator';
import { log } from '../utils';

// initialized with a collection, defer processing the collection to Visitor
interface Component {
  accept(visitor: Visitor): void;
  getCollection(): any;
}

// Doesn't access collection directly, does so through component
// the collection processing logic is handled here
interface Visitor {
  visitWordsDisplay(element: Component): string;
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

export class WordsDisplayComponent implements Component {
  private collection: WordsCollection;
  private currentDisplay = '';

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
    log(this.currentDisplay);
  }
}

export function main() {
  log('Iterator Visitor Combination');
}

export const name = 'Iterator-Visitor';
