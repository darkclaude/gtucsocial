import { AngularFirestore } from 'angularfire2/firestore';
import { map, kebabCase } from 'lodash';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import * as moment from 'moment';

@Injectable()
export class UploadService {
    selectedImages$: Subject<any> = new Subject();
    uploadedImages$: Subject<any> = new Subject();
    uploadedImagesProgress$: Subject<any> = new Subject();
    uid;
    constructor(private afs: AngularFirestore){
        let user = JSON.parse(localStorage.getItem('user'));
        if (user) { 
          this.uid = user.uid;
        }
    }
    renderImages(ev){
        let that = this;
        let files = ev.target.files;
        function readAndPreview(file) {
          if ( /\.(jpe?g|png)$/i.test(file.name) ) {
            let reader = new FileReader();
            reader.addEventListener("load", function () {
              that.selectedImages$.next({
                fileName: kebabCase(file.name),
                src: this.result,
                progress: 0
              });
            }, false);
            reader.readAsDataURL(file);
          }
        }
        if (files) {
          [].forEach.call(files, readAndPreview);
        }
    }
    uploadImages(images){
        map(images,(file)=>{
            let update_url = `users/${this.uid}/${this.afs.createId()}`;
            let ref = firebase.storage().ref().child(update_url);
            let uploadTask = ref.putString(file.src, 'data_url');
            const id = this.afs.createId();
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot:any) =>  {
                // upload in progress
                let progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                this.uploadedImagesProgress$.next({
                fileName: file.fileName,
                progress,
                });
            },
            (error) => {
                console.log(error)
            },
            () => {
                this.uploadedImages$.next({id, uid: this.uid, imageURL: uploadTask.snapshot.downloadURL});
            });
        });
    }
}