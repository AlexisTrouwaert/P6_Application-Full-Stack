import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileValidators } from '../../validators/profile-validators';

@Injectable({
  providedIn: 'root'
})
export class EditFormService {

  constructor(
      private fb: FormBuilder
    ) { }

  getEditForm(): FormGroup {
      return this.fb.group({
        username: new FormControl('', [Validators.minLength(4)]),
        mail: new FormControl('', [Validators.email]),
        password: new FormControl('', [
          ProfileValidators.hasDigit(),
          ProfileValidators.hasLowercase(),
          ProfileValidators.hasUppercase(),
          ProfileValidators.hasSpecialCharacter(),
          ProfileValidators.minLength(8)
        ]),
      });
    }
}
