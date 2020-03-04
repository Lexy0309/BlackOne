import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoViewModalPage } from './photo-view-modal.page';

describe('PhotoViewModalPage', () => {
  let component: PhotoViewModalPage;
  let fixture: ComponentFixture<PhotoViewModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoViewModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoViewModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
