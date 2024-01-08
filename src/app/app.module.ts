import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { AdminComponent } from "./components/home/admin/admin.component";
import { HomeComponent } from "./components/home/home/home.component";
import { LoginComponent } from "./components/home/login/login.component";
import { UserComponent } from "./components/home/user/user.component";
import { DialogAddComponent } from "./components/user-editor/dialog-add/dialog-add.component";
import { DialogDeleteComponent } from "./components/user-editor/dialog-delete/dialog-delete.component";
import { DialogEditComponent } from "./components/user-editor/dialog-edit/dialog-edit.component";
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { HttpClientModule } from "@angular/common/http";
import { MatButtonModule } from "@angular/material/button";
import { MatGridListModule } from "@angular/material/grid-list";
import { BaseServiceService } from "./service/base-service.service";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from "@angular/core";
// import { DialogEditWrapperComponent } from './components/student-editor/components/dialog-edit-wrapper/dialog-edit-wrapper.component';
import {MatInputModule} from '@angular/material/input';
import { SessionStorageService } from 'angular-web-storage';

import { AlbumscComponent } from './components/basic-components/albums/albumsc/albumsc.component';
import { TrackscComponent } from './components/basic-components/tracks/tracksc/tracksc.component';
import { OpenAlbumComponent } from './components/dialog/open-album/open-album/open-album.component';
import { DeleteComponentComponent } from './components/dialog/delete-component/delete-component/delete-component.component';
import { EditComponent } from './components/dialog/edit-component/edit/edit.component';
import { MatSelectModule } from "@angular/material/select";
import { AddTrackAlbumComponent } from './components/dialog/addTrackAlbum/add-track-album/add-track-album.component';
@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    UserComponent,
    DialogEditComponent,
    DialogDeleteComponent,
    DialogAddComponent,
    HomeComponent,
    LoginComponent,
    AlbumscComponent,
    TrackscComponent,
    OpenAlbumComponent,
    DeleteComponentComponent,
    EditComponent,
    AddTrackAlbumComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    HttpClientModule,
    MatButtonModule,
    MatGridListModule
  ],
  providers: [BaseServiceService, SessionStorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
