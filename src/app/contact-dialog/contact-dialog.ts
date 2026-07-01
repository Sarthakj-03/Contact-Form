import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-contact-dialog',
  standalone: false,
  templateUrl: './contact-dialog.html',
  styleUrls: ['./contact-dialog.css'],
})
export class ContactDialogComponent {
  @Input() data: any;
  @Input() successMessage: string = '';
  @Output() close = new EventEmitter<void>();
}