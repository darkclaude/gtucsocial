import { UIModule } from './../../ui/ui.module';
import { NameRoutingModule, UserRouteComponents } from './user.route';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { UserPostsViewComponent } from './user-posts-view/user-posts-view.component';
import { UserPostsRepliesComponent } from './user-posts-replies/user-posts-replies.component';
import { UserPostsMediaComponent } from './user-posts-media/user-posts-media.component';
import { UserFollowersViewComponent } from './user-followers-view/user-followers-view.component';
import { UserFollowingViewComponent } from './user-following-view/user-following-view.component';
import { UserLikesViewComponent } from './user-likes-view/user-likes-view.component';

@NgModule({
  imports: [
    CommonModule,
    UIModule,
    NameRoutingModule
  ],
  declarations: [UserRouteComponents, UserPostsViewComponent, UserPostsRepliesComponent, UserPostsMediaComponent, UserFollowersViewComponent, UserFollowingViewComponent, UserLikesViewComponent]
})
export class UserModule { }
