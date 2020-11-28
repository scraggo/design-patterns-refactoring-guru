import { expect } from 'chai';

import { assignLogStubToTestContext, getArgsForCall } from '../src/utils-test';
import {
  AppHistory,
  History,
  ImageFlyweightFactory,
  ImageShared,
  Slide,
} from '../src/combinations/flyweight-memento';

// default images
const butterflyImage: ImageShared = { data: '101010', name: 'butterfly' };
const flowerImage: ImageShared = { data: '101001', name: 'flower' };
const sunImage: ImageShared = { data: '101101', name: 'sun' };

const defaultUniqueProperties = {
  height: 100,
  width: 100,
  x: 0,
  y: 0,
};

const createFactory = () => {
  // add default images
  return new ImageFlyweightFactory([
    butterflyImage,
    flowerImage,
    sunImage,
    // ...
  ]);
};

export function main() {
  const factory = createFactory();

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

const checkSlideRender = (
  logStub: sinon.SinonStub,
  title: string,
  text: string,
  images: string
) => {
  expect(getArgsForCall(logStub, 1)[0]).to.equal(title);
  expect(getArgsForCall(logStub, 2)[0]).to.equal(text);
  expect(getArgsForCall(logStub, 3)[0]).to.equal(images);
};

describe.only('Flyweight-memento Combination', function () {
  // assignLogStubToTestContext();

  beforeEach(function () {
    const factory = createFactory();
    this.slide = new Slide(factory);
    const appHistory = {
      slide1: new History(this.slide),
    } as AppHistory;
    this.history = appHistory.slide1;
  });

  describe('Factory', function () {
    assignLogStubToTestContext();
    it('listFlyweights() logs available flyweights', function () {
      const factory = createFactory();
      factory.listFlyweights();

      expect(this.logStub).to.have.been.calledWith(
        'length: 3 - butterfly,flower,sun'
      );
    });
  });

  describe('Slide', function () {
    assignLogStubToTestContext();
    it('renders an initially empty slide', function () {
      this.slide.render();
      checkSlideRender(this.logStub, '<h1>Slide 1</h1>', '', '');
    });

    it('renders a slide with text and 2 images', function () {
      this.slide.addImage(butterflyImage, defaultUniqueProperties);
      this.slide.addImage(butterflyImage, {
        ...defaultUniqueProperties,
        x: 100,
      });
      this.slide.addText('hello');
      this.slide.render();
      checkSlideRender(
        this.logStub,
        '<h1>Slide 1</h1>',
        '<div>hello</div>',
        '<img alt=butterfly src=101010 height=100 width=100 left=0 top=0 />\n<img alt=butterfly src=101010 height=100 width=100 left=100 top=0 />'
      );
    });
  });

  describe('App', function () {
    assignLogStubToTestContext();
    it('initially shows an empty history', function () {
      this.history.showHistory();
      expect(this.logStub).to.not.been.called;
    });

    it('shows populated history', function () {
      this.slide.addText('hi');
      this.slide.addText('hello');
      this.history.backup();
      this.history.showHistory();

      const calls = getArgsForCall(this.logStub, 0);
      expect(calls).to.have.length(1);
      expect(calls[0]).to.include('text: hi, hello');
    });

    it.only('adds to populated history', function () {
      this.slide.addText('hi');
      this.history.backup();
      this.slide.addImage(butterflyImage, defaultUniqueProperties);
      this.history.backup();
      this.history.showHistory();
      const calls = getArgsForCall(this.logStub, 0);
      console.log(calls[0]);
      expect(calls).to.have.length(1);
      expect(calls[0]).to.include('text: hi');
      expect(calls[0]).to.include(
        'images: butterfly - {"height":100,"width":100,"x":0,"y":0}'
      );
    });
  });
});
