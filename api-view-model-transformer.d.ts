import {ApiViewModelTransformer} from './src/ApiViewModelTransformer.js';

declare global {
  interface HTMLElementTagNameMap {
    /**
     * @deprecated Use `ApiViewModel` instead
     */
    "api-view-model-transformer": ApiViewModelTransformer;
  }
}
