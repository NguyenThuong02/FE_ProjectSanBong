import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { EmailTemplateComponent } from "./email-template.component";


const routes: Routes = [
    {
        path:'',
        component: EmailTemplateComponent,
        children:[
            {
                path:'',
                redirectTo:'',
                pathMatch:'full',
            },
            {
                path: '',
                loadComponent: () =>
                  import('./email-template-list/email-template-list.component').then(
                    (m) => m.EmailTemplateListComponent
                  ),        
            },
            // {
            //     path: 'add',
            //     loadComponent: () =>
            //       import('./management-add/management-add.component').then(
            //         (m) => m.ManagementAddComponent
            //       ),        
            // },
            // {
            //     path: 'detail/:id',
            //     loadComponent: () =>
            //       import('./management-add/management-add.component').then(
            //         (m) => m.ManagementAddComponent
            //       ),        
            // },
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
export class EmailTemplateRoutingModule {}