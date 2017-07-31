import { BrowserModule, Title } from '@angular/platform-browser'
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { BbRestApiService } from './services/bb-rest-api.service'
import { ApiService } from './services/api.service'
import { KeysPipe } from './pipes/keys.pipe';
import { CourseComponent } from './components/course/course.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import { UserComponent } from './components/user/user.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserInventoryComponent } from './components/user-inventory/user-inventory.component'

@NgModule({
  declarations: [
    AppComponent,
    KeysPipe,
    CourseComponent,
    CourseDetailComponent,
    UserComponent,
    UserDetailComponent,
    UserInventoryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [Title, BbRestApiService, ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
