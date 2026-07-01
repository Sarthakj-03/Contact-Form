import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

type ContactRecord = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submittedAt: string;
};

@Component({
  selector: 'app-contact-form',
  standalone: false,
  templateUrl: './contact-form.html',
  styleUrls: ['./contact-form.css'],
})
export class ContactFormComponent implements OnInit {
  contactForm!: FormGroup;

  submittedRecords: ContactRecord[] = [];

  dialogData: ContactRecord | null = null;

  successMessage: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3}$/),
        ],
      ],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: [
        '',
        [Validators.required, Validators.minLength(20), Validators.maxLength(500)],
      ],
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  get messageCount(): number {
    return this.f['message'].value?.length ?? 0;
  }

  submitForm(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const formValue = this.contactForm.value;

    const duplicateRecord = this.submittedRecords.some(
      (item) =>
        item.firstName === formValue.firstName &&
        item.lastName === formValue.lastName &&
        item.email === formValue.email &&
        item.phone === formValue.phone &&
        item.subject === formValue.subject &&
        item.message === formValue.message
    );

    if (duplicateRecord) {
      this.successMessage = 'This form is already saved.';
      this.dialogData = {
        ...formValue,
        submittedAt: this.submittedRecords.find(
          (item) =>
            item.firstName === formValue.firstName &&
            item.lastName === formValue.lastName &&
            item.email === formValue.email &&
            item.phone === formValue.phone &&
            item.subject === formValue.subject &&
            item.message === formValue.message
        )?.submittedAt || new Date().toLocaleString(),
      };
      return;
    }

    const record: ContactRecord = {
      ...formValue,
      submittedAt: new Date().toLocaleString(),
    };

    this.submittedRecords.unshift(record);
    this.dialogData = record;
    this.successMessage = 'Form has been saved.';
  }

  closeDialog(): void {
    this.dialogData = null;
    this.successMessage = '';
  }

  clearRecords(): void {
    if (!this.submittedRecords.length) {
      return;
    }

    const ok = window.confirm(
      "Clear all submitted records? The records can't be recalled"
    );

    if (!ok) {
      return;
    }

    this.submittedRecords = [];
    this.dialogData = null;
    this.successMessage = '';
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '').slice(0, 10);
    this.f['phone'].setValue(input.value, { emitEvent: false });
  }

  resetForm(): void {
    this.contactForm.reset();
  }
}