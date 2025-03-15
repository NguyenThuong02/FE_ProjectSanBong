import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ChangePasswordComponent } from "./change-password.component";

const routes: Routes = [
    {
        path:'',
        component: ChangePasswordComponent,
        children:[
            {
                path:'',
                redirectTo:'',
                pathMatch:'full',
            },
            {
                path: '',
                loadComponent: () =>
                  import('./change-password-view/change-password-view.component').then(
                    (m) => m.ChangePasswordViewComponent
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
export class ChangePasswordRoutingModule {}