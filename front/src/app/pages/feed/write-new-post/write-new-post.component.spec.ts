import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteNewPostComponent } from './write-new-post.component';

describe('WriteNewPostComponent', () => {
  let component: WriteNewPostComponent;
  let fixture: ComponentFixture<WriteNewPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WriteNewPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WriteNewPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
