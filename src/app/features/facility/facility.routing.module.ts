import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FacilityComponent } from "./facility.component";

const routes: Routes = [
    {
        path:'',
        component: FacilityComponent,
        children:[
            {
                path:'',
                redirectTo:'list',
                pathMatch:'full',
            },
            {
                path: 'list',
                loadComponent: () =>
                  import('../facility/list-facility/list-facility.component').then(
                    (m) => m.ListFacilityComponent
                  ),        
            },
            {
                path: 'add',
                loadComponent: () =>
                  import('../facility/add-facility/add-facility.component').then(
                    (m) => m.AddFacilityComponent
                  ),        
            },
            {
                path: 'edit/:id',
                loadComponent: () =>
                  import('../facility/add-facility/add-facility.component').then(
                    (m) => m.AddFacilityComponent
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
export class FacilityRoutingModule {}