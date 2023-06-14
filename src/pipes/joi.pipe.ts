import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { AnySchema, ValidationOptions } from 'joi';

@Injectable()
export class JoiPipe implements PipeTransform {
  constructor(private schema: AnySchema) {}

  transform(orgValue: any, metadata: ArgumentMetadata) {
    const options: ValidationOptions = {
      abortEarly: false,
      stripUnknown: true,
    };
    const { error, value } = this.schema.validate(orgValue, options);
    if (error) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Bad Request',
        details: error.details.map((x) => ({
          message: x.message,
          field: x.context.key,
          value: x.context.value,
        })),
      });
    }
    return value;
  }
}

@Injectable()
export class NoneStripJoiPipe implements PipeTransform {
  constructor(private schema: AnySchema) {}

  transform(orgValue: any, metadata: ArgumentMetadata) {
    const options: ValidationOptions = {
      abortEarly: false,
      stripUnknown: false,
    };
    const { error, value } = this.schema.validate(orgValue, options);
    if (error) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Bad Request',
        details: error.details.map((x) => ({
          message: x.message,
          field: x.context.key,
          value: x.context.value,
        })),
      });
    }
    return value;
  }
}
