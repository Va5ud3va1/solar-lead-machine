import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeadService, LeadStatus, Lead } from '../../../core/services/lead';

@Component({
  selector: 'app-add-lead',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-lead.html',
  styleUrl: './add-lead.css'
})
export class AddLead implements OnInit {
  @Input() leadToEdit: Lead | null = null;
  @Output() leadAdded = new EventEmitter<void>();
  @Output() leadUpdated = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  customer = '';
  phone = '';
  email = '';
  city = '';
  status: LeadStatus = 'NEW';
  error = '';
  loading = false;

  statuses: LeadStatus[] = ['NEW', 'CONTACTED', 'WON', 'LOST'];

  get isEdit(): boolean { return !!this.leadToEdit; }
  get modalTitle(): string { return this.isEdit ? 'Edit Lead' : 'Add New Lead'; }
  get submitLabel(): string { return this.loading ? 'Saving...' : (this.isEdit ? 'Update Lead' : 'Add Lead'); }

  constructor(private leadService: LeadService) {}

  ngOnInit(): void {
    if (this.leadToEdit) {
      this.customer = this.leadToEdit.customer;
      this.phone = this.leadToEdit.phone;
      this.email = this.leadToEdit.email || '';
      this.city = this.leadToEdit.city || '';
      this.status = this.leadToEdit.status;
    }
  }

  saveLead(): void {
    this.error = '';
    this.loading = true;
    const leadData = { customer: this.customer, phone: this.phone, email: this.email || null, city: this.city || null, status: this.status, assignedToId: null };
    if (this.isEdit && this.leadToEdit) {
      this.leadService.updateLead(this.leadToEdit.id, leadData).subscribe({
        next: (response) => { this.loading = false; this.leadUpdated.emit(); this.close(); },
        error: (error) => { this.error = error.error?.message || 'Failed to update lead'; this.loading = false; }
      });
    } else {
      this.leadService.createLead(leadData).subscribe({
        next: (response) => { this.loading = false; this.leadAdded.emit(); this.close(); },
        error: (error) => { this.error = error.error?.message || 'Failed to create lead'; this.loading = false; }
      });
    }
  }

  close(): void { this.closed.emit(); }
}
