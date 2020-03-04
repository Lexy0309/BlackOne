import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCredentialsPage } from './my-credentials.page';

describe('MyCredentialsPage', () => {
  let component: MyCredentialsPage;
  let fixture: ComponentFixture<MyCredentialsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCredentialsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCredentialsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
