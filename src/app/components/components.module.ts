import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SkeletonItemComponent } from './skeleton-item/skeleton-item.component';
import { PeopleSkeletonItemComponent } from './people-skeleton-item/people-skeleton-item.component';
import { NewsSkeletonItemComponent } from './news-skeleton-item/news-skeleton-item.component';
@NgModule({
	declarations: [SkeletonItemComponent, PeopleSkeletonItemComponent, NewsSkeletonItemComponent],
	imports: [IonicModule],
	exports: [SkeletonItemComponent, PeopleSkeletonItemComponent, NewsSkeletonItemComponent]
})
export class ComponentsModule { }
