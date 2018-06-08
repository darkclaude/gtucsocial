import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnChanges } from '@angular/core';
@Component({
  selector: 'fio-modal-feed',
  templateUrl: './modal-feed.component.html',
  styleUrls: ['./modal-feed.component.scss']
})
export class ModalFeedComponent implements OnChanges{
  @Input() _id;
  constructor(
    private modalService: NgbActiveModal
  ){}
  ngOnChanges(){}
}

