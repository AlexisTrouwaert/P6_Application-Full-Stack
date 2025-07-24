import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export class CustomValidators {

  static hasDigit(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const hasDigit = /[0-9]/.test(control.value);
      return hasDigit ? null : { hasDigit: true };
    };
  }

  static hasLowercase(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const hasLowercase = /[a-z]/.test(control.value);
      return hasLowercase ? null : { hasLowercase: true };
    };
  }

  static hasUppercase(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const hasUppercase = /[A-Z]/.test(control.value);
      return hasUppercase ? null : { hasUppercase: true };
    };
  }

  static hasSpecialCharacter(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Le même regex que tu as en Java, mais échappé pour JavaScript
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]/.test(control.value);
      return hasSpecialChar ? null : { hasSpecialCharacter: true };
    };
  }
}