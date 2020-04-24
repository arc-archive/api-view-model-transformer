import { fixture, assert } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import '../api-view-model-transformer.js';

// "raw" model can be an annotation added to another shape.
// This test the annotations on a security scheme.

describe('<api-view-model-transformer>', function() {
  async function basicFixture() {
    return (await fixture(`<api-view-model-transformer></api-view-model-transformer>`));
  }

  const apiFile = 'annotated-oauth2';

  function getSettingValue(element, scheme, name, prop) {
    const cpKey = Object.keys(scheme).find((key) => key.indexOf('amf://') === 0);
    const data = scheme[cpKey];
    const dataKey = element._getAmfKey(element.ns.raml.vocabularies.data + name);
    let item = data[dataKey];
    if (item instanceof Array) {
      item = item[0];
    }
    const propKey = element._getAmfKey(element.ns.raml.vocabularies.data + prop);
    return item[propKey][0];
  }

  function findByName(model, name) {
    return model.find((item) => item.name === name);
  }

  describe('Model from annotations', () => {
    [
      ['Compact model', true],
      ['Full model', false]
    ].forEach(([label, compact]) => {
      describe(String(label), () => {
        describe('PropertyShape schema', () => {
          let amf;

          before(async () => {
            amf = await AmfLoader.load(compact, apiFile);
          });

          let element;
          let scheme;
          beforeEach(async () => {
            element = await basicFixture();
            element.clearCache();
            element.amf = amf;
            scheme = AmfLoader.lookupSecuritySettings(amf, '/oauth2', 'get');
          });

          it('generates view model for an object', () => {
            const model = getSettingValue(element, scheme, 'authorizationSettings', 'queryParameters');
            const result = element.computeViewModel(model);
            assert.typeOf(result, 'array', 'result is an array');
            assert.lengthOf(result, 5, 'result has 5 items');
          });

          it('computes string type', () => {
            const model = getSettingValue(element, scheme, 'authorizationSettings', 'queryParameters');
            const result = element.computeViewModel(model);
            const item = findByName(result, 'resource');
            assert.equal(item.schema.type, 'string', 'has type');
            assert.equal(item.schema.pattern, '[a-zA-Z]+', 'has pattern');
            assert.typeOf(item.extendedDescription, 'string', 'extendedDescription is set');
            assert.isTrue(item.hasExtendedDescription, 'hasExtendedDescription is set');
            const { examples } = item.schema;
            assert.lengthOf(examples, 2, 'example has 2 items');
            assert.equal(examples[0].value, 'named example value', 'example value is set');
            assert.equal(examples[0].name, 'named', 'example name is set');
          });

          it('computes number type', () => {
            const model = getSettingValue(element, scheme, 'authorizationSettings', 'queryParameters');
            const result = element.computeViewModel(model);
            const item = findByName(result, 'numericParam');
            assert.equal(item.schema.type, 'number', 'has type');
            assert.equal(item.schema.inputType, 'number', 'has inputType');
            assert.equal(item.schema.maximum, 20, 'has maximum');
            assert.equal(item.schema.minimum, 10, 'has minimum');
            assert.equal(item.schema.multipleOf, 2, 'has multipleOf');
            assert.equal(item.schema.format, 'float', 'has format');
            assert.deepEqual(item.schema.examples, [22], 'has examples');
          });

          it('computes date-only type', () => {
            const model = getSettingValue(element, scheme, 'authorizationSettings', 'queryParameters');
            const result = element.computeViewModel(model);
            const item = findByName(result, 'dateParam');
            assert.equal(item.schema.type, 'date-only');
            assert.equal(item.schema.inputType, 'date');
          });

          it('computes array type', () => {
            const model = getSettingValue(element, scheme, 'authorizationSettings', 'queryParameters');
            const result = element.computeViewModel(model);
            const item = findByName(result, 'repetableParam1');
            assert.equal(item.schema.type, 'array', 'type is set');
            assert.isTrue(item.schema.isArray, 'isArray is set');
            assert.equal(item.schema.items, 'string', 'items is set');
            assert.typeOf(item.value, 'array', 'value is an array');
          });

          it('computes required to false', () => {
            const model = getSettingValue(element, scheme, 'authorizationSettings', 'queryParameters');
            const result = element.computeViewModel(model);
            const item = findByName(result, 'dateParam');
            assert.isFalse(item.required);
          });

          it('computes required to true', () => {
            const model = getSettingValue(element, scheme, 'authorizationSettings', 'queryParameters');
            const result = element.computeViewModel(model);
            const item = findByName(result, 'resource');
            assert.isTrue(item.required);
          });
        });
      });
    });
  });
});
