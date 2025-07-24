import { TestBed } from '@angular/core/testing';

import { GetAllTopicService } from './get-all-topic.service';

describe('GetAllTopicService', () => {
  let service: GetAllTopicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetAllTopicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
