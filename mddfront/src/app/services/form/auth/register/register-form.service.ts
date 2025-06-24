import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RegisterFormService {

  constructor(
    private fb: FormBuilder
  ) { }

  getRegisterForm(): FormGroup {
    return this.fb.group({
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      mail: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    });
  }
  
}
