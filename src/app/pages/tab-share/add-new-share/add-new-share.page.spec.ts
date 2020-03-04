import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewSharePage } from './add-new-share.page';

describe('AddNewSharePage', () => {
  let component: AddNewSharePage;
  let fixture: ComponentFixture<AddNewSharePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewSharePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewSharePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
