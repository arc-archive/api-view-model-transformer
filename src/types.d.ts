import { Example } from '@api-components/api-example-generator/src/ExampleGenerator';

export declare interface ModelItemSchema {
  /**
   * Data type of the property
   */
  type?: string; 
  /**
   * Label for the form control
   */
  inputLabel?: string;
  /**
   * Type attribute of the `input` element.
   */
  inputType?: string;
  /**
   * Regex pattern of the property
   */
  pattern?: string;
  /**
   * String property minimum length
   */
  minLength?: number;
  /**
   * String property maximum length
   */
  maxLength?: number;
  /**
   * Default value of the property
   */
  defaultValue?: any;
  /**
   * List of examples for the form property.
   */
  examples?: Example[];
  /**
   * For numeric values, a `step` attribute of the `input` element. Each object may contain `name` (may be undefined) and must contain `value` property of the example.
   */
  multipleOf?: number;
  /**
   * For numeric values, minimum value of the property
   */
  minimum?: number;
  /**
   * For numeric values, maximum value of the property
   */
  maximum?: number;
  /**
   * Only if `schema.isEnum` is set. Values for enum input
   */
  enum?: any[];
  /**
   * Flag describing enumerable value
   */
  isEnum?: boolean;
  /**
   * Flag describing array value for the property
   */
  isArray?: boolean;
  /**
   * Name of the items type
   */
  items?: string|string[];
  /**
   * Flag describing boolean value for the property
   */
  isBool?: boolean;
  /**
   * Flag describing File value for the property
   */
  isFile?: boolean;
  /**
   * Flag describing Object value for the property
   */
  isObject?: boolean;
  /**
   * True when it is an union and one of union items is nil.
   */
  isNillable?: boolean;
  /**
   * Flag describing whether the item is a custom control. This is not generated from the AMF model but rather when a custom model is being created manually.
   */
  isCustom?: boolean;
  /**
   * A placeholder value for the input.
   */
  inputPlaceholder?: string;
  /**
   * Only if placeholder is set. Instructs input control to float a label.
   */
  inputFloatLabel?: boolean;
  /**
   * Flag describing whether the type is an union
   */
  isUnion?: boolean;
  /**
   * List of possible types of the union.
   */
  anyOf?: any[];
  /**
   * Indicates whether the control is enabled or not.
   */
  enabled?: boolean;
  /**
   * List of file types defined for a file type.
   */
  fileTypes?: string[];
  /**
   * Nil types gets `readOnly` property
   */
  readOnly?: boolean;
  /**
   * Format of a number type
   */
  format?: string;
}

export declare interface ModelItem {
  /** 
   * The property binding.
   */
  binding: 'path' | 'query' | 'header' | 'cookie' | string;
  /** 
   * The property (form) name
   */
  name: string;
  /** 
   * Whether the property required
   */
  required?: boolean; 
  /** 
   * The value of the form control
   */
  value?: any;
  /** 
   * The description of the property
   */
  description?: string;
  /** 
   * Flag describing if the property has a description.
   */
  hasDescription: boolean; 
  /** 
   * True when extendedDescription is set.
   */
  hasExtendedDescription: boolean;
  /** 
   * Extended documentation that includes description, patterns and examples.
   */
  extendedDescription?: string;
  /** 
   * If the model is a type of object it is a list of this model objects.
   */
  properties?: any[];
  /** 
   * The schema for the form control
   */
  schema: ModelItemSchema;
}

export declare interface ConstructorOptions {
  /**
   * The AMF model.
   */
  amf?: any;
  /**
   * When set the docs are not computed with the model.
   */
  noDocs?: boolean;
}

export declare interface ProcessOptions {
  /**
   * Processed property name
   */
  name?: string;
  /**
   * `:` for headers and `=` for query params
   */
  valueDelimiter?: string;
  /**
   * True to url decode value.
   */
  decodeValues?: boolean;
  /**
   * Whether the property is required.
   */
  required?: boolean;
}