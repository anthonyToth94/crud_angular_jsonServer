import { AbstractControl, ValidatorFn } from '@angular/forms';

export class utilityFunctions {

  static passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);

      const valid = hasUpperCase && hasLowerCase && hasNumber;
      return valid ? null : { 'passwordStrength': true };
    };
  }

}
