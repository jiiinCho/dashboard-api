import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { UserModel } from "../user.schema";

@ValidatorConstraint({ async: true })
export class IsEmailAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  validate(email: string) {
    return UserModel.findOne({ email }).then((user) => {
      if (user) return false;
      return true;
    });
  }
}

export function IsEmailAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailAlreadyExistConstraint,
    });
  };
}
