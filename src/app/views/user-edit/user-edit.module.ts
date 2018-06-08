import { UIModule } from './../../ui/ui.module';
import { UserEditRoutedComponents, UserEditRoutingModule } from './user-edit.route';
import { UserEditService } from './user-edit.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserEditComponent } from './user-edit.component';

@NgModule({
  imports: [
    CommonModule,
    UIModule,
    UserEditRoutingModule
  ],
  declarations: [UserEditRoutedComponents]
})
export class UserEditModule { }
