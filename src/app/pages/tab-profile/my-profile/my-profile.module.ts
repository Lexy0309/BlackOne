import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MyProfilePage } from './my-profile.page';
import { AppPipesModule } from 'src/app/pipes/pipes.module';
import { ComponentsModule } from 'src/app/components/components.module';
const routes: Routes = [
  {
    path: '',
    component: MyProfilePage
  }
];

@NgModule({
  imports: [
    AppPipesModule,
    CommonModule,
    ComponentsModule,
    TranslateModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyProfilePage]
})
export class MyProfilePageModule {}
