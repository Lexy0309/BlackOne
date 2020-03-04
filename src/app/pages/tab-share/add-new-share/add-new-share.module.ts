import { AddNewShareGuard } from './add-new-share.guard';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddNewSharePage } from './add-new-share.page';
import { TranslateModule } from '@ngx-translate/core';
const routes: Routes = [
  {
    path: '',
    component: AddNewSharePage,
    canDeactivate: [AddNewShareGuard]
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
  declarations: [AddNewSharePage],
  providers: [AddNewShareGuard]
})
export class AddNewSharePageModule {}
