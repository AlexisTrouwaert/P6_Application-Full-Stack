import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CreatePostFormService {

  constructor(
    private fb: FormBuilder
  ) { }

  getCreatePostForm(): FormGroup {
    return this.fb.group({
      title: new FormControl('', [Validators.required, Validators.minLength(4)]),
      content: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]),
      topicId: new FormControl(0, [Validators.required]),
    })
  }
}
