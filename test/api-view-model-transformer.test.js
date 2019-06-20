import { fixture, assert } from '@open-wc/testing';
import sinon from 'sinon/pkg/sinon-esm.js';
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
    it('manualModel is undefined by default', async () => {
      element = await basicFixture();
      assert.isUndefined(element.manualModel);
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

    it('Computes _references', async () => {
      element = await basicFixture();
      element.amf = [{
        'http://a.ml/vocabularies/document#references': ['test']
      }];
      assert.typeOf(element._references, 'array');
      assert.equal(element._references[0], 'test');
    });
  });

  describe('_hasType()', () => {
    let element;
    const model = {
      '@type': [
        'one',
        'two',
        'three'
      ]
    };
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Return false for undefined model', () => {
      const result = element._hasType(undefined, '');
      assert.isFalse(result);
    });

    it('Return false for empty model', () => {
      const result = element._hasType([], '');
      assert.isFalse(result);
    });

    it('Return true for existing type', () => {
      const result = element._hasType(model, 'two');
      assert.isTrue(result);
    });

    it('Return false for missing type', () => {
      const result = element._hasType(model, 'some');
      assert.isFalse(result);
    });
  });

  describe('_computeBinding()', () => {
    let element;
    const model = {
      'http://a.ml/vocabularies/http#binding': [{
        '@value': 'test-value'
      }]
    };
    before(async () => {
      element = await basicFixture();
    });

    it('Returns undefined when no binding', () => {
      const result = element._computeBinding({});
      assert.isUndefined(result);
    });

    it('Returns binding value', () => {
      const result = element._computeBinding(model);
      assert.equal(result, 'test-value');
    });
  });

  describe('_computeFormName()', () => {
    let element;
    const model = {
      'http://schema.org/name': [{
        '@value': 'test-value'
      }]
    };
    before(async () => {
      element = await basicFixture();
    });

    it('Returns undefined when no name', () => {
      const result = element._computeFormName({});
      assert.isUndefined(result);
    });

    it('Returns name value', () => {
      const result = element._computeFormName(model);
      assert.equal(result, 'test-value');
    });
  });

  describe('_computeDescription()', () => {
    let element;
    const model = {
      'http://schema.org/description': [{
        '@value': 'test-value'
      }]
    };
    before(async () => {
      element = await basicFixture();
    });

    it('Returns undefined when no name', () => {
      const result = element._computeDescription({});
      assert.isUndefined(result);
    });

    it('Returns description value', () => {
      const result = element._computeDescription(model);
      assert.equal(result, 'test-value');
    });
  });

  describe('_computeRequired()', () => {
    let element;
    const model = {
      'http://www.w3.org/ns/hydra/core#required': [{
        '@value': 'test-value'
      }]
    };
    before(async () => {
      element = await basicFixture();
    });

    it('Returns undefined when no name', () => {
      const result = element._computeRequired({});
      assert.isUndefined(result);
    });

    it('Returns required value', () => {
      const result = element._computeRequired(model);
      assert.equal(result, 'test-value');
    });
  });

  describe('_computeModelType()', () => {
    let element;

    before(async () => {
      element = await basicFixture();
    });

    it('Returns default value', () => {
      const result = element._computeModelType({});
      assert.equal(result, 'string');
    });

    it('Computes UnionShape', () => {
      const type = 'http://a.ml/vocabularies/shapes#UnionShape';
      const result = element._computeModelType({
        '@type': [type]
      });
      assert.equal(result, 'union');
    });

    it('Computes ArrayShape', () => {
      const type = 'http://a.ml/vocabularies/shapes#ArrayShape';
      const result = element._computeModelType({
        '@type': [type]
      });
      assert.equal(result, 'array');
    });

    it('Computes NodeShape', () => {
      const type = 'http://www.w3.org/ns/shacl#NodeShape';
      const result = element._computeModelType({
        '@type': [type]
      });
      assert.equal(result, 'object');
    });

    it('Computes FileShape', () => {
      const type = 'http://a.ml/vocabularies/shapes#FileShape';
      const result = element._computeModelType({
        '@type': [type]
      });
      assert.equal(result, 'file');
    });

    it('Computes NilShape', () => {
      const type = 'http://a.ml/vocabularies/shapes#NilShape';
      const result = element._computeModelType({
        '@type': [type]
      });
      assert.equal(result, 'null');
    });

    it('Computes AnyShape', () => {
      const type = 'http://a.ml/vocabularies/shapes#AnyShape';
      const result = element._computeModelType({
        '@type': [type]
      });
      assert.equal(result, 'string');
    });

    it('Computes MatrixShape', () => {
      const type = 'http://a.ml/vocabularies/shapes#MatrixShape';
      const result = element._computeModelType({
        '@type': [type]
      });
      assert.equal(result, 'array');
    });

    it('Computes TupleShape', () => {
      const type = 'http://a.ml/vocabularies/shapes#TupleShape';
      const result = element._computeModelType({
        '@type': [type]
      });
      assert.equal(result, 'object');
    });
  });

  describe('_computeModelType() - ScalarShape', () => {
    let element;
    let shape = {
      '@type': ['http://a.ml/vocabularies/shapes#ScalarShape'],
      'http://www.w3.org/ns/shacl#datatype': [{
        '@id': ''
      }]
    };
    before(async () => {
      element = await basicFixture();
    });

    function setType(type) {
      shape['http://www.w3.org/ns/shacl#datatype'][0]['@id'] = type;
    }
    [
      ['http://a.ml/vocabularies/shapes#number', 'number'],
      ['http://www.w3.org/2001/XMLSchema#integer', 'integer'],
      ['http://www.w3.org/2001/XMLSchema#string', 'string'],
      ['http://www.w3.org/2001/XMLSchema#boolean', 'boolean'],
      ['http://www.w3.org/2001/XMLSchema#date', 'date'],
      ['http://www.w3.org/2001/XMLSchema#time', 'time'],
      ['http://www.w3.org/2001/XMLSchema#dateTime', 'datetime'],
      ['http://a.ml/vocabularies/shapes#dateTimeOnly', 'datetime-only'],
      ['http://www.w3.org/2001/XMLSchema#float', 'float'],
      ['http://www.w3.org/2001/XMLSchema#long', 'long'],
      ['http://www.w3.org/2001/XMLSchema#double', 'double'],
      ['http://www.w3.org/2001/XMLSchema#base64Binary', 'string'],
      ['http://a.ml/vocabularies/shapes#password', 'password'],
      ['UNKNOWN', 'string']
    ].forEach((item) => {
      it('Computes ' + item[0], () => {
        setType(item[0]);
        const result = element._computeModelType(shape);
        assert.equal(result, item[1]);
      });
    });
  });


  describe('_computeInputLabel()', () => {
    let element;
    before(async () => {
      element = await basicFixture();
    });

    it('Finds name in the model', () => {
      const result = element._computeInputLabel({
        'http://schema.org/name': [{
          '@value': 'test-name'
        }]
      });
      assert.equal(result, 'test-name');
    });

    it('Adds asterix when required', () => {
      const result = element._computeInputLabel({
        'http://schema.org/name': [{
          '@value': 'test-name'
        }]
      }, true);
      assert.equal(result, 'test-name*');
    });

    it('Uses property name when display name not found', () => {
      const result = element._computeInputLabel({
        'blank': 'test-name'
      }, false, 'other-name');
      assert.equal(result, 'other-name');
    });

    it('Uses default value', () => {
      const result = element._computeInputLabel({}, false, undefined);
      assert.equal(result, 'Input value');
    });
  });

  describe('_computeShaclProperty()', () => {
    const key = 'http://www.w3.org/ns/shacl#';

    let element;
    before(async () => {
      element = await basicFixture();
    });

    it('returns undefined for missing model', () => {
      const result = element._computeShaclProperty();
      assert.isUndefined(result);
    });

    it('returns undefined for missing property', () => {
      const result = element._computeShaclProperty({}, 'test');
      assert.isUndefined(result);
    });

    it('returns value of the property', () => {
      const shape = {};
      shape[key + 'test-key'] = [{'@value': 'test-value'}];
      const result = element._computeShaclProperty(shape, 'test-key');
      assert.equal(result, 'test-value');
    });
  });

  describe('_computeVocabularyShapeProperty()', () => {
    const key = 'http://a.ml/vocabularies/shapes#';

    let element;
    before(async () => {
      element = await basicFixture();
    });

    it('returns undefined for missing model', () => {
      const result = element._computeVocabularyShapeProperty();
      assert.isUndefined(result);
    });

    it('returns undefined for missing property', () => {
      const result = element._computeVocabularyShapeProperty({}, 'test');
      assert.isUndefined(result);
    });

    it('returns value of the property', () => {
      const shape = {};
      shape[key + 'test-key'] = [{'@value': 'test-value'}];
      const result = element._computeVocabularyShapeProperty(shape, 'test-key');
      assert.equal(result, 'test-value');
    });
  });

  describe('_computeModelEnum()', () => {
    let element;
    let model;
    before(async () => {
      element = await basicFixture();
      model = {
        'http://www.w3.org/ns/shacl#in': [{
          '@id': 'file://models/demo-api/demo-api.raml#/web-api/end-points/%2Fpeople%2F%7BpersonId%7D/get/request/parameter/x-enum/scalar/schema/list',
          '@type': 'http://www.w3.org/2000/01/rdf-schema#Seq',
          'http://www.w3.org/2000/01/rdf-schema#_1': [{
            '@id': 'amf://id#635',
            '@type': [
              'http://a.ml/vocabularies/data#Scalar'
            ],
            'http://a.ml/vocabularies/data#value': [
              {
                '@value': 'a',
                '@type': 'http://www.w3.org/2001/XMLSchema#string'
              }
            ]
          }],
          'http://www.w3.org/2000/01/rdf-schema#_2': [{
            '@id': 'amf://id#636',
            '@type': [
              'http://a.ml/vocabularies/data#Scalar'
            ],
            'http://a.ml/vocabularies/data#value': [
              {
                '@value': 'b',
                '@type': 'http://www.w3.org/2001/XMLSchema#string'
              }
            ]
          }],
          'http://www.w3.org/2000/01/rdf-schema#_3': [{
            '@id': 'amf://id#637',
            '@type': [
              'http://a.ml/vocabularies/data#Scalar'
            ],
            'http://a.ml/vocabularies/data#value': [
              {
                '@value': 'c',
                '@type': 'http://www.w3.org/2001/XMLSchema#string'
              }
            ]
          }]
        }]
      };
    });

    it('Returns array', () => {
      const result = element._computeModelEnum(model);
      assert.typeOf(result, 'array');
    });

    it('Array has all items from model', () => {
      const result = element._computeModelEnum(model);
      assert.lengthOf(result, 3);
    });

    it('Items are in order', () => {
      const result = element._computeModelEnum(model);
      assert.deepEqual(result, ['a', 'b', 'c']);
    });
  });

  describe('_computeModelPattern()', () => {
    let element;
    before(async () => {
      element = await basicFixture();
    });

    it('Always returns pattern if provided', () => {
      const result = element._computeModelPattern('time', 'test-pattern');
      assert.equal(result, 'test-pattern');
    });

    it('Returns pattern for time type', () => {
      const result = element._computeModelPattern('time');
      assert.equal(result, '^[0-9]{2}:[0-9]{2}:[0-9]{2}\.?[0-9]{0,3}$');
    });

    it('time pattern matches "partial-time" notation of RFC3339', () => {
      const result = element._computeModelPattern('time');
      const reg = new RegExp(result);
      assert.isTrue(reg.test('00:00:00'), 'Matches HH:mm:ss');
      assert.isTrue(reg.test('00:00:00.0'), 'Matches HH:mm:ss.f');
      assert.isTrue(reg.test('00:00:00.00'), 'Matches HH:mm:ss.ff');
      assert.isTrue(reg.test('00:00:00.000'), 'Matches HH:mm:ss.fff');
      assert.isFalse(reg.test('00:00:00.00Z'), 'Does not matches time zone');
      assert.isFalse(reg.test('00:00'), 'Full time is required');
    });

    it('Returns pattern for date type', () => {
      const result = element._computeModelPattern('date');
      assert.equal(result, '^[0-9]{4}-[0-9]{2}-[0-9]{2}$');
    });

    it('date pattern matches "full-date" notation of RFC3339', () => {
      const result = element._computeModelPattern('date');
      const reg = new RegExp(result);
      assert.isTrue(reg.test('0000-00-00'), 'Matches YYYY-MM-DD');
      assert.isFalse(reg.test('00:00:00.00T00:00:00'), 'Does not matches time');
      assert.isFalse(reg.test('0000-00'), 'Full date is required');
    });

    it('Returns pattern for datetime-only type', () => {
      const result = element._computeModelPattern('datetime-only');
      assert.equal(result, '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.?[0-9]{0,3}$');
    });

    it('datetime-only pattern matches "full-date" and "partial-time" notation of RFC3339', () => {
      const result = element._computeModelPattern('datetime-only');
      const reg = new RegExp(result);
      assert.isTrue(reg.test('0000-00-00T00:00:00'), 'Matches YYYY-MM-DDTHH:mm:ss');
      assert.isTrue(reg.test('0000-00-00T00:00:00.0'), 'Matches YYYY-MM-DDTHH:mm:ss.f');
      assert.isTrue(reg.test('0000-00-00T00:00:00.00'), 'Matches YYYY-MM-DDTHH:mm:ss.ff');
      assert.isTrue(reg.test('0000-00-00T00:00:00.000'), 'Matches YYYY-MM-DDTHH:mm:ss.fff');
      assert.isFalse(reg.test('0000-00-00T00:00:00.00Z'), 'Does not matches time zone');
      assert.isFalse(reg.test('0000-00-00T00'), 'Full date + time is required');
    });

    it('Returns pattern for datetime type, default format', () => {
      const result = element._computeModelPattern('datetime');
      assert.equal(result, '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.*$');
    });

    it('Pattern for datetime type and rfc2616 format is empty', () => {
      const result = element._computeModelPattern('datetime', undefined, 'rfc2616');
      assert.equal(result, '');
    });

    it('_computeTypePlaceholder()', () => {
      let element;
      before(async () => {
        element = await basicFixture();
      });

      it('Returns placeholder value for time', () => {
        const result = element._computeTypePlaceholder('time');
        assert.equal(result, '00:00:00.000');
      });

      it('Returns placeholder value for date', () => {
        const result = element._computeTypePlaceholder('date');
        assert.equal(result, '0000-00-00');
      });

      it('Returns placeholder value for datetime-only', () => {
        const result = element._computeTypePlaceholder('datetime-only');
        assert.equal(result, '0000-00-00T00:00:00.000');
      });

      it('Returns placeholder value for datetime, default format', () => {
        const result = element._computeTypePlaceholder('datetime');
        assert.equal(result, '0000-00-00T00:00:00Z+01:00');
      });

      it('Returns placeholder value for datetime, rfc2616 format', () => {
        const result = element._computeTypePlaceholder('datetime');
        assert.equal(result, 'Sun, 01 Jan 2000 00:00:00 GMT');
      });
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
        detail: {test: true}
      });
      assert.deepEqual(passedData, {test: true});
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

  describe('_computeHasExtendedDocumentation()', () => {
    let element;
    before(async () => {
      element = await basicFixture();
    });

    it('Returns true when "hasDescription"', () => {
      const result = element._computeHasExtendedDocumentation({
        hasDescription: true
      });
      assert.isTrue(result);
    });

    it('Returns false when no "schema"', () => {
      const result = element._computeHasExtendedDocumentation({});
      assert.isFalse(result);
    });

    it('Returns true when "schema.pattern"', () => {
      const result = element._computeHasExtendedDocumentation({
        schema: {
          pattern: 'test'
        }
      });
      assert.isTrue(result);
    });

    it('Returns true when "schema.examples"', () => {
      const result = element._computeHasExtendedDocumentation({
        schema: {
          examples: ['test']
        }
      });
      assert.isTrue(result);
    });

    it('Returns false otherwise', () => {
      const result = element._computeHasExtendedDocumentation({
        schema: {}
      });
      assert.isFalse(result);
    });
  });

  describe('_computeExtendedDocumentation()', () => {
    let element;
    before(async () => {
      element = await basicFixture();
    });

    it('Returns empty string when no schema and description', () => {
      const result = element._computeExtendedDocumentation({});
      assert.equal(result, '');
    });

    it('Returns description only when no schema', () => {
      const result = element._computeExtendedDocumentation({
        description: 'test'
      });
      assert.equal(result, 'test');
    });

    it('Adds pattern to description', () => {
      const result = element._computeExtendedDocumentation({
        description: 'test',
        schema: {
          pattern: 'test'
        }
      });
      assert.equal(result, 'test\n\n\n- Pattern: `test`\n');
    });

    it('Returns pattern only to description', () => {
      const result = element._computeExtendedDocumentation({
        schema: {
          pattern: 'test'
        }
      });
      assert.equal(result, '- Pattern: `test`\n');
    });

    it('Returns exampels', () => {
      const result = element._computeExtendedDocumentation({
        schema: {
          examples: [{
            hasTitle: true,
            name: 'test-name',
            value: 'test-example'
          }]
        }
      });
      assert.equal(result, '- Example test-name: `test-example`\n');
    });
  });

  describe('_computeModelItems()', () => {
    let element;
    before(async () => {
      element = await basicFixture();
    });

    it('Returns undefined if object is not #ArrayShape', () => {
      const result = element._computeModelItems({});
      assert.isUndefined(result);
    });

    it('Returns undefined when no items declaration', () => {
      const obj = {};
      obj['@type'] = [element.ns.raml.vocabularies.shapes + 'ArrayShape'];
      const result = element._computeModelItems(obj);
      assert.isUndefined(result);
    });

    it('Returns "string"', () => {
      const obj = {};
      obj['@type'] = [element.ns.raml.vocabularies.shapes + 'ArrayShape'];
      obj[element.ns.raml.vocabularies.shapes + 'items'] = [{}];
      const result = element._computeModelItems(obj);
      assert.equal(result, 'string');
    });
  });

  describe('_computeModelInputType()', () => {
    let element;
    before(async () => {
      element = await basicFixture();
    });

    it('Returns "text" when no items and array', () => {
      const result = element._computeModelInputType('array');
      assert.equal(result, 'text');
    });

    it('Returns "items.type" when array', () => {
      const result = element._computeModelInputType('array', {
        type: 'number'
      });
      assert.equal(result, 'number');
    });

    it('Returns "items.schema.type" when array', () => {
      const result = element._computeModelInputType('array', {
        schema: {
          type: 'boolean'
        }
      });
      assert.equal(result, 'boolean');
    });
  });

  describe('_computeIsNillable()', () => {
    let element;
    before(async () => {
      element = await basicFixture();
    });

    it('Returns false when no argument', () => {
      const result = element._computeIsNillable();
      assert.isFalse(result);
    });

    it('Returns false when no anyOf key', () => {
      const result = element._computeIsNillable({});
      assert.isFalse(result);
    });
  });

  describe('_exampleAsValue()', () => {
    let element;
    before(async () => {
      element = await basicFixture();
    });

    it('Returns undefined when no argument', () => {
      const result = element._exampleAsValue();
      assert.isUndefined(result);
    });

    it('Returns the same value when argument is not a string', () => {
      const result = element._exampleAsValue(123, {});
      assert.equal(result, 123);
    });

    it('Trims string argument', () => {
      const result = element._exampleAsValue(' abc ', {});
      assert.equal(result, 'abc');
    });

    it('Removes parameter name from example', () => {
      const param = 'test: value';
      const result = element._exampleAsValue(param, {
        valueDelimiter: ':',
        name: 'test'
      });
      assert.equal(result, 'value');
    });

    it('Decodes encoded values', () => {
      const param = 'test%20and+value';
      const result = element._exampleAsValue(param, {
        decodeValues: true
      });
      assert.equal(result, 'test and value');
    });
  });

  describe('__parseArrayExample()', () => {
    let element;
    before(async () => {
      element = await basicFixture();
    });

    it('Returns undefined for empty array string', () => {
      const result = element.__parseArrayExample('[]', {});
      assert.isUndefined(result);
    });

    it('Returns array of examples', () => {
      const result = element.__parseArrayExample('["test-example"]', {});
      assert.typeOf(result, 'array');
      assert.lengthOf(result, 1);
      assert.equal(result[0], 'test-example');
    });

    it('Returns string when argument is not an array', () => {
      const result = element.__parseArrayExample('test-example', {});
      assert.typeOf(result, 'string');
      assert.equal(result, 'test-example');
    });
  });
});
