import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab-news',
        children: [
          {
            path: '',
            loadChildren: '../pages/tab-news/tab-news.module#TabNewsPageModule'
          }
        ]
      },
      {
        path: 'tab-people',
        children: [
          {
            path: '',
            loadChildren: '../pages/tab-people/tab-people.module#TabPeoplePageModule'
          },

        ]
      },
      {
        path: 'tab-share',
        children: [
          {
            path: '',
            loadChildren: '../pages/tab-share/tab-share.module#TabSharePageModule'
          },
          {
            path: 'add-new-share',
            children: [
              {
                path: '',
                loadChildren: '../pages/tab-share/add-new-share/add-new-share.module#AddNewSharePageModule'
              }
            ]
          }
        ]
      },
      {
        path: 'tab-profile',
        children: [{
          path: '',
          loadChildren: '../pages/tab-profile/tab-profile.module#TabProfilePageModule'
        },]
      },
      {
        path: 'tab-messages',
        children: [
          {
            path: '',
            loadChildren: '../pages/tab-messages/tab-messages.module#TabMessagesPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/tab-share',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab-share',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
