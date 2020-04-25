import { fixture, assert } from '@open-wc/testing';
import * as sinon from 'sinon';
import '../api-view-model-transformer.js';

describe('<api-view-model-transformer>', function() {
  async function basicFixture() {
    return (await fixture(`<api-view-model-transformer></api-view-model-transformer>`));
  }

  async function manualFixture() {
    return (await fixture(`<api-view-model-transformer manualmodel></api-view-model-transformer>`));
  }

  describe('Basic tests', () => {
    let element;
    it('manualModel is false by default', async () => {
      element = await basicFixture();
      assert.isFalse(element.manualModel);
    });

    it('Calls computeViewModel() when shape changes', async () => {
      element = await basicFixture();
      const spy = sinon.spy(element, 'computeViewModel');
      element.shape = {};
      assert.isTrue(spy.called);
    });

    it('Do not call computeViewModel() when is manual', async () => {
      element = await manualFixture();
      const spy = sinon.spy(element, 'computeViewModel');
      element.shape = {};
      assert.isFalse(spy.called);
    });
  });

  describe('_buildPropertyHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Do nothing when event is prevented', () => {
      let called = false;
      element.buildProperty = () => called = true;
      element._buildPropertyHandler({
        defaultPrevented: true
      });
      assert.isFalse(called);
    });

    it('Calls buildProperty() function', () => {
      let called = false;
      element.buildProperty = () => called = true;
      element._buildPropertyHandler({
        stopImmediatePropagation: () => {},
        preventDefault: () => {}
      });
      assert.isTrue(called);
    });

    it('Calls buildProperty() function with the detail object', () => {
      let passedData;
      element.buildProperty = (arg) => passedData = arg;
      element._buildPropertyHandler({
        stopImmediatePropagation: () => {},
        preventDefault: () => {},
        detail: { test: true }
      });
      assert.deepEqual(passedData, { test: true });
    });

    it('Prevents event defaults', () => {
      let called = false;
      element.buildProperty = () => {};
      element._buildPropertyHandler({
        stopImmediatePropagation: () => {},
        preventDefault: () => called = true
      });
      assert.isTrue(called);
    });

    it('Stops propagation of the event', () => {
      let called = false;
      element.buildProperty = () => {};
      element._buildPropertyHandler({
        stopImmediatePropagation: () => called = true,
        preventDefault: () => {}
      });
      assert.isTrue(called);
    });
  });

  describe('buildProperty()', () => {
    let element;
    before(async () => {
      element = await basicFixture();
    });

    it('Returns an object', () => {
      const result = element.buildProperty();
      assert.typeOf(result, 'object');
    });

    it('object has schema', () => {
      const result = element.buildProperty();
      assert.typeOf(result.schema, 'object');
    });

    it('Default schema.type is string', () => {
      const result = element.buildProperty();
      assert.equal(result.schema.type, 'string');
    });

    it('Default schema.isEnum is false', () => {
      const result = element.buildProperty();
      assert.isFalse(result.schema.isEnum);
    });

    it('Default schema.isArray is false', () => {
      const result = element.buildProperty();
      assert.isFalse(result.schema.isArray);
    });

    it('Default schema.isBool is false', () => {
      const result = element.buildProperty();
      assert.isFalse(result.schema.isBool);
    });

    it('Default schema.isFile is false', () => {
      const result = element.buildProperty();
      assert.isFalse(result.schema.isFile);
    });

    it('Default schema.inputType is text', () => {
      const result = element.buildProperty();
      assert.equal(result.schema.inputType, 'text');
    });

    it('Default schema.inputFloatLabel is false', () => {
      const result = element.buildProperty();
      assert.isFalse(result.schema.inputFloatLabel);
    });

    it('Default hasDescription is false', () => {
      const result = element.buildProperty();
      assert.isFalse(result.hasDescription);
    });
  });
});
