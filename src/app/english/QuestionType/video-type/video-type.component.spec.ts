import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoTypeComponent } from './video-type.component';

describe('VideoTypeComponent', () => {
  let component: VideoTypeComponent;
  let fixture: ComponentFixture<VideoTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideoTypeComponent]
    });
    fixture = TestBed.createComponent(VideoTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
