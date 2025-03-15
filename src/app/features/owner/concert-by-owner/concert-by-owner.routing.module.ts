import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ConcertByOwnerComponent } from "./concert-by-owner.component";

const routes: Routes = [
    {
        path:'',
        component: ConcertByOwnerComponent,
        children:[
            {
                path:'',
                redirectTo:'',
                pathMatch:'full',
            },
            {
                path: '',
                loadComponent: () =>
                  import('./concert-by-owner-list/concert-by-owner-list.component').then(
                    (m) => m.ConcertByOwnerListComponent
                  ),        
            },
            {
                path: 'add',
                loadComponent: () =>
                  import('../concert-by-owner/concert-by-owner-add/concert-by-owner-add.component').then(
                    (m) => m.ConcertByOwnerAddComponent
                  ),        
            },
            {
                path: 'edit/:id',
                loadComponent: () =>
                  import('../concert-by-owner/concert-by-owner-add/concert-by-owner-add.component').then(
                    (m) => m.ConcertByOwnerAddComponent
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
export class ConcertByOwnerRoutingModule {}