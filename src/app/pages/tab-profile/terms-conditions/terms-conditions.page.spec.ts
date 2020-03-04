import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsConditionsPage } from './terms-conditions.page';

describe('TermsConditionsPage', () => {
  let component: TermsConditionsPage;
  let fixture: ComponentFixture<TermsConditionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsConditionsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsConditionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
