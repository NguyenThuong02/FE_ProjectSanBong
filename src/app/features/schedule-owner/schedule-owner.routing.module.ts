import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ScheduleOwnerComponent } from "./schedule-owner.component";

const routes: Routes = [
    {
        path:'',
        component: ScheduleOwnerComponent,
        children:[
            {
                path:'',
                redirectTo:'',
                pathMatch:'full',
            },
            {
                path: '',
                loadComponent: () =>
                  import('../schedule-owner/schedule-owner-list/schedule-owner-list.component').then(
                    (m) => m.ScheduleOwnerListComponent
                  ),        
            },
            {
                path: 'book/:id',
                loadComponent: () =>
                  import('../schedule-owner/schedule-owner-book/schedule-owner-book.component').then(
                    (m) => m.ScheduleOwnerBookComponent
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
export class SheduleOwnerRoutingModule {}