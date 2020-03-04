import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabProfilePage } from './tab-profile.page';

describe('TabProfilePage', () => {
  let component: TabProfilePage;
  let fixture: ComponentFixture<TabProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabProfilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
