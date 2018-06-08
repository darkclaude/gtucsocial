import { AuthService } from './../../services/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Component, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireDatabase } from 'angularfire2/database';
import { CropperSettings } from 'ng2-img-cropper';
import * as firebase from 'firebase';
@Component({
  selector: 'fio-user-avatar-change',
  templateUrl: './user-avatar-change.component.html',
  styleUrls: ['./user-avatar-change.component.scss'],
})
export class UserAvatarChangeComponent{
  cropperSettings: CropperSettings;
  data:any;
  @ViewChild('cropper', undefined)
  cropper:any;
  constructor(
    private auth: AuthService,
    private afs:AngularFirestore,
    public activeModal: NgbActiveModal
  ) {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 100;
    this.cropperSettings.height = 100;
    this.cropperSettings.canvasWidth = 300;
    this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.rounded = true;
    this.cropperSettings.cropperClass = "cropperClass";
    this.cropperSettings.noFileInput = true;
    this.data = {};
  }
  fileChangeListener($event) {
    var image:any = new Image();
    var file:File = $event.target.files[0];
    var myReader:FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent:any) {
        image.src = loadEvent.target.result;
        that.cropper.setImage(image);
    };
    myReader.readAsDataURL(file);
  }
  uploadAvatar(){
    let userLocal = JSON.parse(localStorage.getItem("user"));
    let update_url = `user/${userLocal.uid}`;
    let ref = firebase.storage().ref().child(update_url);
    ref.putString(this.cropper.image.image, 'data_url').then((snapshot)=>{
      this.auth.updateDisplayNameAndPhotoURL(userLocal.username, snapshot.downloadURL);
      this.afs.doc(update_url).update({avatar:snapshot.downloadURL}).then(()=>{
        this.activeModal.close();
      });
    });
  }
}
