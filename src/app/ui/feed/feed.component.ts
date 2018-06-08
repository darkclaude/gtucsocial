// ANGULAR
import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnChanges, Input, HostBinding, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
// SERVICES
import { MainService } from './../../services/main.service';
@Component({
  selector: 'fio-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() modal;
  @Input() _id;
  @Input() created_by;
  @Input() modalOpen:boolean;
  @Input() deleteModal:boolean;
  @Input() innerReplies;
  @HostBinding("class.d-none") hideFeed:boolean=false;
  @HostBinding("class.modal-highlight") modalHighlight:boolean;
  @ViewChild("indicator") indicator:ElementRef;
  @ViewChild("media") mainElement:ElementRef;
  indecatorElemes = {
    height: "",
    color: ""
  }
  ngAfterViewInit(){
    if (this.mainElement){
      this.indecatorElemes.color = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
      this.indecatorElemes.height = this.mainElement.nativeElement.clientHeight + "px";
    }
  }
  constructor(
    private modalService: NgbModal,
    private afs: AngularFirestore,
    private mainService: MainService
  ){}
  ngOnInit(){
    this.modalHighlight = this.modal;
  }
  post;
  uid;
  loadingPost:boolean;
  ngOnChanges() {
    this.loadingPost = true;
    let user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.uid = user.uid;
    }
    if (this._id){
      this.mainService.getSinglePost(this._id)
        .then((res)=>{
          this.loadingPost = false;
          if (res.exists) {
            this.post = res.data();
          }else{
            this.hideFeed = true;
          }
        });
    }
  }

  deleteTopicConfirm(content){
    this.modalService.open(content).result.then((result) => {
      this.deleteTopic(result)
    });
  }
  deleteTopic(replyingTopicId){
    const _id = this._id; 
    this.afs.doc(`posts/${_id}`).set({deleted: true}).then(()=>{
      this.mainService.$deletedTopic.next(this._id);
    });
    if (replyingTopicId) {
      const url = `replies/${replyingTopicId}/data/${_id}`;
      this.afs.doc(url).delete();
      const urlReplies = `user/${this.uid}/replies/${_id}`;
      this.afs.doc(urlReplies).delete();
    }else{
      const url = `user/${this.uid}/posts/${_id}`;
      this.afs.doc(url).delete();
      this.afs.doc(`user/${this.uid}/feeds/${_id}`).delete();
    }
    if (this.post.images.length>0) {
      this.afs.doc(`user/${this.uid}/media/${_id}`).delete();
    }
    this.afs.doc(`user/${this.uid}/likes/${this._id}`).delete();
  }
  openTopicModal(id){
    this.mainService.openTopicModal(id);
  }
}
