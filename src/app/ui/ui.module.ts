import { NotificationFeedComponent } from './notification-feed/notification-feed.component';
import { FeedLikedUsersComponent } from './feed-liked-users/feed-liked-users.component';
import { UsernameComponent } from './username/username.component';
import { LoadImageComponent } from './load-image/load-image.component';
import { FeedRepliesComponent } from './feed-replies/feed-replies.component';
import { FeedModalComponent } from './feed-modal/feed-modal.component';
import { UserFollowButtonComponent } from './user-follow-button/user-follow-button.component';
import { BtnLikeComponent } from './btn-like/btn-like.component';
import { FeedComponent } from './feed/feed.component';
import { FeedFormComponent } from './feed-form/feed-form.component';
import { UserPresenceComponent } from './user-presence/user-presence.component';
import { UserProfileEditComponent } from './user-profile-edit/user-profile-edit.component';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { AlertsComponent } from './alerts/alerts.component';
import { UsernameUniqueComponent } from './username-unique/username-unique.component';
import { UserRegisterFormComponent } from './user-register-form/user-register-form.component';
import { UserLoginFormComponent } from './user-login-form/user-login-form.component';
import { UserLinksComponent } from './user-links/user-links.component';
import { UserFeedComponent } from './user-feed/user-feed.component';
import { UserNavComponent } from './user-nav/user-nav.component';
import { UserCoverComponent } from './user-cover/user-cover.component';
import { UserMediaComponent } from './user-media/user-media.component';
import { UserFollowersComponent } from './user-followers/user-followers.component';
import { UserInfoComponent } from './user-info/user-info.component';
// MAIN
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
// ROUTES
import { RouterModule } from '@angular/router';
// FORMS
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
// BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// NGRX Scroll
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// PIPES
import { NgPipesModule } from 'ngx-pipes';
// MOMENTJS
import { MomentModule } from 'angular2-moment';
// COMPONENTS
import { MainNavbarComponent } from './main-navbar/main-navbar.component';
import { SearchComponent } from './search/search.component';

// EXPORT&IMPORT COMPONENTS
const components = [
  // Comment out component which you don't use
  MainNavbarComponent,
  SearchComponent,
  UserInfoComponent,
  UserFollowersComponent,
  UserMediaComponent,
  UserLinksComponent,
  UserCoverComponent,
  UserNavComponent,
  UserFeedComponent,
  UserLoginFormComponent,
  UserRegisterFormComponent,
  UsernameUniqueComponent,
  UserAvatarComponent,
  UserProfileEditComponent,
  UserPresenceComponent,
  FeedFormComponent,
  FeedComponent,
  BtnLikeComponent,
  UserFollowButtonComponent,
  FeedModalComponent,
  FeedRepliesComponent,
  LoadImageComponent,
  UsernameComponent,
  FeedLikedUsersComponent,
  NotificationFeedComponent,
  AlertsComponent
]

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    InfiniteScrollModule,
    NgbModule,
    MomentModule,
    NgPipesModule,
  ],
  exports: [
    NgPipesModule,
    NgbModule,
    FormsModule,
    InfiniteScrollModule,
    ...components
  ],
  declarations: components
})
export class UIModule { }
