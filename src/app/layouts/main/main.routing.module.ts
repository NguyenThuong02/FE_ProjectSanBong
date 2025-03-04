import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { TranslateModule } from '@ngx-translate/core';
import { RolesGuard } from '../../core/guards/roles.guard';
// import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'home-page',
        loadChildren: () =>
          import('../../features/home-page/home-page.routing.module').then(
            (m) => m.HomePageRoutingModule,
          ),
      },
      {
        path: 'list-feilds',
        loadChildren: () =>
          import('../../features/list-fields/list-fields.routing.module').then(
            (m) => m.ListFieldsRoutingModule,
          ),
      },
      {
        path: 'my-info',
        loadChildren: () =>
          import('../../features/my-info/my-info.routing.module').then(
            (m) => m.MyInfoRoutingModule,
          ),
      },
      {
        path: 'statistical',
        loadChildren: () =>
          import('../../features/statistical/statistical.routing.module').then(
            (m) => m.StatisticalRoutingModule,
          ),
      },
      {
        path: 'user-management',
        loadChildren: () =>
          import('../../features/management/management.routing.module').then(
            (m) => m.ManagementRoutingModule,
          ),
          canActivate: [RolesGuard],
      },
      {
        path: 'setting',
        loadChildren: () =>
          import('../../features/setting/setting.routing.module').then(
            (m) => m.SettingRoutingModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TranslateModule],
  exports: [RouterModule],
})
export class MainRoutingModule {}
