import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ListFieldsComponent } from "./list-fields.component";

const routes: Routes = [
    {
        path:'',
        component: ListFieldsComponent,
        children:[
            // {
            //     path:'',
            //     redirectTo:'list',
            //     pathMatch:'full',
            // },
        ],
    },
];

@NgModule({
    imports:[RouterModule.forChild(routes), TranslateModule],
    exports:[RouterModule],
})
export class ListFieldsRoutingModule {}