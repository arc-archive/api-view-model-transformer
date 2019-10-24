import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import { LitElement } from 'lit-element';

export const AmfLoader = {};

class HelperElement extends AmfHelperMixin(LitElement) {}
window.customElements.define('helper-element', HelperElement);

const helper = new HelperElement();

AmfLoader.load = async function(compact, fileName) {
  compact = compact ? '-compact' : '';
  fileName = fileName || 'demo-api';
  const file = `${fileName}${compact}.json`;
  const url = location.protocol + '//' + location.host + '/base/demo/'+ file;
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (e) => {
      let data;
      try {
        data = JSON.parse(e.target.response);
        /* istanbul ignore next */
      } catch (e) {
        /* istanbul ignore next */
        reject(e);
        /* istanbul ignore next */
        return;
      }
      resolve(data);
    });
    /* istanbul ignore next */
    xhr.addEventListener('error',
      () => reject(new Error('Unable to load model file')));
    xhr.open('GET', url);
    xhr.send();
  });
};

AmfLoader.lookupEndpoint = function(model, endpoint) {
  helper.amf = model;
  const webApi = helper._computeWebApi(model);
  return helper._computeEndpointByPath(webApi, endpoint);
};

AmfLoader.lookupEndpointParameters = function(model, endpoint) {
  const endPoint = AmfLoader.lookupEndpoint(model, endpoint);
  const key = helper._getAmfKey(helper.ns.aml.vocabularies.apiContract.parameter);
  return helper._ensureArray(endPoint[key]);
};

AmfLoader.lookupOperation = function(model, endpoint, operation) {
  helper.amf = model;
  const webApi = helper._computeWebApi(model);
  const endPoint = helper._computeEndpointByPath(webApi, endpoint);
  const opKey = helper._getAmfKey(helper.ns.w3.hydra.supportedOperation);
  const ops = helper._ensureArray(endPoint[opKey]);
  return ops.find((item) => helper._getValue(item, helper.ns.aml.vocabularies.apiContract.method) === operation);
};

AmfLoader.lookupOperationParameters = function(model, endpoint, operation) {
  const method = AmfLoader.lookupOperation(model, endpoint, operation);
  const expects = helper._computeExpects(method);
  const key = helper._getAmfKey(helper.ns.aml.vocabularies.apiContract.parameter);
  return helper._ensureArray(expects[key]);
};

AmfLoader.lookupSecurity = function(model, endpoint, operation) {
  const method = AmfLoader.lookupOperation(model, endpoint, operation);
  const secKey = helper._getAmfKey(helper.ns.aml.vocabularies.security.security);
  let security = method[secKey];
  if (security instanceof Array) {
    security = security[0];
  }
  return security;
};

AmfLoader.lookupSecurityScheme = function(model, endpoint, operation) {
  const security = AmfLoader.lookupSecurity(model, endpoint, operation);
  const shKey = helper._getAmfKey(helper.ns.aml.vocabularies.security.scheme);
  let scheme = security[shKey];
  if (scheme instanceof Array) {
    scheme = scheme[0];
  }
  return scheme;
};

AmfLoader.lookupSecuritySettings = function(model, endpoint, operation) {
  const security = AmfLoader.lookupSecurityScheme(model, endpoint, operation);
  const key = helper._getAmfKey(helper.ns.aml.vocabularies.security.settings);
  let settings = security[key];
  if (settings instanceof Array) {
    settings = settings[0];
  }
  return settings;
};
