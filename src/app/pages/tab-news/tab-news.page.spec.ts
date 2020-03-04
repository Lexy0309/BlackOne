import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabNewsPage } from './tab-news.page';

describe('TabNewsPage', () => {
  let component: TabNewsPage;
  let fixture: ComponentFixture<TabNewsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabNewsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabNewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
