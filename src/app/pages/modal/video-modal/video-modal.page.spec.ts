import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoModalPage } from './video-modal.page';

describe('VideoModalPage', () => {
  let component: VideoModalPage;
  let fixture: ComponentFixture<VideoModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
