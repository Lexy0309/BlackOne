import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-news-skeleton-item',
  templateUrl: './news-skeleton-item.component.html',
  styleUrls: ['./news-skeleton-item.component.scss'],
})
export class NewsSkeletonItemComponent implements OnInit {

  blankItems = ['1', '2', '3', '4'];  
  constructor() { }

  ngOnInit() {}

}
