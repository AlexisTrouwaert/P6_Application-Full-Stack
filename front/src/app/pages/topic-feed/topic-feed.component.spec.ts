import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicFeedComponent } from './topic-feed.component';

describe('TopicFeedComponent', () => {
  let component: TopicFeedComponent;
  let fixture: ComponentFixture<TopicFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicFeedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
