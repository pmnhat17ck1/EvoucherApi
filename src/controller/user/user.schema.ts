import {
  NullableStringSchema,
  RequiredEmailSchema,
} from './../../models/schema/base.schema';
import Joi from 'joi';
import {
  ObjectSchema,
  RequiredStringSchema,
} from 'src/models/schema/base.schema';
export const UsernameRegex = /^[a-zA-Z0-9]{6,30}$/;

export const PasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,30}$/;

export const PhoneNumberRegex = /^09\d{8}$/;
export const RegisterSchema = () =>
  ObjectSchema().keys({
    username: RequiredStringSchema().pattern(UsernameRegex),
    password: RequiredStringSchema().pattern(PasswordRegex),
    confirmPassword: RequiredStringSchema()
      .valid(Joi.ref('password'))
      .required()
      .error((error) => {
        const item = error.find((x) => x.code === 'any.only');
        if (item) {
          item.message = '確認密碼不相符';
        }
        return <any>error;
      }),
    name: RequiredStringSchema(),
    email: RequiredEmailSchema(),
    phoneNumber: NullableStringSchema().pattern(PhoneNumberRegex),
  });
