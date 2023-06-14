import * as joi from 'joi';
import { ObjectId } from 'mongodb';

export const Joi = joi;

const objectIdExtendedJoi = joi.extend((joi) => {
  return {
    type: 'objectId',
    base: joi.any(),
    messages: {
      objectId: '{{#label}} is not a valid ObjectId',
    },
    validate(value, helpers) {
      if (!ObjectId.isValid(value)) {
        return { value, errors: helpers.error('objectId') };
      }
      return { value: new ObjectId(value) };
    },
  };
});

export const RequiredStringSchema = () => joi.string().required();

export const NullableStringSchema = () =>
  joi.string().allow(null, '').default(null);

export const RequiredEmailSchema = () =>
  RequiredStringSchema().email({ tlds: { allow: false } });

export const NullableEmailSchema = () =>
  NullableStringSchema().email({ tlds: { allow: false } });

export const RequiredNumberSchema = () => joi.number().required();

export const NullableNumberSchema = () =>
  joi.number().allow(null, '').default(null);

export const RequiredIntegerSchema = () => joi.number().integer().required();

export const NullableIntegerSchema = () =>
  joi.number().integer().allow(null, '').default(null);

export const RequiredDateSchema = () => joi.date().required();

export const NullableDateSchema = () =>
  joi.date().allow(null, '').default(null);

export const RequiredBooleanSchema = () => joi.boolean().required();

export const NullableBooleanSchema = () =>
  joi.boolean().allow(null).default(null);

export const DefaultTrueBooleanSchema = () => joi.boolean().default(true);

export const DefaultFalseBooleanSchema = () => joi.boolean().default(false);

export const ObjectSchema = () => joi.object();

export const NullableObjectSchema = () =>
  ObjectSchema().allow(null).default(null);

export const RequiredArraySchema = () => joi.array().min(1).required();

export const NullableArraySchema = () => joi.array().allow(null).default([]);

export const RequiredObjectIdSchema = () =>
  objectIdExtendedJoi.objectId().required();

export const NullableObjectIdSchema = () =>
  joi
    .alternatives()
    .try(objectIdExtendedJoi.objectId(), NullableStringSchema());

export const IdsSchema = () =>
  ObjectSchema().keys({
    ids: joi.array().items(RequiredObjectIdSchema()),
  });

export const IdSchema = () =>
  ObjectSchema().keys({
    id: RequiredObjectIdSchema().allow('null').required(),
  });

export const PagingSchema = (fields?: { [name: string]: any }) =>
  ObjectSchema().keys({
    ...fields,
    keyword: NullableStringSchema(),
    page: joi.number().integer().min(1).default(1),
    limit: joi.number().integer().min(1).default(10),
    sort: joi.string().regex(/[+-]?[0-9a-zA-Z]*[,]?/),
  });

export const RangeDatesSchema = () =>
  ObjectSchema().keys({
    startAt: NullableDateSchema(),
    endAt: NullableDateSchema(),
  });

export const RequiredEnumSchema = (enumType: any, ...exceptions: string[]) => {
  const list = [...exceptions];
  for (const key of Object.keys(enumType)) {
    if (!/^\d+$/g.test(key)) {
      list.push(enumType[key]);
    }
  }
  return RequiredStringSchema().valid(...list);
};

export const NullableEnumSchema = (enumType: any, ...exceptions: string[]) => {
  const list = [...exceptions];
  for (const key of Object.keys(enumType)) {
    if (!/^\d+$/g.test(key)) {
      list.push(enumType[key]);
    }
  }
  return NullableStringSchema().valid(...list);
};

export const UrlRegex =
  /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

export const RequiredUrlSchema = () =>
  joi.string().required().pattern(UrlRegex).messages({
    'string.pattern.base': 'not a url format',
  });
