import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HistoryBookingComponent } from "./history-booking.component";

const routes: Routes = [
    {
        path:'',
        component: HistoryBookingComponent,
        children:[
            {
                path:'',
                redirectTo:'',
                pathMatch:'full',
            },
            {
                path: '',
                loadComponent: () =>
                  import('../history-booking/history-list/history-list.component').then(
                    (m) => m.HistoryListComponent
                  ),        
            },
            {
                path: ':id',
                loadComponent: () =>
                  import('../history-booking/history-detail/history-detail.component').then(
                    (m) => m.HistoryDetailComponent
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
export class HistoryBoookingRoutingModule {}