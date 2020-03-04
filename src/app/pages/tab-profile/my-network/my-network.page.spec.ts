import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNetworkPage } from './my-network.page';

describe('MyNetworkPage', () => {
  let component: MyNetworkPage;
  let fixture: ComponentFixture<MyNetworkPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyNetworkPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNetworkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
