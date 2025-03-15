import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ListFieldsComponent } from "./list-fields.component";

const routes: Routes = [
    {
        path:'',
        component: ListFieldsComponent,
        children:[
            {
                path:'',
                redirectTo:'',
                pathMatch:'full',
            },
            {
                path: '',
                loadComponent: () =>
                  import('./fields-list/fields-list.component').then(
                    (m) => m.FieldsListComponent
                  ),        
            },
            {
                path: 'detail/:id',
                loadComponent: () =>
                  import('./fields-detail/fields-detail.component').then(
                    (m) => m.FieldsDetailComponent
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
    imports:[RouterModule.forChild(routes), TranslateModule],
    exports:[RouterModule],
})
export class ListFieldsRoutingModule {}