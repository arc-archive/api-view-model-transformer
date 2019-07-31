import { LitElement } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import { EventsTargetMixin } from '@advanced-rest-client/events-target-mixin/events-target-mixin.js';
import '@api-components/api-example-generator/api-example-generator.js';

function noop() {}

const GLOBAL_PATH_PARAMS = [];
const GLOBAL_QUERY_PARAMS = [];
const GLOBAL_OTHER_PARAMS = [];
/**
 * Generates a common key from data model item.
 *
 * @param {Object} data AMF type object model.
 * @return {String} Generated key to search for the item.
 */
function getKey(data) {
  let key = data.name + '-' + data.schema.type;
  if (data.schema.isEnum) {
    key += '-enum';
  }
  if (data.required) {
    key += '-required';
  }
  return key;
}
/**
 * Searches for a model value in cache store.
 *
 * @param {Object} data AMF model item.
 * @return {Object|undefined} Model item or undefined if not found.
 */
function getGlobalValue(data) {
  let store;
  switch (data.binding) {
    case 'query': store = GLOBAL_QUERY_PARAMS; break;
    case 'path': store = GLOBAL_PATH_PARAMS; break;
    default: store = GLOBAL_OTHER_PARAMS; break;
  }
  if (!store.length) {
    return;
  }
  const key = getKey(data);
  for (let i = 0, len = store.length; i < len; i++) {
    if (store[i].key === key) {
      return store[i].value;
    }
  }
}
/**
 * Appends a value item to the global params.
 *
 * @param {Object} data Model item to be added to the list.
 */
function appendGlobalValue(data) {
  const item = getGlobalValue(data);
  if (item) {
    return;
  }
  const key = getKey(data);
  const model = {
    key: key,
    value: data
  };
  switch (data.binding) {
    case 'query': GLOBAL_QUERY_PARAMS.push(model); break;
    case 'path': GLOBAL_PATH_PARAMS.push(model); break;
    default: GLOBAL_OTHER_PARAMS.push(model); break;
  }
}
/**
 * @license
 * Copyright 2016 The Advanced REST client authors <arc@mulesoft.com>
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
const NUMBER_INPUT_TYPES = ['number', 'integer', 'float'];
/**
 * An element to transform AMF LD model into a form view model.
 *
 * Note, this element does not include polyfills for `Promise` and `Array.from`.
 *
 * The model should be used to build a form view for request parameters
 * like header, query parameters, uri parameters or the body.
 *
 * ### Data model
 * - binding {String} - one of `path`, `query`, `header`
 * - name {String} - property (form) name
 * - required {Boolean} - is property required
 * - value {any} - Value of the property
 * - description {String} - The description of the property
 * - hasDescription {Boolean} - Flag describing if the property has a
 * description.
 * - properties {Array<Object>} - If the model is a type of object it is a list
 * of this model objects.
 * - schema {Object} - Property schma information
 * - schema.type {String} - Data type of the property
 * - schema.inputLabel {String} Label for the form control
 * - schema.inputType {String} - type attribute of the `input` element.
 * - schema.pattern {String} - Regex pattern of the property
 * - schema.minLength {Number} - String property minimum length
 * - schema.maxLength {Number} - String property maximum length
 * - schema.defaultValue {any} - Default value of the property
 * - schema.examples {Array<Object>} - List of examples for the form property.
 * - schema.multipleOf {Number} - For numeric values, a `step` attribute of
 * the `input` element.
 * Each object may contain `name` (may be undefined) and must contain `value`
 * property of the example.
 * - schema.minimum {Number} - For numeric values, minimum value of the property
 * - schema.maximum {Number} - For numeric values, maximum value of the property
 * - schema.isEnum {Boolean} - Flag describing enumerable value
 * - schema.enum {Array<any>} - Only if `schema.isEnum` is set. Values for enum
 * input.
 * - schema.isArray {Boolean} - Flag describing array value for the property
 * - schema.items {Object} - Lsit of items definitions
 * - schema.isBool {Boolean} - Flag describing boolean value for the property
 * - schema.isFile {Boolean} - Flag describing File value for the property
 * - schema.isObject {Boolean} - Flag describing Object value for the property
 * - schema.isNillable {Boolean} - True when it is an union and one of union
 * items is nil.
 * - schema.inputPlaceholder {?String} - A placeholder value for the input.
 * - schema.inputFloatLabel {Boolean} - Only if placeholder is set. Instructs
 * input control to float a label.
 * - schema.isUnion {Boolean} - Flag describing union value
 * - schema.anyOf {Array<Object>} - List of possible types of the union.
 * - schema.enabled {Boolean} - Always `true`
 * - schema.fileTypes {Array<String>} List of file types defined for a file
 * type.
 * - schema.readOnly {Boolean} - Nil types gets `readOnly` property
 * ## Example
 *
 * ```html
 * <api-view-model-transformer on-view-model-changed="_updateView"></api-view-model-transformer>
 * <script>
 * const amfModel = getAmfFromRamlOrOas();
 * const processor = document.querySelector('api-view-model-transformer');
 * processor.amf = amfModel;
 * processor.shape = extractHeadersForMethod(amfModel);
 * processor.addEventListener('view-model-changed', (e) => {
 *  console.log(e.detail.value);
 * });
 * </script>
 * ```
 *
 * This example uses `getAmfFromRamlOrOas()` function where you implement
 * the logic of getting AMF json/ld data. It can be stored in file or parsed
 * using AMF parsers. The `extractHeadersForMethod()` represents a logic to
 * extract properties that you want to transform. It can be headers, query
 * parameters or body type.
 *
 * @customElement
 * @memberof ApiElements
 * @appliesMixin EventsTargetMixin
 * @appliesMixin AmfHelperMixin
 */
