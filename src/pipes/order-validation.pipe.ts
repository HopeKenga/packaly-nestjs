import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AppService } from '../app.service';

@Injectable()
export class OrderValidationPipe implements PipeTransform<any> {
  constructor(private readonly appService: AppService) {}

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const errorMessages = this.extractErrorMessages(errors);
      throw new BadRequestException(errorMessages);
    }

    const { dropoff, pickup, packages } = value;

    // Check if there is at least one package
    if (!packages || packages.length === 0) {
      throw new BadRequestException('At least one package is required.');
    }

    // Check if pickup and dropoff addresses are provided
    if (!dropoff || !pickup) {
      throw new BadRequestException(
        'Both pickup and dropoff addresses are required.',
      );
    }

    // Check if zip codes are 6 characters long (excluding spaces)
    const zipCodeRegex = /^[A-Z\d\s]{6}$/;
    if (
      !zipCodeRegex.test(dropoff.zipcode) ||
      !zipCodeRegex.test(pickup.zipcode)
    ) {
      throw new BadRequestException(
        'Zip codes must be 6 characters long (excluding spaces).',
      );
    }

    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private extractErrorMessages(errors: any[]): string[] {
    const errorMessages: string[] = [];
    errors.forEach((error) => {
      for (const property in error.constraints) {
        if (Object.prototype.hasOwnProperty.call(error.constraints, property)) {
          errorMessages.push(error.constraints[property]);
        }
      }
    });
    return errorMessages;
  }
}