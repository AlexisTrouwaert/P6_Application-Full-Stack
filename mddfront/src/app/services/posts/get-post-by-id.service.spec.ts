import { TestBed } from '@angular/core/testing';

import { GetPostByIdService } from './get-post-by-id.service';

describe('GetPostByIdService', () => {
  let service: GetPostByIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetPostByIdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
