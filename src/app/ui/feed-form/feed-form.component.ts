import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FeedFormService } from './feed-form.service';
import { map, uniq, remove, findIndex } from 'lodash';
import { POST } from './feed-form';
@Component({
  selector: 'fio-feed-form',
  templateUrl: './feed-form.component.html',
  styleUrls: ['./feed-form.component.scss'],
  providers: [FeedFormService]
})
export class FeedFormComponent implements OnInit, OnDestroy {
  @Input() userUID;
  localUser = JSON.parse(localStorage.getItem('user'));
  newPost:POST = new POST();
  posting:boolean;
  // Replying topic id
  @Input() replyingTopicId = '';

  // Selected images for input file selection
  selectedImages=[];

  // Subscribers
  selectedImages$;
  uploadedImages$;
  uploadedImagesProgress$;
  constructor(
    private feedFormService: FeedFormService,
  ){
    this.feedFormService.topicCreating$.subscribe(res=>{
      this.posting = res;
    });
    // Render selected input images
    this.selectedImages$ = feedFormService.selectedImages$.subscribe(res=>{
      this.selectedImages.unshift(res);
      this.selectedImages = uniq(this.selectedImages);
    });
    // Get uploaded image URLs
    this.uploadedImages$ = feedFormService.uploadedImages$.subscribe(imgUrls=>{
      this.newPost.images.push(imgUrls);
      if (this.selectedImages.length === 0) {
        this.resumeCreateNewPost(true);
      }
    });
    // Watch process of image uploading
    this.uploadedImagesProgress$ = feedFormService.uploadedImagesProgress$.subscribe(res=>{
      let index = findIndex(this.selectedImages, img=>img.fileName === res.fileName);
      this.selectedImages[index].progress = res.progress;
      if (this.selectedImages[index].progress === 100) {
        this.removeSelectedImage(this.selectedImages[index]);
      }
    });
  }

  ngOnInit() {}
  ngOnDestroy(){
    this.selectedImages$.unsubscribe();
    this.uploadedImages$.unsubscribe();
    this.uploadedImagesProgress$.unsubscribe();
  }

  // ---------- Image upload tasks
  previewFiles(ev) {
    this.feedFormService.renderImages(ev);
  }
  uploadImages(){
    this.feedFormService.uploadImages(this.selectedImages);
  }
  removeSelectedImage(img){
    remove(this.selectedImages, (imgs)=>{
      return imgs == img;
    });
  }
  // ---------- End: Image upload tasks


  // ---------- Create new topic tasks  
  createNewPost(){
    this.feedFormService.topicCreating$.next(true);
    if (this.selectedImages.length === 0) {
      this.resumeCreateNewPost();
    }else{
      this.uploadImages();
    }
  }
  resumeCreateNewPost(withMedia?){
    this.feedFormService.createTopic(this.newPost, this.replyingTopicId, withMedia);
    this.newPost = new POST();
  }
  // ---------- End: Create new topic tasks

}