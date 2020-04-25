import { LitElement } from 'lit-element';
import { EventsTargetMixin } from '@advanced-rest-client/events-target-mixin/events-target-mixin.js';
import { ApiViewModel } from './ApiViewModel.js';

/**
 * This element is deprecated. Use ApiViewModel class instead.
 *
 * This element only has public methods of the old implementation.
 *
 * @customElement
 * @mixes EventsTargetMixin
 * @extends LitElement
 */
export class ApiViewModelTransformer extends EventsTargetMixin(LitElement) {
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
       */
      viewModel: { type: Array },
      /**
       * If set, assigning a value to `shape` will not trigger view model
       * computation.
       */
      manualModel: { type: Boolean },
      /**
       * Makes the model to always have `hasDescription` to false and
       * clears and documentation from ther model.
       */
      noDocs: { type: Boolean }
    };
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

  get amf() {
    return this.__modeler.amf;
  }

  set amf(value) {
    this.__modeler.amf = value;
  }

  get noDocs() {
    return this.__modeler.noDocs;
  }

  set noDocs(value) {
    this.__modeler.noDocs = value;
  }

  constructor() {
    super();
    this._buildPropertyHandler = this._buildPropertyHandler.bind(this);
    this.__modeler = new ApiViewModel({});
    this.manualModel = false;
  }

  _attachListeners(node) {
    node.addEventListener('api-property-model-build', this._buildPropertyHandler);
  }

  _detachListeners(node) {
    node.removeEventListener('api-property-model-build', this._buildPropertyHandler);
  }

  clearCache() {
    this.__modeler.clearCache();
  }

  _shapeChanged(shape) {
    if (this.manualModel) {
      return;
    }
    this.computeViewModel(shape);
  }

  computeViewModel(shape) {
    if (!shape) {
      shape = this.shape;
    }
    const result = this.__modeler.computeViewModel(shape);
    this.viewModel = result;
    this._notifyViewModelChanged(result);
    return result;
  }

  /**
   * Notifies about view model change by dispatching view-model-changed event.
   * @param {Array<Object>} value
   */
  _notifyViewModelChanged(value) {
    this.dispatchEvent(new CustomEvent('view-model-changed', {
      composed: true,
      detail: {
        value
      }
    }));
  }


  uiModelForAmfItem(amfItem) {
    return this.__modeler.uiModelForAmfItem(amfItem);
  }

  modelForRawObject(model, processOptions={}) {
    return this.__modeler.modelForRawObject(model, processOptions);
  }


  buildProperty(defaults) {
    return this.__modeler.buildProperty(defaults);
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
}