export class ApiViewModelTransformer extends AmfHelperMixin(EventsTargetMixin(LitElement)) {
  static get properties() {
    return {
      /**
       * An array of propertues for which view model is to be generated.
       * It accepts model for headers, query parameters, uri parameters and
       * body.
       * If `manualModel` is not set, assigning a value to this property will
       * trigger model computation. Otherwise call `computeViewModel()`
       * function manually to generate the model.
       */
      shape: { type: Array },
      /**
       * Generated view model from the `shape`
       *
       * @type {Array<Object>}
       */
      viewModel: { type: Array },
      /**
       * If set, assigning a value to `shape` will not trigger view model
       * computation.
       */
      manualModel: { type: Boolean },
      /**
       * The declarations model computed from the AMF object. It is used when the
       * transformer attempt to transform link value.
       *
       * If this property is not set then it dispatches `amf-resolve-link`
       * custom event.
       */
      _references: { type: Array },
      /**
       * Makes the model to always have `hasDescription` to false and
       * clears and documentation from ther model.
       */
      noDocs: { type: Boolean }
    };
  }

  get amf() {
    return this._amf;
  }

  set amf(value) {
    const old = this._amf;
    if (value === old) {
      return;
    }
    this._amf = value;
    this._references = this._computeReferences(value);
  }

  get shape() {
    return this._shape;
  }

  set shape(value) {
    const old = this._shape;
    if (value === old) {
      return;
    }
    this._shape = value;
    this._shapeChanged(value);
  }

  get viewModel() {
    return this._viewModel;
  }

  set viewModel(value) {
    const old = this._viewModel;
    if (value === old) {
      return;
    }
    this._viewModel = value;
    this.dispatchEvent(new CustomEvent('view-model-changed', {
      composed: true,
      detail: {
        value
      }
    }));
  }

  /**
   * @return {Element} Instance of `api-example-generator` element.
   */
  get _exampleGenerator() {
    if (!this.__exampleGenerator) {
      this.__exampleGenerator = document.createElement('api-example-generator');
    }
    return this.__exampleGenerator;
  }

  constructor() {
    super();
    this._buildPropertyHandler = this._buildPropertyHandler.bind(this);
  }

  _attachListeners(node) {
    node.addEventListener('api-property-model-build', this._buildPropertyHandler);
  }

