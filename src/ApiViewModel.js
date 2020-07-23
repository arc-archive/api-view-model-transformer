import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import { ExampleGenerator } from '@api-components/api-example-generator';

/** @typedef {import('@api-components/api-example-generator/src/ExampleGenerator').Example} Example */

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
 * @typedef {Object} ModelItemSchema
 * @property {String=} type Data type of the property
 * @property {String=} inputLabel Label for the form control
 * @property {String=} inputType Type attribute of the `input` element.
 * @property {String=} pattern Regex pattern of the property
 * @property {Number=} minLength String property minimum length
 * @property {Number=} maxLength String property maximum length
 * @property {String|Number|Boolean|Array=} defaultValue Default value of the property
 * @property {Array<Example>=} examples List of examples for the form property.
 * @property {Number=} multipleOf For numeric values, a `step` attribute of
 * the `input` element. Each object may contain `name` (may be undefined) and must contain `value`
 * property of the example.
 * @property {Number=} minimum For numeric values, minimum value of the property
 * @property {Number=} maximum For numeric values, maximum value of the property
 * @property {Array<any>=} enum Only if `schema.isEnum` is set. Values for enum input
 * @property {Boolean=} isEnum Flag describing enumerable value
 * @property {Boolean=} isArray Flag describing array value for the property
 * @property {string|Array=} items Name iof the items type
 * @property {Boolean=} isBool Flag describing boolean value for the property
 * @property {Boolean=} isFile Flag describing File value for the property
 * @property {Boolean=} isObject Flag describing Object value for the property
 * @property {Boolean=} isNillable True when it is an union and one of union
 * items is nil.
 * @property {Boolean=} isCustom Flag describing whether the item is a custom control.
 * This is not generated from the AMF model but rather when a custom model is being created manually.
 * @property {String=} inputPlaceholder A placeholder value for the input.
 * @property {Boolean=} inputFloatLabel Only if placeholder is set. Instructs
 * input control to float a label.
 * @property {Boolean=} isUnion Flag describing whether the type is an union
 * @property {Array<Object>=} anyOf List of possible types of the union.
 * @property {Boolean=} enabled Always `true`
 * @property {Array<String>=} fileTypes List of file types defined for a file
 * type.
 * @property {Boolean=} readOnly Nil types gets `readOnly` property
 * @property {String=} format Format of a number type
 */

/**
 * @typedef {Object} ModelItem
 * @property {String} binding One of `path`, `query`, `header`, `cookie`
 * @property {String} name Property (form) name
 * @property {Boolean} required is property required
 * @property {String|Number|Boolean|Array=} value Value of the form control
 * @property {String=} description The description of the property
 * @property {Boolean} hasDescription Flag describing if the property has a
 * description.
 * @property {Boolean} hasExtendedDescription True when extendedDescription is set.
 * @property {String=} extendedDescription Extended documentation that includes description,
 * patterns and examples.
 * @property {Array<Object>=} properties If the model is a type of object it is a list
 * of this model objects.
 * @property {ModelItemSchema=} schema
 */

/**
 * @typedef {Object} ConstructorOptions
 * @property {Object|Array<Object>=} amf AMF model.
 * @property {Boolean=} noDocs When set the docs are not computed with the model.
 */

 /**
  * @typedef {Object} ProcessOptions
  * @property {string=} name Processed property name
  * @property {string=} valueDelimiter `:` for headers and `=` for query params
  * @property {boolean=} decodeValues True to url decode value.
  * @property {boolean=} required Whether the proeprty is required.
  *
  */

/**
 * An element to transform AMF LD model into a form view model.
 *
 * Note, this element does not include polyfills for `Promise` and `Array.from`.
 *
 * The model should be used to build a form view for request parameters
 * like header, query parameters, uri parameters or the body.
 *
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
 * @mixes AmfHelperMixin
 */
