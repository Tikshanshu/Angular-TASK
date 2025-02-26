import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { StopsComponent } from './layout/stops/stops.component';
import { StopsPointComponent } from './layout/stops-point/stops-point.component';
import { CameraComponent } from './layout/camera/camera.component';
import { RoutePathsComponent } from './layout/route-paths/route-paths.component';
import { PatternComponent } from './layout/pattern/pattern.component';

export const routes: Routes = [
    {
        path: '',redirectTo:'login',pathMatch:'full'
    },
    {
        path: 'login',
        component:LoginComponent
    },
    {
        path:'home',
        component:HomeComponent,
        children: [
            { path:'stop',component:StopsComponent},
            {path:'stopspoint',component:StopsPointComponent},
            {path:'camera',component:CameraComponent},
            {
                path: 'route',component:RoutePathsComponent
            },
            {
                path:'pattern',component:PatternComponent
            }
        ]
    }
];