  _detachListeners(node) {
    node.removeEventListener('api-property-model-build', this._buildPropertyHandler);
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    if (this.__exampleGenerator) {
      delete this.__exampleGenerator;
    }
  }
  /**
   * Clears cache for computed models.
   * All computed models are kept in in-memory cache to another call for computation
   * of the same model will result with reference to already computed value.
   * This function clears all cached objects.
   *
   * Note, the memory won't be freed for objects that are in use.
   */
  clearCache() {
    GLOBAL_PATH_PARAMS.splice(0, GLOBAL_PATH_PARAMS.length);
    GLOBAL_QUERY_PARAMS.splice(0, GLOBAL_QUERY_PARAMS.length);
    GLOBAL_OTHER_PARAMS.splice(0, GLOBAL_OTHER_PARAMS.length);
  }
  /**
   * Called when either `shape` or `manualModel` propeties changed.
   * If `manualModel` is falsy then it calls `computeViewModel()` function.
   *
   * Note, this function won't be called when sub property of the model
   * change. For peformance rerasons it won't be supported.
   *
   * Note, `computeViewModel` is called asynchronusly so `amf`
   * property can be set.
   *
   * @param {Array} shape Model for shape
   */
  _shapeChanged(shape) {
    if (this.manualModel) {
      return;
    }
    this.computeViewModel(shape);
  }
  /**
   * Computes view model from AMF data model. This should not be called if
   * `manualModel` is not set. Use `shape` property instead.
   *
   * @param {?Array|Object} shape AMF type model. If not set it uses `shape`
   * property of the element.
   * @return {Array<Object>} A promise resolved to generated model.
   */
  computeViewModel(shape) {
    this.viewModel = undefined;
    if (!shape) {
      shape = this.shape;
    }
    if (!shape) {
      return;
    }
    if (shape instanceof Array) {
      shape = Array.from(shape);
    }
    const result = this._computeViewModel(shape);
    this.viewModel = result;
    return result;
  }
  /**
   * Conputes model for each item recursively. It allows browser to return
   * the event loop and prohibit ANR to show.
   *
   * @param {Array} items List of remanding AMF model items.
   * This shuld be copy of the model since this function removes items from
   * the list.
   * @return {Array<Object>} Promise resolved to the view model.
   */
  _computeViewModel(items) {
    const result = [];
    if (!items) {
      return result;
    }
    const isArray = items instanceof Array;
    if (isArray && !items.length) {
      return result;
    }

    if (isArray) {
      for (let i = 0, len = items.length; i < len; i++) {
        const item = items[i];
        const model = this.uiModelForAmfItem(item);
        if (model) {
          result.push(model);
        }
      }
    } else {
      if (this._hasType(items, this.ns.raml.vocabularies.data + 'Object')) {
        const data = this.modelForRawObject(items);
        if (data) {
          result[result.length] = data;
        }
      }
    }
    return result;
  }
  /**
   * Creates a UI model item from AMF json/ld model.
   * @param {Object} amfItem AMF model with schema for
   * `http://raml.org/vocabularies/http#Parameter`
   * @return {Object} UI data model.
   */
  uiModelForAmfItem(amfItem) {
    if (this._hasType(amfItem, this.ns.raml.vocabularies.http + 'Parameter')) {
      return this._uiModelForParameter(amfItem);
    }
    if (this._hasType(amfItem, this.ns.w3.shacl.name + 'PropertyShape')) {
      return this._uiModelForPropertyShape(amfItem);
    }
  }
  /**
   * Creates a UI model item from AMF json/ld model for a parameter.
   * @param {Object} amfItem AMF model with schema for
   * `http://raml.org/vocabularies/http#Parameter`
   * @return {Object} UI data model.
   */
  _uiModelForParameter(amfItem) {
    amfItem = this._resolve(amfItem);
    const result = {};
    result.binding = this._computeBinding(amfItem);
    result.name = this._computeFormName(amfItem);
    result.required = this._computeRequired(amfItem);
    result.schema = {};
    const sKey = this._getAmfKey(this.ns.raml.vocabularies.http + 'schema');
    let schema = amfItem[sKey];
    if (schema) {
      if (schema instanceof Array) {
        schema = schema[0];
      }
      const def = this._resolve(schema);
      result.schema.type = this._computeModelType(def);
      result.schema.isEnum = this._hasProperty(def, this.ns.w3.shacl.in);
      // Now check if there's cached model for this property
      // So far now it took only required steps to compute cache key of the
      // property.
      const cachedModel = getGlobalValue(result);
      if (cachedModel) {
        // Safe to return it.
        return cachedModel;
      }
      result.schema.enabled = true;
      result.schema.inputLabel = this._computeInputLabel(def, result.required, result.name);
      result.schema.pattern = this._computeShaclProperty(def, 'pattern');
      result.schema.minLength = this._computeShaclProperty(def, 'minLength');
      result.schema.maxLength = this._computeShaclProperty(def, 'maxLength');
      result.schema.defaultValue = this._computeDefaultValue(def);
      result.schema.multipleOf = this._computeVocabularyShapeProperty(def, 'multipleOf');
      result.schema.minimum = this._computeShaclProperty(def, 'minInclusive');
      result.schema.maximum = this._computeShaclProperty(def, 'maxInclusive');
      result.schema.enum = result.schema.isEnum ? this._computeModelEnum(def) : undefined;
      result.schema.isArray = result.schema.type === 'array';
      result.schema.isBool = result.schema.type === 'boolean';
      result.schema.isObject = result.schema.type === 'object';
      result.schema.examples = this._computeModelExamples(def);
      result.schema.items = result.schema.isArray ? this._computeModelItems(def) : undefined;
      result.schema.inputType =
        this._computeModelInputType(result.schema.type, result.schema.items);
      result.schema.format = this._computeVocabularyShapeProperty(schema, 'format');
      result.schema.pattern = this._computeModelPattern(
        result.schema.type, result.schema.pattern, result.schema.format);
      result.schema.isNillable = result.schema.type === 'union' ? this._computeIsNillable(def) : false;
    }
    if (this.noDocs) {
      result.hasDescription = false;
    } else {
      result.description = this._computeDescription(amfItem);
      result.hasDescription = !!result.description;
    }

    const valueDelimiter = this._computeValueDelimiter(result.binding);
    const decodeValues = this._computeDecodeValues(result.binding);
    const processOptions = {
      name: result.name,
      required: result.required,
      valueDelimiter: valueDelimiter,
      decodeValues: decodeValues
    };
    this._processAfterItemCreated(result, processOptions);
    // store cache
    appendGlobalValue(result);
    return result;
  }
  /**
   * Creates a UI model item from AMF json/ld model for a parameter.
   * @param {Object} amfItem AMF model with schema for
   * `http://raml.org/vocabularies/http#Parameter`
   * @return {Object} UI data model.
   */
  _uiModelForPropertyShape(amfItem) {
    amfItem = this._resolve(amfItem);
    const result = {};
    result.binding = 'type';
    result.name = this._computeShaclProperty(amfItem, 'name');
    let def;
    if (this._hasType(amfItem, this.ns.raml.vocabularies.shapes + 'ScalarShape')) {
      def = amfItem;
    } else {
      const rangeKey = this._getAmfKey(this.ns.raml.vocabularies.shapes + 'range');
      def = amfItem[rangeKey];
      if (!def) {
        return result;
      }
      if (def instanceof Array) {
        def = def[0];
      }
      def = this._resolve(def);
    }
    result.required = this._computeRequiredPropertyShape(amfItem);
    result.schema = {};
    result.schema.enabled = true;
    result.schema.type = this._computeModelType(def);
    result.schema.isEnum = this._hasProperty(def, this.ns.w3.shacl.in);
    // Now check if there's cached model for this property
    // So far now it took only required steps to compute cache key of the
    // property.
    const cachedModel = getGlobalValue(result);
    if (cachedModel) {
      // Safe to return it.
      return cachedModel;
    }
    result.schema.inputLabel = this._computeInputLabel(def, result.required, result.name);
    result.schema.pattern = this._computeShaclProperty(def, 'pattern');
    result.schema.minLength = this._computeShaclProperty(def, 'minLength');
    result.schema.maxLength = this._computeShaclProperty(def, 'maxLength');
    result.schema.defaultValue = this._computeDefaultValue(def);
    result.schema.multipleOf = this._computeVocabularyShapeProperty(def, 'multipleOf');
    result.schema.minimum = this._computeShaclProperty(def, 'minInclusive');
    result.schema.maximum = this._computeShaclProperty(def, 'maxInclusive');
    result.schema.enum = this._computeModelEnum(def);
    result.schema.isEnum = !!result.schema.enum;
    result.schema.isArray = result.schema.type === 'array';
    result.schema.isObject = result.schema.type === 'object';
    result.schema.isBool = result.schema.type === 'boolean';
    result.schema.examples = this._computeModelExamples(def);
    result.schema.hasExamples = !!(result.schema.examples && result.schema.examples.length);
    result.schema.inputType = this._computeModelInputType(result.schema.type, result.schema.items);
    result.schema.format = this._computeVocabularyShapeProperty(def, 'format');
    result.schema.pattern = this._computeModelPattern(
      result.schema.type, result.schema.pattern, result.schema.format);
    result.hasExtendedDescs = this._computeHasExtendedDocumentation(result);
    result.schema.isNillable = result.schema.type === 'union' ? this._computeIsNillable(result) : false;

    if (this.noDocs) {
      result.hasDescription = false;
    } else {
      result.description = this._computeDescription(def);
      result.hasDescription = !!result.description;
    }
    if (result.hasDescription) {
      result.extendedDocs = this._computeExtendedDocumentation(result);
    }
    if (result.schema.type === 'file') {
      result.schema.isFile = true;
      result.schema.fileTypes = this._getValueArray(def,
        this.ns.raml.vocabularies.shapes + 'fileType');
    } else {
      result.schema.isFile = false;
    }
    if (result.schema.isObject) {
      const props = [];
      const pKey = this._getAmfKey(this.ns.w3.shacl.name + 'property');
      let items = this._ensureArray(def[pKey]);
      if (items) {
        items.forEach((item) => {
          if (item instanceof Array) {
            item = item[0];
          }
          props.push(this.uiModelForAmfItem(item));
        });
      }
      result.properties = props;
    }
    this._processAfterItemCreated(result, {});
    // Store cache
    appendGlobalValue(result);
    return result;
  }
  /**
   * Creates a view model for an object definition. Object definition can be
   * part of trait or annotation properties description.
   *
   * @param {Object} model Model to extract data from.
   * @param {Object} processOptions
   * @return {Array} View model for items.
   */
  modelForRawObject(model, processOptions) {
    if (!processOptions) {
      processOptions = {};
    }
    const result = [];
    const keys = Object.keys(model);
    const dataKey = this._getAmfKey(this.ns.raml.vocabularies.data);
    keys.forEach((key) => {
      if (key.indexOf(dataKey) === -1) {
        return;
      }
      let item = model[key];
      if (item instanceof Array) {
        item = item[0];
      }
      item = this._uiModelForRawObject(key, item);
      if (item) {
        item = this._processAfterItemCreated(item, processOptions);
        result.push(item);
      }
    });
    return result;
  }
  /**
   * Creates a view model from "raw" item (model before resolving).
   *
   * @param {String} key Key of the item in the model.
   * @param {String} model Item model
   * @return {Object} View model
   */
  _uiModelForRawObject(key, model) {
    let index = key.indexOf('#');
    if (index === -1) {
      index = key.indexOf(':');
    }
    let name;
    if (index === -1) {
      name = key;
    } else {
      name = key.substr(index + 1);
    }
    const result = {};
    result.binding = 'type';
    result.name = name;
    const dPrefix = this.ns.raml.vocabularies.data;
    const typeKey = this._getAmfKey(dPrefix + 'type');
    let type = this._computeRawModelValue(model[typeKey]);
    if (!type) {
      type = 'string';
    }
    const bracetIndex = type.indexOf('[]');
    let items;
    if (bracetIndex !== -1) {
      items = type.substr(0, bracetIndex);
      type = 'array';
    }

    if (this.noDocs) {
      result.hasDescription = false;
    } else {
      const descKey = this._getAmfKey(dPrefix + 'description');
      result.description = this._computeRawModelValue(model[descKey]);
      result.hasDescription = !!result.description;
    }

    result.required = this._computeRawModelValue(model[this._getAmfKey(dPrefix + 'required')]);
    result.schema = {};
    result.schema.enabled = true;
    result.schema.type = type || 'string';
    const displayName = this._computeRawModelValue(model[this._getAmfKey(dPrefix + 'displayName')]);
    result.schema.inputLabel = this._completeInputLabel(displayName, name, result.required);
    result.schema.minLength = this._computeRawModelValue(model[this._getAmfKey(dPrefix + 'minLength')]);
    result.schema.maxLength = this._computeRawModelValue(model[this._getAmfKey(dPrefix + 'maxLength')]);
    result.schema.defaultValue = this._computeRawModelValue(model[this._getAmfKey(dPrefix + 'default')]);
    result.schema.multipleOf = this._computeRawModelValue(model[this._getAmfKey(dPrefix + 'multipleOf')]);
    result.schema.minimum = this._computeRawModelValue(model[this._getAmfKey(dPrefix + 'minimum')]);
    result.schema.maximum = this._computeRawModelValue(model[this._getAmfKey(dPrefix + 'maximum')]);
    result.schema.enum = this._computeRawModelValue(model[this._getAmfKey(dPrefix + 'enum')]);
    let pattern = this._computeRawModelValue(model[this._getAmfKey(dPrefix + 'pattern')]);
    if (pattern instanceof Array) {
      pattern = '[' + pattern[0] + ']';
    }
    result.schema.pattern = pattern;
    result.schema.isEnum = !!result.schema.enum;
    result.schema.isArray = result.schema.type === 'array';
    result.schema.isBool = result.schema.type === 'boolean';
    // result.schema.examples = this._computeModelExamples(def);
    if (result.schema.isArray) {
      result.schema.items = items ? items : this._computeRawModelValue(model[this._getAmfKey(dPrefix + 'items')]);
    }
    result.schema.inputType = this._computeModelInputType(result.schema.type, result.schema.items);
    result.schema.format = this._computeRawModelValue(model[this._getAmfKey(dPrefix + 'format')]);
    result.schema.pattern = this._computeModelPattern(result.schema.type, result.schema.pattern, result.schema.format);
    const example = this._computeRawModelValue(model[this._getAmfKey(dPrefix + 'example')]);
    if (example) {
      result.schema.examples = [example];
    }
    const examples = this._computeRawExamples(model[this._getAmfKey(dPrefix + 'examples')]);
    if (examples) {
      const existing = result.schema.examples || [];
      result.schema.examples = existing.concat(examples);
    }
    return result;
  }
  /**
   * Sets up additional properties like `value` or placeholder from
   * values read from the AMF model.
   *
   * @param {Object} item Computed UI model.
   * @param {Object} processOptions Model creation options
   * @return {Object}
   */
  _processAfterItemCreated(item, processOptions) {
    if (item.schema.type === 'null') {
      switch (item.binding) {
        case 'header':
        case 'query':
        case 'path':
          item.value = 'nil';
          break;
        default:
          item.value = 'null';
      }
      item.schema.readOnly = true;
    }
    if (item.schema.examples && item.schema.examples.length && item.schema.examples[0].value) {
      item.schema.inputPlaceholder = 'Example: ' +
        this._exampleAsValue(item.schema.examples[0].value, processOptions);
    }
    if (!item.schema.inputPlaceholder) {
      item.schema.inputPlaceholder = this._computeTypePlaceholder(item.schema.type, item.schema.format);
    }
    if (item.schema.inputPlaceholder) {
      item.schema.inputFloatLabel = true;
    }
    if (item.required && typeof item.schema.defaultValue !== 'undefined') {
      item.value = item.schema.isArray ?
        this.__parseArrayExample(item.schema.defaultValue, processOptions) :
        this._exampleAsValue(item.schema.defaultValue, processOptions);
    }
    if (typeof item.value === 'undefined' && item.required) {
      const examples = item.schema.examples;
      if (examples && examples.length) {
        item.value = this._exampleAsValue(examples[0].value, processOptions);
      }
      if ((typeof item.value === 'undefined' || item.value === '') && item.schema.isEnum) {
        item.value = this._exampleAsValue(item.schema.enum[0], processOptions);
      }
    }

    if (item.schema.isEnum && item.schema.examples && item.schema.examples.length === 1 &&
      !item.schema.examples[0].value) {
      delete item.schema.examples;
    }

    if (item.value && item.schema.isArray && typeof item.value === 'string') {
      const _v = this.__parseArrayExample(item.value, processOptions);
      item.value = _v instanceof Array ? _v : [_v];
    }

    if (item.schema.isArray && !item.value) {
      item.value = [''];
    }

    if (item.schema.isBool && typeof item.value === 'boolean') {
      item.value = String(item.value);
    }
    return item;
  }
  /**
   * Completes computation of input label.
   *
   * @param {?String} displayName Value of the `displayName` property
   * @param {String} name Property name
   * @param {Boolean} required Is item required
   * @return {String} Common input label construction.
   */
  _completeInputLabel(displayName, name, required) {
    if (!displayName) {
      displayName = name || 'Input value';
    }
    if (required) {
      displayName += '*';
    }
    return displayName;
  }
  /**
   * Computes list of examples from the Raw data model.
   * @param {Object} model
   * @return {Array|undefined}
   */
  _computeRawExamples(model) {
    if (!model || !model[0]) {
      return;
    }
    const result = [];
    model = model[0];
    const keys = Object.keys(model);
    keys.forEach((key) => {
      const dKey = this._getAmfKey(this.ns.raml.vocabularies.data);
      if (key.indexOf(dKey) === -1) {
        return;
      }
      const name = key.split('#')[1];
      const value = this._computeRawModelValue(model[key]);
      if (value) {
        result.push({
          name: name,
          value: value,
          hasTitle: !!name
        });
      }
    });
    return result;
  }
  /**
   * Computes value of the `binding` property of the UI model.
   * @param {Object} model AMF item model
   * @return {String|undefined} Binding property or undefined if not found.
   */
  _computeBinding(model) {
    const key = this.ns.raml.vocabularies.http + 'binding';
    return this._getValue(model, key);
  }
  /**
   * Computes fomm (parameter) name from AMF model.
   * @param {Object} model AMF item model
   * @return {String|undefined} Name property or undefined if not found.
   */
  _computeFormName(model) {
    const key = this.ns.schema.schemaName;
    return this._getValue(model, key);
  }
  /**
   * Computes `required` property from AMF model.
   * @param {Object} model AMF item model
   * @return {Boolean} True if the property is required.
   */
  _computeRequired(model) {
    const key = this.ns.w3.hydra.core + 'required';
    return this._getValue(model, key);
  }
  /**
   * Computes `minCount` property from AMF model for PropertyShape object.
   *
   * @param {Object} model AMF item model
   * @return {Boolean} True if `minCount` equals `1`
   */
  _computeRequiredPropertyShape(model) {
    const key = this.ns.w3.shacl.name + 'minCount';
    const result = this._getValue(model, key);
    return result === 1;
  }
  /**
   * Computes type of the model. It's RAML data type property.
   * @param {Object} shape Property schema.
   * @return {String} Type of the nproperty.
   */
  _computeModelType(shape) {
    if (!shape) {
      return;
    }
    const vsh = this.ns.raml.vocabularies.shapes;
    const sa = this.ns.w3.shacl.name;
    if (this._hasType(shape, vsh + 'UnionShape')) {
      return 'union';
    }
    if (this._hasType(shape, vsh + 'ArrayShape')) {
      return 'array';
    }
    if (this._hasType(shape, sa + 'NodeShape')) {
      return 'object';
    }
    if (this._hasType(shape, sa + 'PropertyShape')) {
      return 'object';
    }
    if (this._hasType(shape, vsh + 'FileShape')) {
      return 'file';
    }
    if (this._hasType(shape, vsh + 'NilShape')) {
      return 'null';
    }
    if (this._hasType(shape, vsh + 'AnyShape')) {
      return 'string';
    }
    if (this._hasType(shape, vsh + 'MatrixShape')) {
      return 'array';
    }
    if (this._hasType(shape, vsh + 'TupleShape')) {
      return 'object';
    }
    if (this._hasType(shape, vsh + 'ScalarShape')) {
      let dt = shape[this._getAmfKey(sa + 'datatype')];
      if (dt instanceof Array) {
        dt = dt[0];
      }
      let id = dt;
      if (typeof id !== 'string') {
        id = id['@id'];
      }
      const x = this.ns.w3.xmlSchema;
      switch (id) {
        case x + 'string':
        case this._getAmfKey(x + 'string'):
          return 'string';
        case x + 'integer':
        case this._getAmfKey(x + 'integer'):
          return 'integer';
        case x + 'long':
        case this._getAmfKey(x + 'long'):
          return 'long';
        case x + 'float':
        case this._getAmfKey(x + 'float'):
          return 'float';
        case x + 'double':
        case this._getAmfKey(x + 'double'):
          return 'double';
        case vsh + 'number':
        case this._getAmfKey(vsh + 'number'):
          return 'number';
        case x + 'boolean':
        case this._getAmfKey(x + 'boolean'):
          return 'boolean';
        case x + 'dateTime':
        case this._getAmfKey(x + 'dateTime'):
          return 'datetime';
        case vsh + 'dateTimeOnly':
        case this._getAmfKey(vsh + 'dateTimeOnly'):
          return 'datetime-only';
        case x + 'time':
        case this._getAmfKey(x + 'time'):
          return 'time';
        case x + 'date':
        case this._getAmfKey(x + 'date'):
          return 'date';
        case x + 'base64Binary':
        case this._getAmfKey(x + 'base64Binary'):
          return 'string';
        case vsh + 'password':
        case this._getAmfKey(vsh + 'password'):
          return 'password';
      }
    }
    return 'string';
  }
  /**
   * Computes type of the raw model.
   *
   * @param {Array} model Property schema.
   * @return {String|undefined} Type of the nproperty.
   */
  _computeRawModelValue(model) {
    if (!model) {
      return;
    }
    if (model instanceof Array) {
      model = model[0];
    }
    let dataType = model['@type'];
    if (dataType instanceof Array) {
      dataType = dataType[0];
    }
    switch (dataType) {
      case this._getAmfKey(this.ns.raml.vocabularies.data + 'Scalar'):
        return this._computeRawScalarValue(model);
      case this._getAmfKey(this.ns.raml.vocabularies.data + 'Array'):
        return this._computeRawArrayValue(model);
      case this._getAmfKey(this.ns.raml.vocabularies.shapes + 'FileShape'):
        return this._getValueArray(model, this.ns.raml.vocabularies.shapes + 'fileType');
    }
  }
  /**
   * Computes scalar value that has proper type.
   * @param {Object} item Shape to test for a value.
   * @return {String|Number|Boolean}
   */
  _computeRawScalarValue(item) {
    const valueKey = this._getAmfKey(this.ns.raml.vocabularies.data + 'value');
    let value = item[valueKey];
    if (!value) {
      return;
    }
    if (value instanceof Array) {
      value = value[0];
    }
    let type = value['@type'];
    if (type instanceof Array) {
      type = type[0];
    }
    value = value['@value'];
    const s = this.ns.w3.xmlSchema;
    switch (type) {
      case this._getAmfKey(s + 'number'):
      case this._getAmfKey(s + 'long'):
      case this._getAmfKey(s + 'integer'):
      case this._getAmfKey(s + 'float'):
      case this._getAmfKey(s + 'double'):
        return Number(value);
      case this._getAmfKey(s + 'boolean'):
        return value === 'false' ? false : true;
      default:
        return value;
    }
  }

