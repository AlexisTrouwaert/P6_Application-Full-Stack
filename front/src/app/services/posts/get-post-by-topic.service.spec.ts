import { TestBed } from '@angular/core/testing';

import { GetPostByTopicService } from './get-post-by-topic.service';

describe('GetPostByTopicService', () => {
  let service: GetPostByTopicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetPostByTopicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
