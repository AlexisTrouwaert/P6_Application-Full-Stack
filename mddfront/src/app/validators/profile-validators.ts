import { AbstractControl, ValidatorFn, ValidationErrors, Validators } from '@angular/forms';

export class ProfileValidators {

    static hasDigit(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === undefined || control.value === '') {
        return null;
      }
      const hasDigit = /[0-9]/.test(control.value);
      return hasDigit ? null : { hasDigit: true };
    };
  }

  static hasLowercase(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === undefined || control.value === '') {
        return null;
      }
      const hasLowercase = /[a-z]/.test(control.value);
      return hasLowercase ? null : { hasLowercase: true };
    };
  }

  static hasUppercase(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === undefined || control.value === '') {
        return null;
      }
      const hasUppercase = /[A-Z]/.test(control.value);
      return hasUppercase ? null : { hasUppercase: true };
    };
  }

  static hasSpecialCharacter(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === undefined || control.value === '') {
        return null;
      }
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]/.test(control.value);
      return hasSpecialChar ? null : { hasSpecialCharacter: true };
    };
  }

  static minLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === undefined || control.value === '') {
        return null;
      }
      return Validators.minLength(minLength)(control);
    };
  }
  
}