  _computeRawArrayValue(item) {
    const key = this._getAmfKey('http://www.w3.org/1999/02/22-rdf-syntax-ns#member');
    let values = this._ensureArray(item[key]);
    if (!values) {
      return;
    }
    const result = [];
    values.forEach((value) => {
      const item = this._computeRawScalarValue(value);
      if (item) {
        result.push(item);
      }
    });
    return result;
  }
  /**
   * Computes form input label value.
   *
   * @param {Object} def Property definition
   * @param {Boolean} required True if the property is required
   * @param {?String} name Property name
   * @return {String} Input display name.
   */
  _computeInputLabel(def, required, name) {
    const result = this._getValue(def, this.ns.schema.schemaName);
    return this._completeInputLabel(result, name, required);
  }
  /**
   * Computes the value of a property that namespace starts with
   * `http://www.w3.org/ns/shacl`.
   *
   * @param {Object} shape Property AMF definition
   * @param {String} property Name of the schema.
   * @return {any|undefined} Value of the property or undefined if not set.
   */
  _computeShaclProperty(shape, property) {
    const key = this.ns.w3.shacl.name + String(property);
    return this._getValue(shape, key);
  }
  /**
   * Computes the value of a property that namespace starts with
   * `http://raml.org/vocabularies/shapes`.
   *
   * @param {Object} shape Property AMF definition
   * @param {String} property Name of the schema.
   * @return {any|undefined} Value of the property or undefined if not set.
   */
  _computeVocabularyShapeProperty(shape, property) {
    const key = this.ns.raml.vocabularies.shapes + String(property);
    return this._getValue(shape, key);
  }
  /**
   * Computes default value for a shape.
   * @param {Object} shape Amf shape
   * @return {any|undefined} Default value for the model or undefined.
   */
  _computeDefaultValue(shape) {
    const vsh = this.ns.raml.vocabularies.shapes;
    const valueKey = this._getAmfKey(this.ns.w3.shacl.name + 'defaultValueStr');
    let value = shape[valueKey];
    if (!value) {
      return;
    }
    if (value instanceof Array) {
      value = value[0];
    }
    if (value['@value']) {
      value = value['@value'];
    }
    if (this._hasType(shape, vsh + 'ScalarShape')) {
      const dtKey = this._getAmfKey(this.ns.w3.shacl.name + 'datatype');
      let type = shape[dtKey];
      if (type instanceof Array) {
        type = type[0];
      }
      type = type['@id'];
      const s = this.ns.w3.xmlSchema;
      switch (type) {
        case s + 'number':
        case s + 'long':
        case s + 'integer':
        case s + 'float':
        case s + 'double':
        case this._getAmfKey(s + 'number'):
        case this._getAmfKey(s + 'long'):
        case this._getAmfKey(s + 'integer'):
        case this._getAmfKey(s + 'float'):
        case this._getAmfKey(s + 'double'):
          return Number(value);
        case s + 'boolean':
        case this._getAmfKey(s + 'boolean'):
          return value === 'false' ? false : true;
        default:
          return value;
      }
    } else if (this._hasType(shape, this.ns.raml.vocabularies.shapes + 'ArrayShape')) {
      const valueKey = this._getAmfKey(this.ns.w3.shacl.name + 'defaultValue');
      let value2 = shape[valueKey];
      if (!value2) {
        return value;
      }
      if (value2 instanceof Array) {
        value2 = value2[0];
      }
      return this._computeRawArrayValue(value2);
    }
    return value;
  }
  /**
   * Computes enum values for the view model.
   * @param {Object} def Model definition.
   * @return {Array} List of values.
   */
  _computeModelEnum(def) {
    def = this._resolve(def);
    const key = this._getAmfKey(this.ns.w3.shacl.in);
    let model = def[key];
    if (!model) {
      return;
    }
    if (model instanceof Array) {
      model = model[0];
    }
    const result = [];
    const rdfKey = this._getAmfKey('http://www.w3.org/2000/01/rdf-schema#');
    Object.keys(model).forEach((key) => {
      if (key.indexOf(rdfKey) === -1) {
        return;
      }
      let shape = model[key];
      if (shape instanceof Array) {
        shape = shape[0];
      }
      const vKey = this._getAmfKey(this.ns.raml.vocabularies.data + 'value');
      const value = this._getValue(shape, vKey);
      if (value) {
        result.push(value);
      }
    });
    return result;
  }

