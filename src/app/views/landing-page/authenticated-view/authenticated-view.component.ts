import { Router } from '@angular/router';
import { Component, OnChanges, Input, OnDestroy } from '@angular/core';
import { MainService } from './../../../services/main.service';
@Component({
  selector: 'fio-authenticated-view',
  templateUrl: './authenticated-view.component.html',
  styleUrls: ['./authenticated-view.component.scss'],
})
export class AuthenticatedViewComponent implements OnChanges{
  @Input() userLocal;
  trendingNews = [];
  URL:string;
  lastUserUID;
  constructor(
    private route: Router,
    private mainService: MainService
  ){
    mainService.getTrendingTopics().then((collection)=>{
      collection.forEach(doc=>{
        let data = doc.data();
        data.id = doc.id;
        this.trendingNews.push(data);
      });
    });
  }
  ngOnChanges(){
    if (this.userLocal.uid!==this.lastUserUID) {
      this.lastUserUID = this.userLocal.uid;
      this.URL = `user/${this.userLocal.uid}/feeds`;
    }
  }
  gotoEditProfile(url){
    this.route.navigate([url]);
  }
  openTopic(id){
    this.mainService.openTopicModal(id);
  }
}