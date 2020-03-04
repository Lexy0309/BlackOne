import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ViewProfilePage } from './view-profile.page';
import { AppPipesModule } from 'src/app/pipes/pipes.module';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: ViewProfilePage
  }
];

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    AppPipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ViewProfilePage]
})
export class ViewProfilePageModule {}
