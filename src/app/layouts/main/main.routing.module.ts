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
          import('../../features/user/list-fields/list-fields.routing.module').then(
            (m) => m.ListFieldsRoutingModule,
          ),
      },
      {
        path: 'my-info',
        loadChildren: () =>
          import('../../features/user/my-info/my-info.routing.module').then(
            (m) => m.MyInfoRoutingModule,
          ),
      },
      {
        path: 'changePassword',
        loadChildren: () =>
          import('../../features/user/change-password/change-password.routing.module').then(
            (m) => m.ChangePasswordRoutingModule,
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
        path: 'facility',
        loadChildren: () =>
          import('../../features/owner/facility/facility.routing.module').then(
            (m) => m.FacilityRoutingModule,
          ),
      },
      {
        path: 'concert',
        loadChildren: () =>
          import('../../features/user/concert/concert.routing.module').then(
            (m) => m.ConcertRoutingModule,
          ),
      },
      {
        path: 'concert-by-owner',
        loadChildren: () =>
          import('../../features/owner/concert-by-owner/concert-by-owner.routing.module').then(
            (m) => m.ConcertByOwnerRoutingModule,
          ),
      },
      {
        path: 'shedule-owner',
        loadChildren: () =>
          import('../../features/owner/schedule-owner/schedule-owner.routing.module').then(
            (m) => m.SheduleOwnerRoutingModule,
          ),
      },
      {
        path: 'user-management',
        loadChildren: () =>
          import('../../features/admin/management/management.routing.module').then(
            (m) => m.ManagementRoutingModule,
          ),
          canActivate: [RolesGuard],
      },
      {
        path: 'setting',
        loadChildren: () =>
          import('../../features/admin/setting/setting.routing.module').then(
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