export class ApiViewModel extends AmfHelperMixin(Object) {
  /**
   * @param {ConstructorOptions=} [opts={}]
   */
  constructor(opts={}) {
    super();
    this.amf = opts.amf;
    /**
     * Makes the model to always have `hasDescription` set to false and
     * clears and documentation from the model.
     */
    this.noDocs = opts.noDocs;
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
   * Computes view model from AMF data model. This should not be called if
   * `manualModel` is not set. Use `shape` property instead.
   *
   * @param {Array<Object>|Object} shape AMF type model. If not set it uses `shape`
   * property of the element.
   * @return {Array<ModelItem>|undefined} A promise resolved to generated model.
   */
  computeViewModel(shape) {
    this.viewModel = undefined;
    if (!shape) {
      return;
    }
    if (Array.isArray(shape)) {
      // creates a shalow copy so it's not altered later.
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
   * @param {Array<Object>|Object} items List of remanding AMF model items.
   * This shuld be copy of the model since this function removes items from
   * the list.
   * @return {Array<ModelItem>} The view model.
   */
  _computeViewModel(items) {
    let result = [];
    if (!items) {
      return result;
    }
    const isArray = Array.isArray(items);
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
      if (this._hasType(items, this.ns.raml.vocabularies.data.Object)) {
        const data = this.modelForRawObject(items);
        if (data) {
          result = data;
        }
      } else if (this._hasType(items, this.ns.w3.shacl.NodeShape)) {
        result = this._processNodeShape(items);
      } else if (this._hasType(items, this.ns.aml.vocabularies.shapes.ScalarShape)) {
        const data = this._uiModelForPropertyShape(items);
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
   * @return {ModelItem|undefined} UI data model.
   */
  uiModelForAmfItem(amfItem) {
    if (this._hasType(amfItem, this.ns.aml.vocabularies.apiContract.Parameter)) {
      return this._uiModelForParameter(amfItem);
    }
    if (this._hasType(amfItem, this.ns.w3.shacl.PropertyShape)) {
      return this._uiModelForPropertyShape(amfItem);
    }
  }

  /**
   * Creates a model for a shacl's PropertyShape. It can be found, for example,
   * in `queryString` of security scheme settings.
   *
   * @param {Object} shape The shape to process
   * @return {Array<ModelItem>} Generated view model for an item.
   */
  _processNodeShape(shape) {
    this._resolve(shape);
    const key = this._getAmfKey(this.ns.w3.shacl.property);
    const items = this._ensureArray(shape[key]);
    const result = [];
    if (!items) {
      return result;
    }
    for (let i = 0, len = items.length; i < len; i++) {
      const item = items[i];
      const model = this.uiModelForAmfItem(item);
      if (model) {
        result[result.length] = model;
      }
    }
    return result;
  }

  /**
   * Creates a UI model item from AMF json/ld model for a parameter.
   * @param {Object} amfItem AMF model with schema for
   * `http://raml.org/vocabularies/http#Parameter`
   * @return {ModelItem} UI data model.
   */
  _uiModelForParameter(amfItem) {
    amfItem = this._resolve(amfItem);
    const binding = this._computeBinding(amfItem);
    const name = this._computeFormName(amfItem);
    const required = this._computeRequired(amfItem);

    const schemaItem = {};

    const result = {
      binding,
      required,
      hasDescription: false,
      hasExtendedDescription: false,
      name,
      schema: schemaItem,
    };

    schemaItem.isFile = false; // I am not sure why is this not computed here
    schemaItem.isUnion = false; // or this.
    schemaItem.readOnly = false;

    const sKey = this._getAmfKey(this.ns.aml.vocabularies.shapes.schema);
    let schema = amfItem[sKey];
    if (schema) {
      if (schema instanceof Array) {
        schema = schema[0];
      }
      const def = this._resolve(schema);
      schemaItem.type = this._computeModelType(def);
      schemaItem.isEnum = this._hasProperty(def, this.ns.w3.shacl.in);
      // Now check if there's cached model for this property
      // So far now it took only required steps to compute cache key of the
      // property.
      const cachedModel = getGlobalValue(result);
      if (cachedModel) {
        // Safe to return it.
        return cachedModel;
      }
      schemaItem.enabled = true;
      schemaItem.inputLabel = this._computeInputLabel(def, result.required, result.name);
      schemaItem.pattern = this._computeShaclProperty(def, 'pattern');
      schemaItem.minLength = this._computeShaclProperty(def, 'minLength');
      schemaItem.maxLength = this._computeShaclProperty(def, 'maxLength');
      schemaItem.defaultValue = this._computeDefaultValue(def);
      schemaItem.multipleOf = this._computeVocabularyShapeProperty(def, 'multipleOf');
      schemaItem.minimum = this._computeShaclProperty(def, 'minInclusive');
      schemaItem.maximum = this._computeShaclProperty(def, 'maxInclusive');
      schemaItem.enum = schemaItem.isEnum ? this._computeModelEnum(def) : undefined;
      schemaItem.isArray = schemaItem.type === 'array';
      schemaItem.isBool = schemaItem.type === 'boolean';
      schemaItem.isObject = schemaItem.type === 'object';
      schemaItem.examples = this._computeModelExamples(def);
      schemaItem.items = schemaItem.isArray ? this._computeModelItems(def) : undefined;
      schemaItem.inputType =
        this._computeModelInputType(schemaItem.type, schemaItem.items);
      schemaItem.format = this._computeVocabularyShapeProperty(schema, 'format');
      schemaItem.pattern = this._computeModelPattern(
        schemaItem.type, schemaItem.pattern, schemaItem.format);
      schemaItem.isNillable = schemaItem.type === 'union' ? this._computeIsNillable(def) : false;
      schemaItem.noAutoEncode = this._hasNoAutoEncodeProperty(schema);
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
    result.noAutoEncode = this._hasNoAutoEncodeProperty(amfItem);
    // store cache
    appendGlobalValue(result);
    return result;
  }

  /**
   * Creates a UI model item from AMF json/ld model for a parameter.
   * @param {Object} amfItem AMF model with schema for
   * `http://raml.org/vocabularies/http#Parameter`
   * @return {ModelItem} UI data model.
   */
  _uiModelForPropertyShape(amfItem) {
    amfItem = this._resolve(amfItem);
    const name = this._computeShaclProperty(amfItem, 'name');
    const result = {
      binding: 'type',
      required: false,
      hasDescription: false,
      hasExtendedDescription: false,
      name,
    };

    let def;
    if (this._hasType(amfItem, this.ns.aml.vocabularies.shapes.ScalarShape)) {
      def = amfItem;
    } else {
      const rangeKey = this._getAmfKey(this.ns.aml.vocabularies.shapes.range);
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
    result.schema.isNillable = result.schema.type === 'union' ? this._computeIsNillable(result) : false;

    if (this.noDocs) {
      result.hasDescription = false;
    } else {
      result.description = this._computeDescription(def);
      result.hasDescription = !!result.description;
    }
    if (result.schema.type === 'file') {
      result.schema.isFile = true;
      result.schema.fileTypes = this._getValueArray(def,
        this.ns.aml.vocabularies.shapes.fileType);
    } else {
      result.schema.isFile = false;
    }
    if (result.schema.isObject) {
      const props = [];
      const pKey = this._getAmfKey(this.ns.w3.shacl.property);
      const items = this._ensureArray(def[pKey]);
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
   * @param {ProcessOptions=} processOptions
   * @return {Array<ModelItem>} View model for items.
   */
  modelForRawObject(model, processOptions={}) {
    const result = [];
    const keys = Object.keys(model);
    const dataKey = this._getAmfKey(this.ns.raml.vocabularies.data + '');
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
   * @return {ModelItem} View model
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
    const result = {
      binding: 'type',
      required: false,
      hasDescription: false,
      hasExtendedDescription: false,
      name,
    };
    const typeKey = this._getAmfKey(this.ns.raml.vocabularies.data.type);
    let type = /** @type String */ (this._computeRawModelValue(model[typeKey]));
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
      const descKey = this._getAmfKey(this.ns.raml.vocabularies.data.description);
      result.description = /** @type String */ (this._computeRawModelValue(model[descKey]));
      result.hasDescription = !!result.description;
    }

    const requiredValue = model[this._getAmfKey(this.ns.raml.vocabularies.data.required)];
    result.required = /** @type boolean */ (this._computeRawModelValue(requiredValue));
    result.schema = {};
    result.schema.enabled = true;
    result.schema.type = type || 'string';
    const displayNameValue = model[this._getAmfKey(this.ns.raml.vocabularies.data.displayName)];
    const displayName = /** @type String */ (this._computeRawModelValue(displayNameValue));
    result.schema.inputLabel = this._completeInputLabel(displayName, name, result.required);
    const mlKey = this._getAmfKey(this.ns.raml.vocabularies.data.minLength);
    result.schema.minLength = this._computeRawModelValue(model[mlKey]);
    const mxKey = this._getAmfKey(this.ns.raml.vocabularies.data.maxLength);
    result.schema.maxLength = this._computeRawModelValue(model[mxKey]);
    const dfKey = this._getAmfKey(this.ns.raml.vocabularies.data.default);
    result.schema.defaultValue = this._computeRawModelValue(model[dfKey]);
    const mpKey = this._getAmfKey(this.ns.raml.vocabularies.data.multipleOf);
    result.schema.multipleOf = this._computeRawModelValue(model[mpKey]);
    result.schema.minimum = this._computeRawModelValue(model[this._getAmfKey(this.ns.raml.vocabularies.data.minimum)]);
    result.schema.maximum = this._computeRawModelValue(model[this._getAmfKey(this.ns.raml.vocabularies.data.maximum)]);
    result.schema.enum = this._computeRawModelValue(model[this._getAmfKey(this.ns.raml.vocabularies.data.enum)]);
    let pattern = this._computeRawModelValue(model[this._getAmfKey(this.ns.raml.vocabularies.data.pattern)]);
    if (pattern instanceof Array) {
      pattern = '[' + pattern[0] + ']';
    }
    result.schema.pattern = pattern;
    result.schema.isEnum = !!result.schema.enum;
    result.schema.isArray = result.schema.type === 'array';
    result.schema.isBool = result.schema.type === 'boolean';
    // result.schema.examples = this._computeModelExamples(def);
    if (result.schema.isArray) {
      result.schema.items = items ? items :
        this._computeRawModelValue(model[this._getAmfKey(this.ns.raml.vocabularies.data.items)]);
    }
    result.schema.inputType = this._computeModelInputType(result.schema.type, result.schema.items);
    result.schema.format = this._computeRawModelValue(model[this._getAmfKey(this.ns.raml.vocabularies.data.format)]);
    result.schema.pattern = this._computeModelPattern(result.schema.type, result.schema.pattern, result.schema.format);
    const example = this._computeRawModelValue(model[this._getAmfKey(this.ns.raml.vocabularies.data.example)]);
    if (example) {
      result.schema.examples = [example];
    }
    const examples = this._computeRawExamples(model[this._getAmfKey(this.ns.raml.vocabularies.data.examples)]);
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
   * @param {ModelItem} item Computed UI model.
   * @param {ProcessOptions} processOptions Model creation options
   * @return {ModelItem}
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
        this._parseArrayExample(/** @type {String} */ (item.schema.defaultValue), processOptions) :
        this._exampleAsValue(/** @type {String} */ (item.schema.defaultValue), processOptions);
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
      const _v = this._parseArrayExample(item.value, processOptions);
      item.value = _v instanceof Array ? _v : [_v];
    }

    if (item.schema.isArray && !item.value) {
      item.value = [''];
    }

    if (item.schema.isBool && typeof item.value === 'boolean') {
      item.value = String(item.value);
    }
    item.hasExtendedDescription = this._computeHasExtendedDocumentation(item);
    if (item.hasExtendedDescription) {
      item.extendedDescription = this._computeExtendedDocumentation(item);
    }
    return item;
  }

  /**
   * Completes computation of input label.
   *
   * @param {String} displayName Value of the `displayName` property
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
   * @return {Array<Example>|undefined}
   */
  _computeRawExamples(model) {
    if (!model || !model[0]) {
      return;
    }
    const result = [];
    model = model[0];
    const keys = Object.keys(model);
    keys.forEach((key) => {
      const dKey = this._getAmfKey(this.ns.raml.vocabularies.data + '');
      if (key.indexOf(dKey) === -1) {
        return;
      }
      const symbol = key.indexOf('#') !== -1 ? '#' : ':';
      const name = key.split(symbol)[1];
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
    const key = this.ns.aml.vocabularies.apiContract.binding;
    return /** @type string */ (this._getValue(model, key));
  }

  /**
   * Computes fomm (parameter) name from AMF model.
   * @param {Object} model AMF item model
   * @return {String|undefined} Name property or undefined if not found.
   */
  _computeFormName(model) {
    const pNameKey = this.ns.aml.vocabularies.apiContract.paramName;
    let name = this._getValue(model, pNameKey);
    if (!name) {
      const key = this.ns.aml.vocabularies.core.name;
      name = this._getValue(model, key);
    }
    return /** @type string */ (name);
  }

  /**
   * Computes `required` property from AMF model.
   * @param {Object} model AMF item model
   * @return {boolean|undefined} True if the property is required.
   */
  _computeRequired(model) {
    const key = this.ns.aml.vocabularies.apiContract.required;
    return /** @type boolean */ (this._getValue(model, key));
  }

  /**
   * Computes `minCount` property from AMF model for PropertyShape object.
   *
   * @param {Object} model AMF item model
   * @return {Boolean} True if `minCount` equals `1`
   */
  _computeRequiredPropertyShape(model) {
    const key = this.ns.w3.shacl.minCount;
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
    const vsh = this.ns.aml.vocabularies.shapes;
    const sa = this.ns.w3.shacl;
    if (this._hasType(shape, vsh.UnionShape)) {
      return 'union';
    }
    if (this._hasType(shape, vsh.ArrayShape)) {
      return 'array';
    }
    if (this._hasType(shape, sa.NodeShape)) {
      return 'object';
    }
    if (this._hasType(shape, sa.PropertyShape)) {
      return 'object';
    }
    if (this._hasType(shape, vsh.FileShape)) {
      return 'file';
    }
    if (this._hasType(shape, vsh.NilShape)) {
      return 'null';
    }
    // Apparently version 2 of the model has AnyShape type with ScalarShape.
    // if (this._hasType(shape, vsh.AnyShape)) {
    //   return 'string';
    // }
    if (this._hasType(shape, vsh.MatrixShape)) {
      return 'array';
    }
    if (this._hasType(shape, vsh.TupleShape)) {
      return 'object';
    }
    if (this._hasType(shape, vsh.ScalarShape)) {
      let dt = shape[this._getAmfKey(sa.datatype)];
      if (dt instanceof Array) {
        dt = dt[0];
      }
      let id = dt;
      if (typeof id !== 'string') {
        id = id['@id'];
      }
      const x = this.ns.w3.xmlSchema;
      switch (id) {
        case x.string:
        case this._getAmfKey(x.string):
          return 'string';
        case x.integer:
        case this._getAmfKey(x.integer):
          return 'integer';
        case x.long:
        case this._getAmfKey(x.long):
          return 'long';
        case x.float:
        case this._getAmfKey(x.float):
          return 'float';
        case x.double:
        case this._getAmfKey(x.double):
          return 'double';
        case vsh.number:
        case this._getAmfKey(vsh.number):
          return 'number';
        case x.boolean:
        case this._getAmfKey(x.boolean):
          return 'boolean';
        case x.dateTime:
        case this._getAmfKey(x.dateTime):
          return 'datetime';
        case vsh.dateTimeOnly:
        case this._getAmfKey(vsh.dateTimeOnly):
          return 'datetime-only';
        case x.time:
        case this._getAmfKey(x.time):
          return 'time';
        case x.date:
        case this._getAmfKey(x.date):
          return 'date';
        case x.base64Binary:
        case this._getAmfKey(x.base64Binary):
          return 'string';
        case vsh.password:
        case this._getAmfKey(vsh.password):
          return 'password';
      }
    }
    return 'string';
  }

  /**
   * Computes type of the raw model.
   *
   * @param {Array<Object>|Object} model Property schema.
   * @return {String|Number|Boolean|Array|undefined} Type of the nproperty.
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
      case this._getAmfKey(this.ns.raml.vocabularies.data.Scalar):
        return this._computeRawScalarValue(model);
      case this._getAmfKey(this.ns.raml.vocabularies.data.Array):
        return this._computeRawArrayValue(model);
      case this._getAmfKey(this.ns.aml.vocabularies.shapes.FileShape):
        return this._getValueArray(model, this.ns.aml.vocabularies.shapes.fileType);
    }
  }

  /**
   * Computes scalar value that has proper type.
   * @param {Object} item Shape to test for a value.
   * @return {String|Number|Boolean}
   */
  _computeRawScalarValue(item) {
    const value = this._getValue(item, this.ns.raml.vocabularies.data.value);
    const dtKey = this._getAmfKey(this.ns.w3.shacl.datatype);
    let type = item[dtKey];
    if (type instanceof Array) {
      type = type[0];
    }
    type = type['@id'];
    const s = this.ns.w3.xmlSchema;
    switch (type) {
      case this._getAmfKey(s.number):
      case this._getAmfKey(s.long):
      case this._getAmfKey(s.integer):
      case this._getAmfKey(s.float):
      case this._getAmfKey(s.double):
        return Number(value);
      case this._getAmfKey(s.boolean):
        return value === 'false' ? false : true;
      default:
        return value;
    }
  }

  /**
   * @param {Object} item Array property schema
   * @return {Array<any>|undefined} Array values.
   */
  _computeRawArrayValue(item) {
    const key = this._getAmfKey(this.ns.w3.rdfSchema.member);
    const values = this._ensureArray(item[key]);
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
    const result = /** @type string */ (this._getValue(def, this.ns.aml.vocabularies.core.name));
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
    const key = this.ns.w3.shacl.key + String(property);
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
    const key = this.ns.aml.vocabularies.shapes + String(property);
    return this._getValue(shape, key);
  }

  /**
   * Computes default value for a shape.
   * @param {Object} shape Amf shape
   * @return {any|undefined} Default value for the model or undefined.
   */
  _computeDefaultValue(shape) {
    const valueKey = this._getAmfKey(this.ns.w3.shacl.defaultValueStr);
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
    if (this._hasType(shape, this.ns.aml.vocabularies.shapes.ScalarShape)) {
      const dtKey = this._getAmfKey(this.ns.w3.shacl.datatype);
      let type = shape[dtKey];
      if (type instanceof Array) {
        type = type[0];
      }
      type = type['@id'];
      const s = this.ns.w3.xmlSchema;
      switch (type) {
        case s.number:
        case s.long:
        case s.integer:
        case s.float:
        case s.double:
        case this._getAmfKey(s.number):
        case this._getAmfKey(s.long):
        case this._getAmfKey(s.integer):
        case this._getAmfKey(s.float):
        case this._getAmfKey(s.double):
          return Number(value);
        case s.boolean:
        case this._getAmfKey(s.boolean):
          return value === 'false' ? false : true;
        default:
          return value;
      }
    } else if (this._hasType(shape, this.ns.aml.vocabularies.shapes.ArrayShape)) {
      const valueKey = this._getAmfKey(this.ns.w3.shacl.defaultValue);
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
    const rdfKey = this._getAmfKey(this.ns.w3.rdfSchema.key);
    Object.keys(model).forEach((key) => {
      if (key.indexOf(rdfKey) === -1) {
        return;
      }
      let shape = model[key];
      if (shape instanceof Array) {
        shape = shape[0];
      }
      const vKey = this._getAmfKey(this.ns.raml.vocabularies.data.value);
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
   * @return {Array<Example>|undefined} List of examples or `undefined` if not
   * defined.
   */
  _computeModelExamples(model) {
    const gen = new ExampleGenerator(this.amf);
    return gen.computeExamples(model, 'application/json', {});
  }

  /**
   * Computes `items` property for AMF array property
   *
   * @param {Object} model AMF property model
   * @return {string} Type of an item
   */
  _computeModelItems(model) {
    if (!this._hasType(model, this.ns.aml.vocabularies.shapes.ArrayShape)) {
      return;
    }
    model = this._resolve(model);
    const itKeys = this._getAmfKey(this.ns.aml.vocabularies.shapes.items);
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

  /**
   * Computes value delimiter for processing options.
   * @param {String} binding Property's binding
   * @return {String} A `:` for headers, `=` for query param, and empty for other.
   */
  _computeValueDelimiter(binding) {
    switch (binding) {
      case 'header': return ':';
      case 'query': return '=';
      default: return '';
    }
  }

  /**
   * Computes value for decodeValues of ProcessingOptions.
   * @param {String} binding Property's binding
   * @return {Boolean} True whe values should be encoded.
   */
  _computeDecodeValues(binding) {
    switch (binding) {
      case 'query': return true;
      default: return false;
    }
  }

  /**
   * Parses a string from example or enum value to be used as a default value.
   * @param {String} example Example value to process as a value
   * @param {ProcessOptions} opts
   *
   * @return {String}
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
        // ...
      }
    }
    return example;
  }

  /**
   * Parses example in an array type.
   *
   * @param {String} example An array example
   * @param {ProcessOptions} processOptions
   * @return {Array<string>|string} Array of examples or string if cannot parse
   */
  _parseArrayExample(example, processOptions) {
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
      // ...
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
   * @param {ModelItem|Object|String} items Array items if any
   * @return {String} Input field type.
   */
  _computeModelInputType(type, items) {
    if (type === 'array') {
      if (typeof items === 'string') {
        return this._computeInputType(items);
      }
      if (!items) {
        return 'text';
      }
      return this._computeInputType(items.schema ? items.schema.type : items.type);
    }
    return this._computeInputType(type);
  }

  /**
   * Computes the type attribute value for a text input for given type.
   *
   * @param {String} type One of the schema types
   * @return {String} Value for the text input type.
   */
  _computeInputType(type) {
    if (type && NUMBER_INPUT_TYPES.indexOf(type) !== -1) {
      return 'number';
    } else if (type === 'boolean') {
      return 'boolean';
    } else if (type === 'date-only' || type === 'date') {
      return 'date';
    } /* else if (type === 'time-only' || type === 'time') {
      Time input does not work well in the console.
      It's better to use regular input. Unless someone create custom time
      input.
      return 'time';
    } */
    return 'text';
  }

  /**
   * Computes pattern for the input.
   *
   * @param {String} modelType Type of the property item.
   * @param {String} pattern Pattern declared on the property
   * @param {String=} format For `datetime` type additional format value.
   * `rfc3339` is assumed by default
   * @return {String|undefined} Pattern or undefined if does not exists.
   */
  _computeModelPattern(modelType, pattern, format) {
    if (!pattern) {
      switch (modelType) {
        case 'time':
          pattern = '^[0-9]{2}:[0-9]{2}:[0-9]{2}\\.?[0-9]{0,3}$';
          break;
        case 'date':
          pattern = '^[0-9]{4}-[0-9]{2}-[0-9]{2}$';
          break;
        case 'datetime-only':
          pattern = '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\\.?[0-9]{0,3}$';
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
   * Builds an empty view model without traversing AMF model.
   *
   * @param {Object=} defaults View model with default values. This values won't
   * be set.
   * @return {ModelItem} Generated basic view model.
   */
  buildProperty(defaults={}) {
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
   * @param {ModelItem} item Model item
   * @return {Boolean} True if documentation can be rendered.
   */
  _computeHasExtendedDocumentation(item) {
    const schema = item.schema || {};
    if (item.hasDescription || schema.pattern) {
      return true;
    }
    if (!(schema.examples || []).length) {
      return false;
    }
    if (schema.examples && schema.examples.length && schema.examples[0]) {
      let value = schema.examples[0].value;
      if (Array.isArray(value)) {
        value = value[0];
      }
      return value !== undefined && value !== '';
    }
    return false;
  }

  /**
   * Computes documentation as a markdown to be placed in the `marked-element`
   * @param {ModelItem} item View model
   * @return {String} Generated documentation
   */
  _computeExtendedDocumentation(item) {
    let docs = '';
    if (item.description) {
      docs += item.description;
    }
    const { schema } = item;
    const items = [];
    if (schema.pattern) {
      items[items.length] = '- Pattern: `' + schema.pattern + '`';
    }
    if (schema.examples && schema.examples.length) {
      schema.examples.forEach((item) => {
        if (item.value === undefined || item.value === '') {
          return;
        }
        let result = '- Example';
        if (item.title) {
          result += ' ' + item.title;
        }
        let value;
        if (Array.isArray(item.value)) {
          value = item.value.join(', ');
        } else {
          value = item.value;
        }
        result += ': `' + value + '`';
        items[items.length] = result;
      });
    }
    if (docs && items.length) {
      docs += '\n\n\n';
    }
    return docs + items.join('\n');
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
    const key = this._getAmfKey(this.ns.aml.vocabularies.shapes.anyOf);
    const values = this._ensureArray(shape[key]);
    if (!values) {
      return false;
    }
    for (let i = 0, len = values.length; i < len; i++) {
      if (this._hasType(values[i], this.ns.aml.vocabularies.shapes.NilShape)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Checks if given property has `no-auto-encoding` annotation.
   *
   * @param {Object} shape An object to test for the annotation.
   * @return {boolean} True if the annotation is set.
   */
  _hasNoAutoEncodeProperty(shape) {
    if (!shape) {
      return false;
    }
    const key = this._getAmfKey(this.ns.aml.vocabularies.document.customDomainProperties);
    const values = this._ensureArray(shape[key]);
    if (!values) {
      return false;
    }
    for (let i = 0, len = values.length; i < len; i++) {
      const id = this._ensureAmfPrefix(/** @type string */ (this._getValue(values[i], '@id')));
      const node = shape[id];
      const extensionNameKey = this._getAmfKey(this.ns.aml.vocabularies.core.extensionName);
      if (this._getValue(node, extensionNameKey) === 'no-auto-encoding') {
        return true;
      }
    }
    return false;
  }

  _ensureAmfPrefix(id) {
    if (!id.startsWith('amf://id')) {
      return `amf://id${id}`;
    }
    return id;
  }
}
