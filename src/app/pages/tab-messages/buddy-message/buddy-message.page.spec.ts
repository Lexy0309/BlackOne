import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuddyMessagePage } from './buddy-message.page';

describe('BuddyMessagePage', () => {
  let component: BuddyMessagePage;
  let fixture: ComponentFixture<BuddyMessagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuddyMessagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuddyMessagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
