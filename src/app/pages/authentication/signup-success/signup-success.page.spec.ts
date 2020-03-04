import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupSuccessPage } from './signup-success.page';

describe('SignupSuccessPage', () => {
  let component: SignupSuccessPage;
  let fixture: ComponentFixture<SignupSuccessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupSuccessPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
