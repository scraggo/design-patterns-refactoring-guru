import { expect } from 'chai';

import { assignLogStubToTestContext, getArgsForCall } from '../src/utils-test';
import {
  App,
  ImageFlyweightFactory,
  ImageShared,
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
  return new ImageFlyweightFactory([butterflyImage, flowerImage, sunImage]);
};

const checkSlideRender = (
  logStub: sinon.SinonStub,
  title?: string,
  text?: string,
  images?: string
) => {
  expect(getArgsForCall(logStub, 1)[0]).to.equal(title || '');
  expect(getArgsForCall(logStub, 2)[0]).to.equal(text || '');
  expect(getArgsForCall(logStub, 3)[0]).to.equal(images || '');
};

const checkHistoryRender = (
  logStub: sinon.SinonStub,
  numActions: number,
  ...texts: string[]
) => {
  const title = getArgsForCall(logStub, 0)[0];
  const args1 = getArgsForCall(logStub, 1)[0];
  expect(title).to.equal(`History: ${numActions} actions`);
  texts.forEach((text) => {
    expect(args1).to.include(text);
  });
};

describe('Flyweight-memento Combination', function () {
  assignLogStubToTestContext();

  beforeEach(function () {
    const app = new App(createFactory());
    app.addSlide();
    this.slide = app.getCurrentSlide();
    this.history = app.getCurrentHistory();
  });

  describe('Factory', function () {
    it('listFlyweights() logs available flyweights', function () {
      const factory = createFactory();
      factory.listFlyweights();

      expect(this.logStub).to.have.been.calledWith(
        'length: 3 - butterfly,flower,sun'
      );
    });
  });

  describe('Slide', function () {
    it('renders an initially empty slide', function () {
      this.slide.render();
      checkSlideRender(this.logStub, '<h1>Slide 1</h1>');
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
    it('initially shows an empty history', function () {
      this.history.showHistory();
      checkHistoryRender(this.logStub, 0);
    });

    it('shows populated history', function () {
      this.slide.addText('hi');
      this.slide.addText('hello');
      this.history.backup();
      this.history.showHistory();

      checkHistoryRender(this.logStub, 1, 'text: hi, hello');
    });

    it('adds to populated history', function () {
      this.slide.addText('hi');
      this.history.backup();
      this.slide.addImage(butterflyImage, defaultUniqueProperties);
      this.history.backup();
      this.history.showHistory();

      checkHistoryRender(
        this.logStub,
        2,
        'text: hi',
        'images: butterfly - {"height":100,"width":100,"x":0,"y":0}'
      );
    });

    it('performs undo correctly', function () {
      this.slide.addText('hi');
      this.history.backup(); // save this state
      expect(this.slide.images).to.have.length(0);

      this.slide.addImage(butterflyImage, defaultUniqueProperties);
      expect(this.slide.images).to.have.length(1);

      this.history.undo();
      this.history.showHistory();

      checkHistoryRender(this.logStub, 0);
      expect(this.slide.images).to.have.length(0);
    });
  });
});
