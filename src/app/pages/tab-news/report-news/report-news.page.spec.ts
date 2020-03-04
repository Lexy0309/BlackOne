import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportNewsPage } from './report-news.page';

describe('ReportNewsPage', () => {
  let component: ReportNewsPage;
  let fixture: ComponentFixture<ReportNewsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportNewsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportNewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
