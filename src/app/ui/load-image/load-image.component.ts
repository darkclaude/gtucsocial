import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'fio-load-image',
  templateUrl: './load-image.component.html',
  styleUrls: ['./load-image.component.scss']
})
export class LoadImageComponent implements OnChanges {
  @Input() _id;
  @Input() urlOpenDisable:boolean=false;
  constructor(
    private afs: AngularFirestore
  ){}
  src;
  ngOnChanges() {
    if (this._id) {
      this.afs.doc(`media/${this._id}`).valueChanges().take(1).subscribe((res:any)=>{
        if (res) {
          this.src = res.url; 
        }
      }) 
    }
  }

}
