import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowPeopleSkeletonItemComponent } from './follow-people-skeleton-item.component';

describe('FollowPeopleSkeletonItemComponent', () => {
  let component: FollowPeopleSkeletonItemComponent;
  let fixture: ComponentFixture<FollowPeopleSkeletonItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowPeopleSkeletonItemComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowPeopleSkeletonItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
