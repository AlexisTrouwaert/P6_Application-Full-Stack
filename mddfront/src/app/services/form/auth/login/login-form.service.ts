import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class LoginFormService {

  constructor(
    private fb: FormBuilder
  ) { }

  getLoginForm(): FormGroup {
    return this.fb.group({
      mail: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)])
    });
  }
}