  /**
   * Computes list of examples for the Property model.
   *
   * @param {Object} model AMF property model
   * @return {Array<Object>|undefined} List of examples or `undefined` if not
   * defined.
   */
  _computeModelExamples(model) {
    const gen = this._exampleGenerator;
    gen.amf = this.amf;
    return gen.computeExamples(model, 'application/json', {});
  }
  /**
   * Computes `items` property for AMF array property
   *
   * @param {Object} model AMF property model
   * @return {Object} Array definition model
   */
  _computeModelItems(model) {
    if (!this._hasType(model, this.ns.raml.vocabularies.shapes + 'ArrayShape')) {
      return;
    }
    model = this._resolve(model);
    const itKeys = this._getAmfKey(this.ns.raml.vocabularies.shapes + 'items');
    let item = model[itKeys];
    if (!item) {
      return;
    }
    if (item instanceof Array) {
      item = item[0];
    }
    const type = this._computeModelType(item);
    // _computeModelType() always returns a value
    // TODO: add support for objects and unions.
    return type;
  }

  _computeValueDelimiter(binding) {
    switch (binding) {
      case 'header': return ':';
      case 'query': return '=';
      default: return '';
    }
  }

  _computeDecodeValues(binding) {
    switch (binding) {
      case 'query': return true;
      default: return false;
    }
  }
  /**
   * Parses a string from example or enum value to be used as default value.
   * @param {String} example Example value to process as a value
   * @param {Object} opts Options:
   * - name {String} Processed property name
   * - valueDelimiter {?String} either `:` for headers or `=` for query params
   * - decodeValues {Boolean} True to url decode value.
   * @return {[type]} [description]
   */
  _exampleAsValue(example, opts) {
    if (!example || typeof example !== 'string') {
      return example;
    }
    example = example.trim();
    if (opts.valueDelimiter && example.indexOf(opts.name + opts.valueDelimiter) === 0) {
      example = example.substr(opts.name.length + 1).trim();
    }
    if (opts.decodeValues) {
      try {
        example = decodeURIComponent(example.replace(/\+/g, ' '));
      } catch (e) {
        noop();
      }
    }
    return example;
  }
  /**
   * Parses example in an array type.
   *
   * @param {String} example An array example
   * @param {Object} processOptions Options:
   * - name {String} Processed property name
   * - valueDelimiter {?String} either `:` for headers or `=` for query params
   * - decodeValues {Boolean} True to url decode value.
   * @return {Array} Array of examples or string if cannot parse
   */
  __parseArrayExample(example, processOptions) {
    try {
      const arr = JSON.parse(example);
      if (arr instanceof Array) {
        const result = [];
        arr.forEach((item) => {
          const ex = this._exampleAsValue(item, processOptions);
          if (ex) {
            result[result.length] = ex;
          }
        });
        return result.length ? result : undefined;
      }
    } catch (e) {
      noop();
    }
    return this._exampleAsValue(example, processOptions);
  }

