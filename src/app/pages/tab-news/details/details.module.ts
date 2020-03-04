import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailsPage } from './details.page';
import { TranslateModule } from '@ngx-translate/core';
import { AppPipesModule } from 'src/app/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: DetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppPipesModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetailsPage]
})
export class DetailsPageModule {}
