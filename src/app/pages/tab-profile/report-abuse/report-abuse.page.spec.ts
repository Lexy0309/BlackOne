import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAbusePage } from './report-abuse.page';

describe('ReportAbusePage', () => {
  let component: ReportAbusePage;
  let fixture: ComponentFixture<ReportAbusePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportAbusePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAbusePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
