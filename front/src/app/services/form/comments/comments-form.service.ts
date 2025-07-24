import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CommentsFormService {

  constructor(
    private fb: FormBuilder
  ) { }

  createCommentForm(): FormGroup {
    return this.fb.group({
      content: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
      postId: new FormControl(0, [Validators.required]),
    })
  }
}
