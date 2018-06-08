// ANGULAR
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// ROUTER GUARDS
import { AuthGuard } from './guards/auth.guard';
// SHARED SERVICES
import { AuthService } from './services/auth.service';
import { MainService } from './services/main.service';
// MODAL COMPONENTS
import { ModalsModule } from './modals/modals.module';
// ROUTING
import { AppRoutingModule } from './app.route';
// BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// SHARED COMPONENTS
import { UIModule } from './ui/ui.module';
import { AppComponent } from './app.component';
// FIREBASE
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
// CONFIG
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ModalsModule,
    UIModule,
    NgbModule.forRoot(),
    AppRoutingModule,
  ],
  declarations: [AppComponent],
  providers: [AuthGuard, AuthService, MainService],
  bootstrap: [ AppComponent ]
})
export class AppModule {}