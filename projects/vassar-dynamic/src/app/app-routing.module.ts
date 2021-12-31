import { NgModule } from "@angular/core";
import { RouterModule, Route } from '@angular/router';

// import {} from ""
const routes: Route[] = [
    // {
    //     path: 'rainfall',
    //     loadChildren: () => import("./modules/rainfall/rainfall.module").then(module => module.RainfallModule),
    //     data: {
    //       boardId: 1
    //     },
    //     // resolve: {
    //     //   boardData: BoardDataService
    //     // }
    //   },
    //   {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'rainfall'
    //   }
]
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}