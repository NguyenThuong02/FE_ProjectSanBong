import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { InfoContactComponent } from "./info-contact.component";

const routes: Routes = [
    {
        path:'',
        component: InfoContactComponent,
        children:[
            {
                path:'',
                redirectTo:'',
                pathMatch:'full',
            },
            // {
            //     path: '',
            //     loadComponent: () =>
            //       import('./my-info-view/my-info-view.component').then(
            //         (m) => m.MyInfoViewComponent
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
export class InfoContactRoutingModule {}