  /**
   * Computes rendered item input field type based on RAML definition.
   *
   * It will be either numeric or text. Type will be determined from
   * item's type or, in case of array, item's items property.
   *
   * @param {String} type Property data type.
   * @param {?Array} items Array items if any
   * @return {String} Input field type.
   */
  _computeModelInputType(type, items) {
    if (type === 'array') {
      if (typeof items === 'string') {
        return this.__computeInputType(items);
      }
      if (!items) {
        return 'text';
      }
      return this.__computeInputType(items.schema ? items.schema.type : items.type);
    }
    return this.__computeInputType(type);
  }

  __computeInputType(type) {
    if (type && NUMBER_INPUT_TYPES.indexOf(type) !== -1) {
      return 'number';
    } else if (type === 'boolean') {
      return 'boolean';
    } else if (type === 'date-only' || type === 'date') {
      return 'date';
    } /* else if (type === 'time-only' || type === 'time') {
      return 'time';
    } */
    return 'text';
  }
  /**
   * Computes pattern for the input.
   *
   * @param {String} modelType Type of the property item.
   * @param {String} pattern Pattern declared on the property
   * @param {?String} format For `datetime` type additional format value.
   * `rfc3339` is assumed by default
   * @return {String|undefined} Pattern or undefined if does not exists.
   */
  _computeModelPattern(modelType, pattern, format) {
    if (!pattern) {
      switch (modelType) {
        case 'time':
          pattern = '^[0-9]{2}:[0-9]{2}:[0-9]{2}\.?[0-9]{0,3}$';
          break;
        case 'date':
          pattern = '^[0-9]{4}-[0-9]{2}-[0-9]{2}$';
          break;
        case 'datetime-only':
          pattern = '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.?[0-9]{0,3}$';
          break;
        case 'datetime':
          if (format === 'rfc2616') {
            pattern = '';
          } else {
            pattern = '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.*$';
          }
          break;
      }
    }
    return pattern;
  }
  /**
   * Computes a placeholder value for data and time inputs.
   *
   * @param {String} type Model type.
   * @param {?String} format For `datetime` type additional format value.
   * `rfc3339` is assumed by default
   * @return {String|undefined} Placeholder value.
   */
  _computeTypePlaceholder(type, format) {
    let value;
    switch (type) {
      case 'time':
        value = '00:00:00.000';
        break;
      case 'date':
        value = '0000-00-00';
        break;
      case 'datetime-only':
        value = '0000-00-00T00:00:00.000';
        break;
      case 'datetime':
        if (format === 'rfc2616') {
          value = 'Sun, 01 Jan 2000 00:00:00 GMT';
        } else {
          value = '0000-00-00T00:00:00Z+01:00';
        }
        break;
    }
    return value;
  }
  /**
   * Handler for the `api-property-model-build` custom event.
   * Builds a property view model using event detail object as a base object.
   *
   * All changes are applied to the `detail` object. Requesting element must
   * use the same object.
   *
   * @param {CustomEvent} e
   */
  _buildPropertyHandler(e) {
    if (e.defaultPrevented) {
      return;
    }
    e.stopImmediatePropagation();
    e.preventDefault();
    this.buildProperty(e.detail);
  }
  /**
   * Builds empty view model without traversing AMF model.
   *
   * @param {?Object} defaults View model with default values. This values won't
   * be set.
   * @return {Object} Generated basic view model.
   */
  buildProperty(defaults) {
    if (!defaults) {
      defaults = {};
    }
    // defaults.name = defaults.name || 'property';
    defaults.schema = defaults.schema || {};
    defaults.schema.type = defaults.schema.type || 'string';
    defaults.schema.isEnum = defaults.schema.isEnum || false;
    defaults.schema.isArray = defaults.schema.isArray || false;
    defaults.schema.isBool = defaults.schema.isBool || false;
    defaults.schema.isFile = defaults.schema.type === 'file';
    defaults.schema.inputType = defaults.schema.inputType === 'text';
    defaults.hasDescription = !!defaults.description;
    defaults.schema.inputFloatLabel = (defaults.schema.inputFloatLabel ||
      defaults.schema.inputPlaceholder) || false;
    defaults.schema.inputType = this._computeModelInputType(defaults.schema.type,
      defaults.schema.items);
    defaults.schema.pattern = this._computeModelPattern(defaults.schema.type,
      defaults.schema.pattern);
    if (!defaults.schema.inputLabel) {
      defaults.schema.inputLabel = defaults.name || 'Parameter value';
    }
    this._processAfterItemCreated(defaults, {});
    return defaults;
  }

