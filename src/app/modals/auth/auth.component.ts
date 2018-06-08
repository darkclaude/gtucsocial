import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  @Input() error;
  
  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit() {
  }

  closeModal(ev){
    if (ev) {
      this.activeModal.close();
    }
  }
}
