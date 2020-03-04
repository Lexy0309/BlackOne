import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareNewsPage } from './share-news.page';

describe('ShareNewsPage', () => {
  let component: ShareNewsPage;
  let fixture: ComponentFixture<ShareNewsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareNewsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareNewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
