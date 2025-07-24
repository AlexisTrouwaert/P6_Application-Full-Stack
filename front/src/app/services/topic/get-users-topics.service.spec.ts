import { TestBed } from '@angular/core/testing';

import { GetUsersTopicsService } from './get-users-topics.service';

describe('GetUsersTopicsService', () => {
  let service: GetUsersTopicsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetUsersTopicsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
