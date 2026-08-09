import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeadService, LeadStatus } from '../../core/services/lead';

@Component({
  selector: 'app-get-quote',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './get-quote.html',
  styleUrl: './get-quote.css'
})
export class GetQuote {
  name = '';
  email = '';
  phone = '';
  city = '';
  interest = '';
  
  error = '';
  success = false;
  loading = false;

  constructor(
    private leadService: LeadService,
    private cdr: ChangeDetectorRef
  ) {}

  submitForm(): void {
    console.log('Form submitted with:', { name: this.name, email: this.email, phone: this.phone, city: this.city });
    
    this.error = '';
    this.success = false;
    this.loading = true;

    const newLead = {
      customer: this.name,
      email: this.email,
      phone: this.phone,
      city: this.city,
      status: 'NEW' as LeadStatus,
      assignedToId: null
    };

    this.leadService.createLead(newLead).subscribe({
      next: (response) => {
        console.log('✅ Lead created:', response);
        this.success = true;
        this.loading = false;
        this.cdr.detectChanges();
        this.resetForm();
      },
      error: (error) => {
        console.error('❌ Error:', error);
        this.error = error.error?.message || 'Failed to submit form';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  resetForm(): void {
    this.name = '';
    this.email = '';
    this.phone = '';
    this.city = '';
    this.interest = '';
  }
}
