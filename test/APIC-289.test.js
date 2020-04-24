import { fixture, assert } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import '../api-view-model-transformer.js';

describe('<api-view-model-transformer>', function() {
  async function basicFixture() {
    return (await fixture(`<api-view-model-transformer></api-view-model-transformer>`));
  }

  const apiFile = 'APIC-289';

  describe('APIC-289', () => {
    [
      ['Full model', false],
      ['Compact model', true]
    ].forEach(([label, compact]) => {
      describe(String(label), () => {
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
          });

          it('generates view model', () => {
            model = AmfLoader.lookupOperationParameters(amf, '/organization', 'get');
            const result = element.computeViewModel(model);

            assert.lengthOf(result, 1, 'result has 1 item');
            const [item] = result;
            assert.equal(item.name, 'foo');
          });
        });
      });
    });
  });
});
