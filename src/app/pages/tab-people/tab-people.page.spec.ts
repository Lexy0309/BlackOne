import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabPeoplePage } from './tab-people.page';

describe('TabPeoplePage', () => {
  let component: TabPeoplePage;
  let fixture: ComponentFixture<TabPeoplePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabPeoplePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabPeoplePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
