import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PriceManagerComponent } from "./price-manager.component";

const routes: Routes = [
    {
        path:'',
        component: PriceManagerComponent,
        children:[
            {
                path:'',
                redirectTo:'',
                pathMatch:'full',
            },
            {
                path: '',
                loadComponent: () =>
                  import('../price-manager/list-price/list-price.component').then(
                    (m) => m.ListPriceComponent
                  ),        
            },
            {
                path: 'add',
                loadComponent: () =>
                  import('../price-manager/add-price/add-price.component').then(
                    (m) => m.AddPriceComponent
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
export class PriceManagerRoutingModule {}