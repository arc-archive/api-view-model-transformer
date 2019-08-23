import { fixture, assert } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import '../api-view-model-transformer.js';

describe('<api-view-model-transformer>', function() {
  async function basicFixture() {
    return (await fixture(`<api-view-model-transformer></api-view-model-transformer>`));
  }

  async function manualFixture() {
    return (await fixture(`<api-view-model-transformer manualmodel></api-view-model-transformer>`));
  }

  function computeHeaders(element, amf, endpointIndex) {
    const webApi = element._computeWebApi(amf);
    const endpoints = element._computeEndpoints(webApi);
    const endpoint = endpoints[endpointIndex];
    const opKey = element._getAmfKey(element.ns.w3.hydra.supportedOperation);
    const operation = element._ensureArray(endpoint[opKey])[0];
    const expects = element._computeExpects(operation);
    const hKey = element._getAmfKey(element.ns.raml.vocabularies.http + 'header');
    return element._ensureArray(expects[hKey]);
  }

  [
    ['Regular model', false],
    ['Compact model', true]
  ].forEach((item) => {
    describe(item[0], () => {
      describe('Model for headers', () => {
        let amf;
        before(async () => {
          amf = await AmfLoader.load(item[1]);
        });

        describe('computeViewModel()', () => {
          let model;
          let element;
          beforeEach(async () => {
            element = await basicFixture();
            element.clearCache();
            element.amf = amf;
            model = computeHeaders(element, amf, 3);
          });

          it('Returns an array', () => {
            const result = element.computeViewModel(model);
            assert.typeOf(result, 'array');
          });

          it('Has 3 items', () => {
            const result = element.computeViewModel(model);
            assert.lengthOf(result, 3);
          });

          it('Item #1 has all defined properties', () => {
            const result = element.computeViewModel(model.slice(0, 1));
            const header = result[0];
            assert.equal(header.binding, 'header', 'Binding is set');
            assert.notEqual(header.description.indexOf('The application id used'), -1, 'Description is set');
            assert.isTrue(header.hasDescription, 'hasDescription is set');
            assert.equal(header.name, 'x-client-id', 'Name is set');
            assert.isTrue(header.required, 'Required is set');
            assert.equal(header.value, '123456-acme.client.com', 'Default value is set');
            assert.typeOf(header.schema, 'object', 'Schema is set');
            const schema = header.schema;
            assert.isUndefined(schema.defaultValue, 'defaultValue is undefined');
            assert.isTrue(schema.enabled, 'Is enabled');
            assert.isUndefined(schema.enum, 'enum is undefined');
            assert.typeOf(schema.examples, 'array', 'Examples are set');
            assert.lengthOf(schema.examples, 1, 'Examples has 1 item');
            const example = schema.examples[0];
            assert.isFalse(example.hasTitle, 'example.hasTitle is false');
            assert.isUndefined(example.title, 'example.title is undefined');
            assert.equal(example.value, '123456-acme.client.com', 'example.value is set');
            assert.equal(schema.inputPlaceholder, 'Example: 123456-acme.client.com', 'inputPlaceholder is set');
            // When placeholder is set
            assert.isTrue(schema.inputFloatLabel, 'inputFloatLabel is true');
            assert.equal(schema.inputLabel, 'x-client-id*', 'inputLabel is set and required');
            assert.equal(schema.inputType, 'text', 'inputType is set');
            assert.isFalse(schema.isArray, 'is not isArray');
            assert.isFalse(schema.isBool, 'is not isBool');
            assert.isFalse(schema.isEnum, 'is not isEnum');
            assert.isFalse(schema.isObject, 'is not isObject');
            assert.isUndefined(schema.items, 'items is undefined');
            assert.isUndefined(schema.maxLength, 'maxLength is undefined');
            assert.isUndefined(schema.maximum, 'maximum is undefined');
            assert.isUndefined(schema.minLength, 'minLength is undefined');
            assert.isUndefined(schema.minimum, 'minimum is undefined');
            assert.isUndefined(schema.multipleOf, 'multipleOf is undefined');
            assert.isUndefined(schema.pattern, 'pattern is undefined');
            assert.equal(schema.type, 'string', 'type is set');
          });

          it('Item #2 has all defined properties', () => {
            const result = element.computeViewModel(model.slice(1, 2));
            const header = result[0];
            assert.equal(header.binding, 'header', 'Binding is set');
            assert.notEqual(header.description.indexOf('People'), -1, 'Description is set');
            assert.isTrue(header.hasDescription, 'hasDescription is set');
            assert.equal(header.name, 'x-people-op-id', 'Name is set');
            assert.isTrue(header.required, 'Required is set');
            assert.equal(header.value, '9719fa6f-c666-48e0-a191-290890760b30', 'Default value is set');
            assert.typeOf(header.schema, 'object', 'Schema is set');
            assert.typeOf(header.extendedDescription, 'string', 'extendedDescription is set');
            assert.isTrue(header.hasExtendedDescription, 'hasExtendedDescription is set');
            const schema = header.schema;
            assert.isUndefined(schema.defaultValue, 'defaultValue is undefined');
            assert.isTrue(schema.enabled, 'Is enabled');
            assert.isUndefined(schema.enum, 'enum is undefined');
            assert.typeOf(schema.examples, 'array', 'Examples are set');
            assert.lengthOf(schema.examples, 1, 'Examples has 1 item');
            const example = schema.examples[0];
            assert.isFalse(example.hasTitle, 'example.hasTitle is false');
            assert.isUndefined(example.title, 'example.title is undefined');
            assert.equal(example.value, '9719fa6f-c666-48e0-a191-290890760b30', 'example.value is set');
            assert.equal(schema.inputPlaceholder,
              'Example: 9719fa6f-c666-48e0-a191-290890760b30',
              'inputPlaceholder is set');
            // When placeholder is set
            assert.isTrue(schema.inputFloatLabel, 'inputFloatLabel is true');
            assert.equal(schema.inputLabel, 'x-people-op-id*', 'inputLabel is set and required');
            assert.equal(schema.inputType, 'text', 'inputType is set');
            assert.isFalse(schema.isArray, 'is not isArray');
            assert.isFalse(schema.isBool, 'is not isBool');
            assert.isFalse(schema.isEnum, 'is not isEnum');
            assert.isFalse(schema.isObject, 'is not isObject');
            assert.isUndefined(schema.items, 'items is undefined');
            assert.isUndefined(schema.maxLength, 'maxLength is undefined');
            assert.isUndefined(schema.maximum, 'maximum is undefined');
            assert.isUndefined(schema.minLength, 'minLength is undefined');
            assert.isUndefined(schema.minimum, 'minimum is undefined');
            assert.isUndefined(schema.multipleOf, 'multipleOf is undefined');
            assert.equal(schema.pattern,
              '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$',
              'pattern is set');
            assert.equal(schema.type, 'string', 'type is set');
          });

          it('Item #3 has all defined properties', () => {
            const result = element.computeViewModel(model.slice(2, 3));
            const header = result[0];
            assert.equal(header.binding, 'header', 'Binding is set');
            assert.isUndefined(header.description, 'Description is undefined');
            assert.isFalse(header.hasDescription, 'hasDescription is set');
            assert.equal(header.name, 'x-enum', 'Name is set');
            assert.isTrue(header.required, 'Required is set');
            assert.equal(header.value, 'a', 'value is set');
            assert.typeOf(header.schema, 'object', 'Schema is set');
            assert.isUndefined(header.extendedDescription, 'string', 'extendedDescription is not set');
            assert.isFalse(header.hasExtendedDescription, 'hasExtendedDescription is false');
            const schema = header.schema;
            assert.isUndefined(schema.defaultValue, 'defaultValue is undefined');
            assert.isTrue(schema.enabled, 'Is enabled');
            assert.typeOf(schema.enum, 'array', 'enum is set');
            assert.lengthOf(schema.enum, 3, 'enum has 3 items');
            assert.deepEqual(schema.enum, ['a', 'b', 'c'], 'enum has model values');
            assert.isUndefined(schema.examples, 'Examples are set');
            assert.isUndefined(schema.inputFloatLabel, 'inputFloatLabel is undefined');
            assert.equal(schema.inputLabel, 'x-enum*', 'inputLabel is set and required');
            assert.equal(schema.inputType, 'text', 'inputType is set');
            assert.isFalse(schema.isArray, 'is not isArray');
            assert.isFalse(schema.isBool, 'is not isBool');
            assert.isTrue(schema.isEnum, 'isEnum eq true');
            assert.isFalse(schema.isObject, 'is not isObject');
            assert.isUndefined(schema.items, 'items is undefined');
            assert.isUndefined(schema.maxLength, 'maxLength is undefined');
            assert.isUndefined(schema.maximum, 'maximum is undefined');
            assert.isUndefined(schema.minLength, 'minLength is undefined');
            assert.isUndefined(schema.minimum, 'minimum is undefined');
            assert.isUndefined(schema.multipleOf, 'multipleOf is undefined');
            assert.isUndefined(schema.pattern, 'pattern is set');
            assert.equal(schema.type, 'string', 'type is set');
          });
        });

        describe('Nil values', () => {
          let model;
          let element;
          beforeEach(async () => {
            element = await basicFixture();
            element.clearCache();
            element.amf = amf;
            model = computeHeaders(element, amf, 2);
          });

          it('Nil value is set', () => {
            const result = element.computeViewModel(model.slice(1, 2));
            assert.equal(result[0].value, 'nil');
          });

          it('Item is read only', () => {
            const result = element.computeViewModel(model.slice(1, 2));
            assert.isTrue(result[0].schema.readOnly);
          });
        });
      });

      describe('Query parameters model', () => {
        let amf;
        before(async () => {
          amf = await AmfLoader.load(item[1]);
        });

        describe('computeViewModel()', () => {
          let model;
          let element;
          beforeEach(async () => {
            element = await basicFixture();
            element.clearCache();
            element.amf = amf;
            const webApi = element._computeWebApi(amf);
            const endpoints = element._computeEndpoints(webApi);
            const endpoint = endpoints[0];
            const opKey = element._getAmfKey(element.ns.w3.hydra.supportedOperation);
            const operation = element._ensureArray(endpoint[opKey])[0];
            const expects = element._computeExpects(operation);
            const pKey = element._getAmfKey(element.ns.raml.vocabularies.http + 'parameter');
            model = element._ensureArray(expects[pKey]);
          });

          it('Resolves to an array', () => {
            const result = element.computeViewModel(model);
            assert.typeOf(result, 'array');
          });

          it('Has 3 items', () => {
            const result = element.computeViewModel(model);
            assert.lengthOf(result, 3);
          });

          it('Has computed data for #1', () => {
            const result = element.computeViewModel(model.slice(0, 1));
            const item = result[0];
            assert.equal(item.binding, 'query', 'Binding is set');
            assert.isUndefined(item.description, 'Description is not set');
            assert.isFalse(item.hasDescription, 'hasDescription is set');
            assert.equal(item.name, 'testRepeatable', 'Name is set');
            assert.isTrue(item.required, 'Required is set');
            assert.typeOf(item.value, 'array', 'Value is an array');

            assert.typeOf(item.schema, 'object', 'Schema is set');
            const schema = item.schema;
            assert.isUndefined(schema.defaultValue, 'defaultValue is undefined');
            assert.isTrue(schema.enabled, 'Is enabled');
            assert.isUndefined(schema.enum, 'enum is undefined');
            assert.typeOf(schema.examples, 'array', 'Examples are set');
            assert.lengthOf(schema.examples, 1, 'Examples has 1 item');
            const example = schema.examples[0];
            assert.isFalse(example.hasTitle, 'example.hasTitle is false');
            assert.isUndefined(example.title, 'example.title is undefined');
            assert.equal(example.value, '[\n  "value1",\n  "value2"\n]', 'example.value is set');
            assert.equal(schema.inputPlaceholder, 'Example: [\n  "value1",\n  "value2"\n]', 'inputPlaceholder is set');
            assert.isTrue(schema.inputFloatLabel, 'inputFloatLabel is true');
            assert.equal(schema.inputLabel, 'testRepeatable*', 'inputLabel is set and required');
            assert.equal(schema.inputType, 'text', 'inputType is set');
            assert.isTrue(schema.isArray, 'isArray is true');
            assert.isFalse(schema.isBool, 'is not isBool');
            assert.isFalse(schema.isEnum, 'is not isEnum');
            assert.isFalse(schema.isObject, 'is not isObject');
            assert.equal(schema.items, 'string', 'items is set');
            assert.isUndefined(schema.maxLength, 'maxLength is undefined');
            assert.isUndefined(schema.maximum, 'maximum is undefined');
            assert.isUndefined(schema.minLength, 'minLength is undefined');
            assert.isUndefined(schema.minimum, 'minimum is undefined');
            assert.isUndefined(schema.multipleOf, 'multipleOf is undefined');
            assert.isUndefined(schema.pattern, 'pattern is undefined');
            assert.equal(schema.type, 'array', 'type is set');
          });

          it('Has computed data for #2', () => {
            const result = element.computeViewModel(model.slice(1, 2));
            const item = result[0];
            assert.equal(item.binding, 'query', 'Binding is set');
            assert.isUndefined(item.description, 'Description is not set');
            assert.isFalse(item.hasDescription, 'hasDescription is set');
            assert.equal(item.name, 'numericRepeatable', 'Name is set');
            assert.isTrue(item.required, 'Required is set');
            assert.typeOf(item.value, 'array', 'Value is an array');
            assert.deepEqual(item.value, [123, 456], 'Value is set');

            assert.typeOf(item.schema, 'object', 'Schema is set');
            const schema = item.schema;
            assert.isUndefined(schema.defaultValue, 'defaultValue is undefined');
            assert.isTrue(schema.enabled, 'Is enabled');
            assert.isUndefined(schema.enum, 'enum is undefined');
            assert.typeOf(schema.examples, 'array', 'Examples are set');
            assert.lengthOf(schema.examples, 2, 'Examples has 2 items');

            const example1 = schema.examples[0];
            assert.isTrue(example1.hasTitle, 'example.hasTitle is true');
            assert.equal(example1.title, 'Some-test-example', 'example.title is undefined');
            assert.equal(example1.value, '[123, 456]', 'example.value is set'); // <----- THIS IS WRONG!

            const example2 = schema.examples[1];
            assert.isTrue(example2.hasTitle, 'example2.hasTitle is true');
            assert.equal(example2.title, 'Other-example', 'example2.title is undefined');
            assert.equal(example2.value, '[1011, 1213]', 'example2.value is set'); // <----- THIS IS WRONG!

            assert.equal(schema.inputPlaceholder,
              'Example: [123, 456]', 'inputPlaceholder is set'); // <----- THIS IS WRONG! is it?
            assert.isTrue(schema.inputFloatLabel, 'inputFloatLabel is true');
            assert.equal(schema.inputLabel, 'numericRepeatable*', 'inputLabel is set and required');
            assert.equal(schema.inputType, 'number', 'inputType is set');
            assert.isTrue(schema.isArray, 'isArray is true');
            assert.isFalse(schema.isBool, 'is not isBool');
            assert.isFalse(schema.isEnum, 'is not isEnum');
            assert.isFalse(schema.isObject, 'is not isObject');
            assert.equal(schema.items, 'integer', 'items is set');
            assert.isUndefined(schema.maxLength, 'maxLength is undefined');
            assert.isUndefined(schema.maximum, 'maximum is undefined');
            assert.isUndefined(schema.minLength, 'minLength is undefined');
            assert.isUndefined(schema.minimum, 'minimum is undefined');
            assert.isUndefined(schema.multipleOf, 'multipleOf is undefined');
            assert.isUndefined(schema.pattern, 'pattern is undefined');
            assert.equal(schema.type, 'array', 'type is set');
          });

          it('Has computed data for #3', () => {
            const result = element.computeViewModel(model.slice(2));
            const item = result[0];
            assert.equal(item.binding, 'query', 'Binding is set');
            assert.isUndefined(item.description, 'Description is not set');
            assert.isFalse(item.hasDescription, 'hasDescription is set');
            assert.equal(item.name, 'notRequiredRepeatable', 'Name is set');
            assert.isFalse(item.required, 'Required is set');
            assert.typeOf(item.value, 'array', 'Value is an array');
            assert.deepEqual(item.value, [''], 'Value is set');

            assert.typeOf(item.schema, 'object', 'Schema is set');
            const schema = item.schema;
            assert.isUndefined(schema.defaultValue, 'defaultValue is undefined');
            assert.isTrue(schema.enabled, 'Is enabled');
            assert.isUndefined(schema.enum, 'enum is undefined');
            assert.typeOf(schema.examples, 'array', 'Examples are undefined');

            assert.equal(schema.inputPlaceholder, 'Example: [""]', 'inputPlaceholder is not set');
            assert.isTrue(schema.inputFloatLabel, 'inputFloatLabel is undefined');
            assert.equal(schema.inputLabel, 'notRequiredRepeatable', 'inputLabel is set and not required');
            assert.equal(schema.inputType, 'date', 'inputType is set');
            assert.isTrue(schema.isArray, 'isArray is true');
            assert.isFalse(schema.isBool, 'is not isBool');
            assert.isFalse(schema.isEnum, 'is not isEnum');
            assert.isFalse(schema.isObject, 'is not isObject');
            assert.equal(schema.items, 'date', 'items is set');
            assert.isUndefined(schema.maxLength, 'maxLength is undefined');
            assert.isUndefined(schema.maximum, 'maximum is undefined');
            assert.isUndefined(schema.minLength, 'minLength is undefined');
            assert.isUndefined(schema.minimum, 'minimum is undefined');
            assert.isUndefined(schema.multipleOf, 'multipleOf is undefined');
            assert.isUndefined(schema.pattern, 'pattern is undefined');
            assert.equal(schema.type, 'array', 'type is set');
          });
        });

        describe('Nil values', () => {
          let model;
          let element;
          beforeEach(async () => {
            element = await basicFixture();
            element.clearCache();
            element.amf = amf;
            const webApi = element._computeWebApi(amf);
            const endpoints = element._computeEndpoints(webApi);
            const endpoint = endpoints[2];
            const opKey = element._getAmfKey(element.ns.w3.hydra.supportedOperation);
            const operation = element._ensureArray(endpoint[opKey])[0];
            const expects = element._computeExpects(operation);
            const pKey = element._getAmfKey(element.ns.raml.vocabularies.http + 'parameter');
            model = element._ensureArray(expects[pKey]);
          });

          it('Nil value is set', () => {
            const result = element.computeViewModel(model.slice(0, 1));
            assert.equal(result[0].value, 'nil');
          });

          it('Item is read only', () => {
            const result = element.computeViewModel(model.slice(0, 1));
            assert.isTrue(result[0].schema.readOnly);
          });
        });

        describe('Default values', () => {
          let model;
          let element;
          beforeEach(async () => {
            element = await basicFixture();
            element.clearCache();
            element.amf = amf;
            model = computeHeaders(element, amf, 12);
          });

          it('Computes string default value', () => {
            const result = element.computeViewModel(model.slice(0, 1));
            assert.strictEqual(result[0].schema.defaultValue, 'TestDefault');
            assert.strictEqual(result[0].value, result[0].schema.defaultValue);
          });

          it('Computes number default value', () => {
            const result = element.computeViewModel(model.slice(1, 2));
            assert.strictEqual(result[0].schema.defaultValue, 1234);
            assert.strictEqual(result[0].value, result[0].schema.defaultValue);
          });

          it('Computes boolean default value', () => {
            const result = element.computeViewModel(model.slice(2, 3));
            assert.strictEqual(result[0].schema.defaultValue, false);
            assert.strictEqual(result[0].value, 'false');
          });

          it('Computes array default value', () => {
            const result = element.computeViewModel(model.slice(3, 4));
            assert.deepEqual(result[0].schema.defaultValue, ['ArrayTest', 'OtherTest']);
            assert.deepEqual(result[0].value, result[0].schema.defaultValue);
          });
        });
      });

      describe('Path parameters model', () => {
        let amf;
        before(async () => {
          amf = await AmfLoader.load(item[1]);
        });

        describe('computeViewModel()', () => {
          let model;
          let element;
          beforeEach(async () => {
            element = await basicFixture();
            element.clearCache();
            element.amf = amf;
            const webApi = element._computeWebApi(amf);
            const endpoints = element._computeEndpoints(webApi);
            const endpoint = endpoints[0];
            const pKey = element._getAmfKey(element.ns.raml.vocabularies.http + 'parameter');
            model = element._ensureArray(endpoint[pKey]);
          });

          it('Resolves to an array', () => {
            const result = element.computeViewModel(model);
            assert.typeOf(result, 'array');
          });

          it('Has 1 item', () => {
            const result = element.computeViewModel(model);
            assert.lengthOf(result, 1);
          });

          it('Has computed data', () => {
            const result = element.computeViewModel(model);
            const item = result[0];
            assert.equal(item.binding, 'path', 'Binding is set');
            assert.isUndefined(item.description, 'Description is not set');
            assert.isFalse(item.hasDescription, 'hasDescription is set');
            assert.equal(item.name, 'feature', 'Name is set');
            assert.isTrue(item.required, 'Required is set');
            assert.equal(item.value, 'A', 'Value is set');

            assert.typeOf(item.schema, 'object', 'Schema is set');
            const schema = item.schema;
            assert.isUndefined(schema.defaultValue, 'defaultValue is undefined');
            assert.isTrue(schema.enabled, 'Is enabled');
            assert.typeOf(schema.enum, 'array', 'enum is set');
            assert.deepEqual(schema.enum, ['A', 'B', 'C'], 'enum values are set');
            assert.isUndefined(schema.examples, 'array', 'Examples is undefined');
            assert.isUndefined(schema.inputPlaceholder, 'inputPlaceholder is not set');
            assert.isUndefined(schema.inputFloatLabel, 'inputFloatLabel is undefined');
            assert.equal(schema.inputLabel, 'feature*', 'inputLabel is set and required');
            assert.equal(schema.inputType, 'text', 'inputType is set');
            assert.isFalse(schema.isArray, 'isArray is true');
            assert.isFalse(schema.isBool, 'is not isBool');
            assert.isTrue(schema.isEnum, 'is not isEnum');
            assert.isFalse(schema.isObject, 'is not isObject');
            assert.isUndefined(schema.items, 'string', 'items is set');
            assert.isUndefined(schema.maxLength, 'maxLength is undefined');
            assert.isUndefined(schema.maximum, 'maximum is undefined');
            assert.isUndefined(schema.minLength, 'minLength is undefined');
            assert.isUndefined(schema.minimum, 'minimum is undefined');
            assert.isUndefined(schema.multipleOf, 'multipleOf is undefined');
            assert.isUndefined(schema.pattern, 'pattern is undefined');
            assert.equal(schema.type, 'string', 'type is set');
          });
        });
      });

      describe('Date formats', () => {
        let amf;
        before(async () => {
          amf = await AmfLoader.load(item[1]);
        });

        let model;
        let element;
        beforeEach(async () => {
          element = await basicFixture();
          element.clearCache();
          element.amf = amf;
          model = computeHeaders(element, amf, 13);
        });

        it('Has pattern for "time" type', () => {
          const result = element.computeViewModel(model);
          const item = result[1];
          assert.equal(item.schema.pattern, '^[0-9]{2}:[0-9]{2}:[0-9]{2}\\.?[0-9]{0,3}$');
        });

        it('Format for "time" type is undefined', () => {
          const result = element.computeViewModel(model);
          const item = result[1];
          assert.isUndefined(item.schema.format);
        });

        it('Placeholder for "time" type is set', () => {
          const result = element.computeViewModel(model);
          const item = result[1];
          assert.equal(item.schema.inputPlaceholder, '00:00:00.000');
        });

        it('Has pattern for "date" type', () => {
          const result = element.computeViewModel(model);
          const item = result[0];
          assert.equal(item.schema.pattern, '^[0-9]{4}-[0-9]{2}-[0-9]{2}$');
        });

        it('Format for "date" type is undefined', () => {
          const result = element.computeViewModel(model);
          const item = result[0];
          assert.isUndefined(item.schema.format);
        });

        it('Placeholder for "date" type is set', () => {
          const result = element.computeViewModel(model);
          const item = result[0];
          assert.equal(item.schema.inputPlaceholder, '0000-00-00');
        });

        it('Has pattern for "datetime-only" type', () => {
          const result = element.computeViewModel(model);
          const item = result[2];
          assert.equal(item.schema.pattern, '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\\.?[0-9]{0,3}$');
        });

        it('Format for "datetime-only" type is undefined', () => {
          const result = element.computeViewModel(model);
          const item = result[2];
          assert.isUndefined(item.schema.format);
        });

        it('Placeholder for "datetime-only" type is set', () => {
          const result = element.computeViewModel(model);
          const item = result[2];
          assert.equal(item.schema.inputPlaceholder, '0000-00-00T00:00:00.000');
        });

        it('Has pattern for "datetime" type, default format', () => {
          const result = element.computeViewModel(model);
          const item = result[3];
          assert.equal(item.schema.pattern, '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.*$');
        });

        it('Format for "datetime" type, default format is undefined', () => {
          const result = element.computeViewModel(model);
          const item = result[3];
          assert.isUndefined(item.schema.format);
        });

        it('Placeholder for "datetime" type, default format is set', () => {
          const result = element.computeViewModel(model);
          const item = result[3];
          assert.equal(item.schema.inputPlaceholder, '0000-00-00T00:00:00Z+01:00');
        });

        it('Has pattern for "datetime" type, rfc3339 format', () => {
          const result = element.computeViewModel(model);
          const item = result[4];
          assert.equal(item.schema.pattern, '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.*$');
        });

        it('Format for "datetime" type, rfc3339 format is set', () => {
          const result = element.computeViewModel(model);
          const item = result[4];
          assert.equal(item.schema.format, 'rfc3339');
        });

        it('Placeholder for "datetime" type, rfc3339 format is set', () => {
          const result = element.computeViewModel(model);
          const item = result[4];
          assert.equal(item.schema.inputPlaceholder, '0000-00-00T00:00:00Z+01:00');
        });

        it('Has no pattern for "datetime" type, rfc2616 format', () => {
          const result = element.computeViewModel(model);
          const item = result[5];
          assert.equal(item.schema.pattern, '');
        });

        it('Format for "datetime" type, rfc2616 format is set', () => {
          const result = element.computeViewModel(model);
          const item = result[5];
          assert.equal(item.schema.format, 'rfc2616');
        });

        it('Placeholder for "datetime" type, rfc2616 format is set', () => {
          const result = element.computeViewModel(model);
          const item = result[5];
          assert.equal(item.schema.inputPlaceholder, 'Sun, 01 Jan 2000 00:00:00 GMT');
        });
      });

      describe('computeViewModel()', () => {
        let amf;
        before(async () => {
          amf = await AmfLoader.load(item[1]);
        });

        let model;
        let element;
        beforeEach(async () => {
          element = await manualFixture();
          element.amf = amf;
          model = computeHeaders(element, amf, 13);
        });

        it('Clears viewModel property', () => {
          element.viewModel = 'TEST';
          element.computeViewModel();
          assert.isUndefined(element.viewModel);
        });

        it('Uses "shape" property when not provided', () => {
          element.shape = model;
          const result = element.computeViewModel();
          assert.typeOf(result, 'array');
        });

        it('Returns undefined when no shape', () => {
          const result = element.computeViewModel();
          assert.isUndefined(result);
        });

        it('Makes a copy of the array', () => {
          const result = element.computeViewModel(model);
          model.push('test');
          assert.notEqual(result.length, model.length);
        });

        it('Sets viewModel property', () => {
          const result = element.computeViewModel(model);
          assert.isTrue(result === element.viewModel);
        });
      });

      describe('_computeViewModel()', () => {
        let amf;
        before(async () => {
          amf = await AmfLoader.load(item[1]);
        });

        let element;
        beforeEach(async () => {
          element = await manualFixture();
          element.amf = amf;
        });

        it('Returns empty array when no argument', () => {
          const result = element._computeViewModel();
          assert.typeOf(result, 'array');
          assert.lengthOf(result, 0);
        });

        it('Returns empty array when argument is empty array', () => {
          const result = element._computeViewModel([]);
          assert.typeOf(result, 'array');
          assert.lengthOf(result, 0);
        });

        it('Returns empty array when argument is invalid object', () => {
          const result = element._computeViewModel({});
          assert.typeOf(result, 'array');
          assert.lengthOf(result, 0);
        });

        it('Do not returns invalid definitions', () => {
          const result = element._computeViewModel([{}]);
          assert.typeOf(result, 'array');
          assert.lengthOf(result, 0);
        });

        it('Returns valid definitions', () => {
          const model = computeHeaders(element, amf, 13);
          const result = element._computeViewModel(model);
          assert.typeOf(result, 'array');
          assert.lengthOf(result, 6);
        });
      });

      function computePropertyShape(element, amf, declareIndex) {
        const decs = element._computeDeclares(amf);
        let dec = decs[declareIndex];
        if (dec instanceof Array) {
          dec = dec[0];
        }
        if (element._hasType(dec, element.ns.raml.vocabularies.shapes + 'ScalarShape')) {
          return dec;
        }
        const key = element._getAmfKey(element.ns.w3.shacl.name + 'property');
        return element._ensureArray(dec[key]);
      }

      describe('uiModelForAmfItem()', () => {
        let amf;
        before(async () => {
          amf = await AmfLoader.load(item[1]);
        });

        let element;
        beforeEach(async () => {
          element = await manualFixture();
          element.amf = amf;
        });

        it('Returns undefined when type is not suppoerted', () => {
          const result = element.uiModelForAmfItem({});
          assert.isUndefined(result);
        });

        it('Returns model for http#Parameter', () => {
          const model = computeHeaders(element, amf, 3)[0];
          const result = element.uiModelForAmfItem(model);
          assert.typeOf(result, 'object');
        });

        it('Returns model for shacl#PropertyShape', () => {
          const model = computePropertyShape(element, amf, 3);
          const result = element.uiModelForAmfItem(model[0]);
          assert.typeOf(result, 'object');
        });
      });

      describe('_uiModelForPropertyShape()', () => {
        let amf;
        before(async () => {
          amf = await AmfLoader.load(item[1]);
        });

        let element;
        beforeEach(async () => {
          element = await manualFixture();
          element.clearCache();
          element.amf = amf;
        });

        it('Returns an object', () => {
          const model = computePropertyShape(element, amf, 3);
          const result = element._uiModelForPropertyShape(model[0]);
          assert.typeOf(result, 'object');
        });

        it('Result\'s binding is "type"', () => {
          const model = computePropertyShape(element, amf, 3);
          const result = element._uiModelForPropertyShape(model[0]);
          assert.equal(result.binding, 'type');
        });

        it('Computes name property', () => {
          const model = computePropertyShape(element, amf, 3);
          const result = element._uiModelForPropertyShape(model[0]);
          assert.equal(result.name, 'error');
        });

        it('Has name and binding only when no range', () => {
          const model = Object.assign({}, computePropertyShape(element, amf, 3)[0]);
          const key = element._getAmfKey(element.ns.raml.vocabularies.shapes + 'range');
          delete model[key];
          const result = element._uiModelForPropertyShape(model);
          assert.typeOf(result.name, 'string');
          assert.typeOf(result.binding, 'string');
          assert.lengthOf(Object.keys(result), 2);
        });

        it('required is computed', () => {
          const model = computePropertyShape(element, amf, 3)[0];
          const result = element._uiModelForPropertyShape(model);
          assert.isTrue(result.required);
        });

        it('Schema is set', () => {
          const model = computePropertyShape(element, amf, 3)[0];
          const result = element._uiModelForPropertyShape(model);
          assert.typeOf(result.schema, 'object');
        });

        it('schema.enabled is always true', () => {
          const model = computePropertyShape(element, amf, 3)[0];
          const result = element._uiModelForPropertyShape(model);
          assert.isTrue(result.schema.enabled);
        });

        it('schema.type is computed', () => {
          const model = computePropertyShape(element, amf, 3)[0];
          const result = element._uiModelForPropertyShape(model);
          assert.equal(result.schema.type, 'boolean');
        });

        it('schema.isEnum is false when no enum', () => {
          const model = computePropertyShape(element, amf, 3)[0];
          const result = element._uiModelForPropertyShape(model);
          assert.isFalse(result.schema.isEnum);
        });

        it('schema.isEnum is true if enum value', () => {
          const model = computePropertyShape(element, amf, 10);
          const result = element._uiModelForPropertyShape(model);
          assert.isTrue(result.schema.isEnum);
        });

        it('schema.inputLabel is computed', () => {
          const model = computePropertyShape(element, amf, 3)[0];
          const result = element._uiModelForPropertyShape(model);
          assert.equal(result.schema.inputLabel, 'error*');
        });

        it('schema.pattern is undefined when missing', () => {
          const model = computePropertyShape(element, amf, 3)[0];
          const result = element._uiModelForPropertyShape(model);
          assert.isUndefined(result.schema.pattern);
        });

        it('schema.pattern is computed', () => {
          const model = computePropertyShape(element, amf, 5)[2];
          const result = element._uiModelForPropertyShape(model);
          assert.equal(result.schema.pattern, '^[0-9a-zA-Z ]+$');
        });

        it('schema.minLength is undefined when missing', () => {
          const model = computePropertyShape(element, amf, 3)[0];
          const result = element._uiModelForPropertyShape(model);
          assert.isUndefined(result.schema.minLength);
        });

        it('schema.maxLength is undefined when missing', () => {
          const model = computePropertyShape(element, amf, 3)[0];
          const result = element._uiModelForPropertyShape(model);
          assert.isUndefined(result.schema.maxLength);
        });

        it('schema.minLength is set', () => {
          const model = computePropertyShape(element, amf, 7);
          const result = element._uiModelForPropertyShape(model);
          assert.equal(result.schema.minLength, 10);
        });

        it('schema.maxLength is set', () => {
          const model = computePropertyShape(element, amf, 7);
          const result = element._uiModelForPropertyShape(model);
          assert.equal(result.schema.maxLength, 20);
        });

        it('schema.defaultValue is computed', () => {
          const model = computePropertyShape(element, amf, 3)[0];
          const result = element._uiModelForPropertyShape(model);
          assert.isTrue(result.schema.defaultValue);
        });

        it('schema.defaultValue is undefined when missing', () => {
          const model = computePropertyShape(element, amf, 3)[1];
          const result = element._uiModelForPropertyShape(model);
          assert.isUndefined(result.schema.defaultValue);
        });

        it('schema.minimum is computed', () => {
          const model = computePropertyShape(element, amf, 4);
          const result = element._uiModelForPropertyShape(model);
          assert.equal(result.schema.minimum, 2.0);
        });

        it('schema.minimum is undefined when missing', () => {
          const model = computePropertyShape(element, amf, 3)[1];
          const result = element._uiModelForPropertyShape(model);
          assert.isUndefined(result.schema.minimum);
        });

        it('schema.maximum is computed', () => {
          const model = computePropertyShape(element, amf, 4);
          const result = element._uiModelForPropertyShape(model);
          assert.equal(result.schema.maximum, 12.0);
        });

        it('schema.maximum is undefined when missing', () => {
          const model = computePropertyShape(element, amf, 3)[1];
          const result = element._uiModelForPropertyShape(model);
          assert.isUndefined(result.schema.maximum);
        });

        it('description is computed', () => {
          const model = computePropertyShape(element, amf, 8)[1];
          const result = element._uiModelForPropertyShape(model);
          assert.typeOf(result.description, 'string');
        });

        it('hasDescription is true when has description', () => {
          const model = computePropertyShape(element, amf, 8)[1];
          const result = element._uiModelForPropertyShape(model);
          assert.isTrue(result.hasDescription);
        });

        it('description is undefined when missing', () => {
          const model = computePropertyShape(element, amf, 4);
          const result = element._uiModelForPropertyShape(model);
          assert.isUndefined(result.description);
        });

        it('hasDescription is false when no description', () => {
          const model = computePropertyShape(element, amf, 4);
          const result = element._uiModelForPropertyShape(model);
          assert.isFalse(result.hasDescription);
        });

        it('description is undefined when noDocs is set', () => {
          element.noDocs = true;
          const model = computePropertyShape(element, amf, 8)[1];
          const result = element._uiModelForPropertyShape(model);
          assert.isUndefined(result.description);
        });

        it('hasDescription is false when noDocs is set', () => {
          element.noDocs = true;
          const model = computePropertyShape(element, amf, 8)[1];
          const result = element._uiModelForPropertyShape(model);
          assert.isFalse(result.hasDescription);
        });
      });

      describe('Nillable union', () => {
        let amf;
        before(async () => {
          amf = await AmfLoader.load(item[1]);
        });

        let element;
        let model;
        beforeEach(async () => {
          element = await manualFixture();
          element.clearCache();
          element.amf = amf;
          model = computeHeaders(element, amf, 14);
        });

        it('Sets "isNillable" property', () => {
          const result = element.computeViewModel(model);
          const item = result[0];
          assert.isTrue(item.schema.isNillable);
        });

        it('"isNillable" is false when no union', () => {
          const result = element.computeViewModel(model);
          const item = result[1];
          assert.isFalse(item.schema.isNillable);
        });

        it('"isNillable" is false when other scalar', () => {
          const result = element.computeViewModel(model);
          const item = result[2];
          assert.isFalse(item.schema.isNillable);
        });

        it('"isNillable" is false when union without nil', () => {
          const result = element.computeViewModel(model);
          const item = result[3];
          assert.isFalse(item.schema.isNillable);
        });
      });
    });
  });
});
