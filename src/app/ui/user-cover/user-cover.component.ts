import { AuthService } from './../../services/auth.service';
import { UploadService } from './../../services/upload.service';
import { Component, Input} from '@angular/core';
@Component({
  selector: 'fio-user-cover',
  templateUrl: './user-cover.component.html',
  styleUrls: ['./user-cover.component.scss'],
  providers: [UploadService]
})
export class UserCoverComponent{
  @Input() edit:boolean=true;;
  @Input() url:string;
  selectedImages=[];

  // Subscribers
  selectedImages$;
  uploadedImages$;
  uploadedImagesProgress$;
  constructor(
    private auth: AuthService,
    private uploadService: UploadService,
  ){
    // Render selected input images
    this.selectedImages$ = uploadService.selectedImages$.subscribe(res=>{
      this.selectedImages[0] = res;
    });
    // Get uploaded image URLs
    this.uploadedImages$ = uploadService.uploadedImages$.subscribe(data=>{
      auth.updateUserInfo(data.uid, {
        coverImageURL: data.imageURL
      })
      if (this.selectedImages.length === 0) {
      }
    });
    // Watch process of image uploading
    this.uploadedImagesProgress$ = uploadService.uploadedImagesProgress$.subscribe(res=>{
      this.selectedImages[0].progress = res.progress;
      if (this.selectedImages[0].progress === 100) {
        this.selectedImages = [];
      }
    });
  }
  previewFiles(ev) {
    this.uploadService.renderImages(ev);
  }
  uploadImages(){
    this.uploadService.uploadImages(this.selectedImages);
  }
}
