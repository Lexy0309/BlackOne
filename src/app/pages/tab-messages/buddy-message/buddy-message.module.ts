import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BuddyMessagePage } from './buddy-message.page';
import { AppPipesModule } from 'src/app/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: BuddyMessagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    AppPipesModule,
    TranslateModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BuddyMessagePage]
})
export class BuddyMessagePageModule {}
