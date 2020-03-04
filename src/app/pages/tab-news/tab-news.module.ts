import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabNewsPage } from './tab-news.page';
import { AppPipesModule } from 'src/app/pipes/pipes.module';


const routes: Routes = [
  {
    path: '',
    component: TabNewsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    AppPipesModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabNewsPage]
})
export class TabNewsPageModule {}