  /**
   * Computes if model item has documentation to display.
   * This would be extended documentation by adding additional description
   * properties that helps the user to input values into the editor.
   *
   * @param {Object} item Model item
   * @return {Boolean} True if documentation can be rendered.
   */
  _computeHasExtendedDocumentation(item) {
    if (item.hasDescription) {
      return true;
    }
    if (!item.schema) {
      return false;
    }
    const schema = item.schema;
    if (schema.pattern) {
      return true;
    }
    if (schema.examples && schema.examples.length) {
      return true;
    }
    return false;
  }
  /**
   * Computes documentation as a markdown to be placed in the `marked-element`
   * @param {Object} item View model
   * @return {String} Generated documentation
   */
  _computeExtendedDocumentation(item) {
    let docs = '';
    if (item.description) {
      docs += item.description;
    }
    if (!item.schema) {
      return docs;
    }
    const schema = item.schema;
    if (docs) {
      docs += '\n\n\n';
    }
    if (schema.pattern) {
      docs += '- Pattern: `' + schema.pattern + '`\n';
    }
    if (schema.examples && schema.examples.length) {
      schema.examples.forEach((item) => {
        docs += '- Example';
        if (item.hasTitle) {
          docs += ' ' + item.name;
        }
        docs += ': `' + item.value + '`\n';
      });
    }
    return docs;
  }
  /**
   * Returns `true` only when passed shape has `shapes#anyOf` array and
   * one of the union properties is of a type od NilShape.
   * @param {Object} shape Schape test for nillable union.
   * @return {Boolean}
   */
  _computeIsNillable(shape) {
    if (!shape) {
      return false;
    }
    const key = this._getAmfKey(this.ns.raml.vocabularies.shapes + 'anyOf');
    const values = this._ensureArray(shape[key]);
    if (!values) {
      return false;
    }
    for (let i = 0, len = values.length; i < len; i++) {
      if (this._hasType(values[i], this.ns.raml.vocabularies.shapes + 'NilShape')) {
        return true;
      }
    }
    return false;
  }
}
window.customElements.define('api-view-model-transformer', ApiViewModelTransformer);
