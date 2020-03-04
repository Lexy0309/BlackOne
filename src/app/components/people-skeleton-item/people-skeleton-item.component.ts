import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-people-skeleton-item',
  templateUrl: './people-skeleton-item.component.html',
  styleUrls: ['./people-skeleton-item.component.scss'],
})
export class PeopleSkeletonItemComponent implements OnInit {

  blankItems = ['1', '2', '3', '4'];
  constructor() { }

  ngOnInit() { }

}
