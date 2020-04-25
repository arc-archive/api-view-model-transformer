[![Published on NPM](https://img.shields.io/npm/v/@api-components/api-view-model-transformer.svg)](https://www.npmjs.com/package/@api-components/api-view-model-transformer)

[![Build Status](https://travis-ci.com/advanced-rest-client/api-view-model-transformer.svg)](https://travis-ci.org/advanced-rest-client/api-view-model-transformer)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/api-view-model-transformer)

# ApiViewModel

A library to transform AMF's ld-json model into a form view model. The form view is used to power editors embedded in the api-request-editor element.
The model should be used to build a form view for request parameters like header, query parameters, uri parameters or the body.

## Version compatibility

This version only works with AMF model version 2 (AMF parser >= 4.0.0).
For compatibility with previous model version use `3.x.x` version of the component.

## Deprecation notice

The `api-view-model-transformer` custom element was build when the `AmfHelperMixin` was requiring a `HTMLElement` as a base class. Since it is not the case any more this element is being transformed
into a JS library. The custom element has only previously accessible public properties. With the next major release the custom element will be removed.
Please, use `ApiViewModel` class instead of element.

## Usage

### Installation

```sh
npm install --save @api-components/api-view-model-transformer
```

### Example

```javascript
import { ApiViewModel } from '@api-components/api-view-model-transformer';
const amf = getAmfFromRamlOrOas();
const headers = extractHeadersForMethod(amf); // or other types.
const worker = new ApiViewModel();
const viewModel = worker.computeViewModel(headers);
```

This example uses `getAmfFromRamlOrOas()` function where you implement the logic of getting AMF json/ld data. It can be stored in file or parsed using AMF parsers. The `extractHeadersForMethod()` represents a logic to extract properties that you want to transform. It can be headers, query parameters or body type.

## Deprecated example

```html
<api-view-model-transformer></api-view-model-transformer>
<script>
const amfModel = getAmfFromRamlOrOas();
const processor = document.querySelector('api-view-model-transformer');
processor.amf = amfModel;
processor.shape = extractHeadersForMethod(amfModel);
processor.addEventListener('view-model-changed', (e) => {
 console.log(e.detail.value);
});
</script>
```

## ld+json context

JSON schema may contain `@context` property. It can be used to reduce size of the schema by replacing namespace ids with defined in `@context` keyword. For the component to properly compute AMF values the full AMF model has to be set on `amf` property.

## Development

```sh
git clone https://github.com/advanced-rest-client/api-view-model-transformer
cd api-view-model-transformer
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests

```sh
npm test
```
