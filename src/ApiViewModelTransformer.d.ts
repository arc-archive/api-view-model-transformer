import {LitElement} from 'lit-element';
import {EventsTargetMixin} from '@advanced-rest-client/events-target-mixin/events-target-mixin.js';

export {ApiViewModelTransformer};

/**
 * @deprecated This element is deprecated. Use ApiViewModel class instead.
 *
 * This element only has public methods of the old implementation.
 */
declare class ApiViewModelTransformer extends EventsTargetMixin(LitElement) {

  /**
   * An array of propertues for which view model is to be generated.
   * It accepts model for headers, query parameters, uri parameters and
   * body.
   * If `manualModel` is not set, assigning a value to this property will
   * trigger model computation. Otherwise call `computeViewModel()`
   * function manually to generate the model.
   */
  shape: any[]|undefined;

  /**
   * Generated view model from the `shape`
   */
  viewModel: any[]|undefined;

  /**
   * If set, assigning a value to `shape` will not trigger view model
   * computation.
   */
  manualModel: boolean|undefined;

  /**
   * Makes the model to always have `hasDescription` to false and
   * clears and documentation from ther model.
   */
  noDocs: boolean|undefined;
  constructor();
  _attachListeners(node: Element): void;
  _detachListeners(node: Element): void;

  clearCache(): void;

  computeViewModel(shape: any[]|object): Array<object>|null;

  _notifyViewModelChanged(value: Array<object>): void;

  uiModelForAmfItem(amfItem: object): object|null;

  modelForRawObject(model: object, processOptions?: object): Array<object|null>|null;

  _buildPropertyHandler(e: CustomEvent): void;

  buildProperty(defaults: object): object;
}
