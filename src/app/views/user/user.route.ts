import { UserPostsMediaComponent } from './user-posts-media/user-posts-media.component';
import { UserLikesViewComponent } from './user-likes-view/user-likes-view.component';
import { UserFollowersViewComponent } from './user-followers-view/user-followers-view.component';
import { UserFollowingViewComponent } from './user-following-view/user-following-view.component';
import { UserPostsRepliesComponent } from './user-posts-replies/user-posts-replies.component';
import { UserPostsViewComponent } from './user-posts-view/user-posts-view.component';
import { UserComponent } from './user.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  { 
    path: '', 
    component: UserComponent,
    children: [{
      path: '', 
      component: UserPostsViewComponent,
    },{
      path: 'replies', 
      component: UserPostsRepliesComponent,
    },{
      path: 'media', 
      component: UserPostsMediaComponent,
    },{
      path: 'likes', 
      component: UserLikesViewComponent,
    },{
      path: 'followers', 
      component: UserFollowersViewComponent,
    },{
      path: 'following', 
      component: UserFollowingViewComponent,
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NameRoutingModule { }

export const UserRouteComponents = [UserComponent];