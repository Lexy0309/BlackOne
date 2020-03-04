import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AboutUsPage } from './about-us.page';
import { TranslateModule } from '@ngx-translate/core';
const routes: Routes = [
  {
    path: '',
    component: AboutUsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AboutUsPage]
})
export class AboutUsPageModule {}
