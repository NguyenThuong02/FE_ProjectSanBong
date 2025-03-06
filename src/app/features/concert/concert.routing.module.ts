import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ConcertComponent } from "./concert.component";

const routes: Routes = [
    {
        path:'',
        component: ConcertComponent,
        children:[
            {
                path:'',
                redirectTo:'list',
                pathMatch:'full',
            },
            {
                path: 'list',
                loadComponent: () =>
                  import('../concert/concert-list/concert-list.component').then(
                    (m) => m.ConcertListComponent
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
export class ConcertRoutingModule {}