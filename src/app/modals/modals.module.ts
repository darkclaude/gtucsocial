import { UIModule } from './../ui/ui.module';
import { ImageCropperComponent, ImageCropperModule } from 'ng2-img-cropper';
import { UserAvatarChangeComponent } from './user-avatar-change/user-avatar-change.component';
import { ModalFeedComponent } from './modal-feed/modal-feed.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserEditComponent } from './user-edit/user-edit.component';
import { ChatComponent } from './chat/chat.component';
import { AuthComponent } from './auth/auth.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const modalsComponents = [
  AuthComponent,
  ChatComponent,
  UserEditComponent,
  ModalFeedComponent,
  // ImageCropperComponent,
  UserAvatarChangeComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ImageCropperModule,
    NgbModule,
    UIModule
  ],
  exports: [
    ...modalsComponents
  ],
  entryComponents: [
    UserEditComponent,
    AuthComponent,
    ModalFeedComponent,
    UserAvatarChangeComponent
  ],
  declarations: [...modalsComponents]
})
export class ModalsModule { }
