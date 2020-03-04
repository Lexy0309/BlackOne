import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninUpPage } from './signin-up.page';

describe('SigninUpPage', () => {
  let component: SigninUpPage;
  let fixture: ComponentFixture<SigninUpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigninUpPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninUpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
