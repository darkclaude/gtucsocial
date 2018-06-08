import { UIModule } from './../../ui/ui.module';
import { UserNotificationsComponents, UserNotificationsRoutingModule } from './user-notifications.route';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserNotificationsComponent } from './user-notifications.component';

@NgModule({
  imports: [
    CommonModule,
    UserNotificationsRoutingModule,
    UIModule
  ],
  declarations: [UserNotificationsComponents]
})
export class UserNotificationsModule { }
