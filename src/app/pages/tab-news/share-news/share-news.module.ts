import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ShareNewsPage } from './share-news.page';
import { TranslateModule } from '@ngx-translate/core';
import { AppPipesModule } from 'src/app/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: ShareNewsPage
  }
];

@NgModule({
  imports: [
    TranslateModule,
    AppPipesModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ShareNewsPage]
})
export class ShareNewsPageModule {}
