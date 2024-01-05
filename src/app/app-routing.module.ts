import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './components/home/home/home.component';
import { LoginComponent } from './components/home/login/login.component';
import { AdminComponent } from './components/home/admin/admin.component';
import { UserComponent } from './components/home/user/user.component';
import { AlbumscComponent } from './components/basic-components/albums/albumsc/albumsc.component';
import { TrackscComponent } from './components/basic-components/tracks/tracksc/tracksc.component';


const routes: Routes = [
   {
  path: '',
  component: HomeComponent,
  },
  {
  path: 'login',
  component: LoginComponent,
  },
    {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard]
    },

    { path: 'admin/album', component: AlbumscComponent },
    // { path: 'admin/album/:id', component: TrackscComponent },
    { path: 'admin/tracks', component: TrackscComponent },
    {
    // path: 'user',
    path: '',
    component: UserComponent,
    // canActivate: [AuthGuard]
    },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
