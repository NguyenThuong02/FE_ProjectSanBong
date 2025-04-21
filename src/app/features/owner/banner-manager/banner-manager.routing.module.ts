import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BannerManagerComponent } from "./banner-manager.component";

const routes: Routes = [
    {
        path:'',
        component: BannerManagerComponent,
        children:[
            {
                path:'',
                redirectTo:'',
                pathMatch:'full',
            },
            {
                path: '',
                loadComponent: () =>
                  import('../banner-manager/list-banner/list-banner.component').then(
                    (m) => m.ListBannerComponent
                  ),        
            },
            {
                path: 'add',
                loadComponent: () =>
                  import('../banner-manager/add-banner/add-banner.component').then(
                    (m) => m.AddBannerComponent
                  ),        
            },
            {
                path: 'detail/:id',
                loadComponent: () =>
                  import('../banner-manager/add-banner/add-banner.component').then(
                    (m) => m.AddBannerComponent
                  ),        
            },
            {
                path:"**",
                redirectTo:'/',
            },
        ],
    },
];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule],
})
export class BannerManagerRoutingModule {}