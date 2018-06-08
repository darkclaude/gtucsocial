import { LandingPageRoutedComponents, LandingPageRoutingModule } from './landing-page.route';
import { UIModule } from './../../ui/ui.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnauthenticatedViewComponent } from './unauthenticated-view/unauthenticated-view.component';
import { AuthenticatedViewComponent } from './authenticated-view/authenticated-view.component';

@NgModule({
  imports: [
    CommonModule,
    UIModule,
    LandingPageRoutingModule
  ],
  declarations: [LandingPageRoutedComponents, UnauthenticatedViewComponent, AuthenticatedViewComponent]
})
export class LandingPageModule { }
