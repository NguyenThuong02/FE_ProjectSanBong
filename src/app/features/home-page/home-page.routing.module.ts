import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { HomePageComponent } from "./home-page.component";

const routes: Routes = [
    {
        path:'',
        component: HomePageComponent,
        children:[
            {
                path:'',
                redirectTo:'list',
                pathMatch:'full',
            },
        ],
    },
];

@NgModule({
    imports:[RouterModule.forChild(routes), TranslateModule],
    exports:[RouterModule],
})
export class HomePageRoutingModule {}