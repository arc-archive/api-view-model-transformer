import { fixture, assert } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import '../api-view-model-transformer.js';

describe.only('<api-view-model-transformer>', function() {
  async function basicFixture() {
    return (await fixture(`<api-view-model-transformer></api-view-model-transformer>`));
  }

  const apiFile = 'APIC-298';

  describe('APIC-298', () => {
    [
      // ['Full model', false],
      ['Compact model', true]
    ].forEach(([label, compact]) => {
      describe(label, () => {
        describe('PropertyShape schema', () => {
          let amf;

          before(async () => {
            amf = await AmfLoader.load(compact, apiFile);
          });

          let element;
          let model;
          beforeEach(async () => {
            element = await basicFixture();
            element.clearCache();
            element.amf = amf;

            model = AmfLoader.lookupEndpointParameters(amf, '/prescreens/{id}');
          });

          it('generates view model', () => {
            const result = element.computeViewModel(model);
            assert.typeOf(result, 'array', 'result is an array');
            assert.lengthOf(result, 1, 'result has 1 item');
          });

          it('generates view data model', () => {
            const result = element.computeViewModel(model);
            const item = result[0];
            assert.equal(item.name, 'id', 'has name form input');
            assert.equal(item.schema.pattern,
              '^[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{12}$', 'has pattern');
            assert.equal(item.schema.inputLabel, 'id*', 'has input label');
          });
        });
      });
    });
  });
});
