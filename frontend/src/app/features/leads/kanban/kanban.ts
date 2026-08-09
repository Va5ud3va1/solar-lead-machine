import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivityTimelineComponent } from "../../../components/activity-timeline/activity-timeline.component";
import { NoteFormComponent } from "../../../components/note-form/note-form.component";
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

import { LeadService, Lead, LeadStatus } from '../../../core/services/lead';
import { ToastService } from '../../../core/services/toast';
import { Auth } from '../../../core/services/auth';
import { Router } from '@angular/router';
import { ToastComponent } from '../../../shared/components/toast/toast';
import { ChartsComponent, ChartData } from '../../../shared/components/charts/charts';
import { AddLead } from '../add-lead/add-lead';

interface Column {
  id: string;
  title: string;
  status: LeadStatus;
  count: number;
  accentColor: string;
}

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [ActivityTimelineComponent, NoteFormComponent, CommonModule, DragDropModule, FormsModule, ToastComponent, ChartsComponent, AddLead],
  templateUrl: './kanban.html',
  styleUrls: ['./kanban.css'],
})
export class KanbanComponent implements OnInit, OnDestroy {

  leads: Lead[] = [];
  columns: Column[] = [];
  metrics = { totalLeads: 0, newLeads: 0, contacted: 0, won: 0 };
  loading = true;
  updating = false;
  error = '';
  searchText = '';
  selectedStatus = 'ALL';
  sortOption = 'NEWEST';
  currentPage = 1;
  pageSize = 10;
  drawerOpen = false;
  selectedLead: Lead | null = null;
  deleteModalOpen = false;
  leadToDelete: Lead | null = null;
  statusChartData: ChartData[] = [];

  addLeadOpen = false;
  leadToEdit: Lead | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private leadService: LeadService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit(): void { this.loadLeads(); }

  loadLeads(): void {
    this.loading = true;
    this.leadService.filterLeads(this.searchText, this.selectedStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Lead[]) => {
          this.leads = data;
          this.sortLeads();
          this.initializeColumns();
          this.updateMetrics();
          this.updateChartData();
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.error = 'Failed to load leads';
          this.toastService.error('Failed to load leads. Please try again.');
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  onSearch(): void { this.loadLeads(); }
  onSortChange(): void { this.sortLeads(); }

  private sortLeads(): void {
    switch (this.sortOption) {
      case 'NEWEST':
        this.leads.sort((a, b) => new Date(b.createdAt ?? '').getTime() - new Date(a.createdAt ?? '').getTime());
        break;
      case 'OLDEST':
        this.leads.sort((a, b) => new Date(a.createdAt ?? '').getTime() - new Date(b.createdAt ?? '').getTime());
        break;
      case 'NAME_ASC':
        this.leads.sort((a, b) => a.customer.localeCompare(b.customer));
        break;
      case 'NAME_DESC':
        this.leads.sort((a, b) => b.customer.localeCompare(a.customer));
        break;
    }
  }

  initializeColumns(): void {
    this.columns = [
      { id: 'new', title: 'New', status: 'NEW', count: 0, accentColor: '#00ff88' },
      { id: 'contacted', title: 'Contacted', status: 'CONTACTED', count: 0, accentColor: '#00d4ff' },
      { id: 'won', title: 'Won', status: 'WON', count: 0, accentColor: '#ffd700' },
      { id: 'lost', title: 'Lost', status: 'LOST', count: 0, accentColor: '#ff1744' },
    ];
    this.updateColumnCounts();
  }

  updateColumnCounts(): void {
    this.columns.forEach(col => {
      col.count = this.leads.filter(lead => lead.status === col.status).length;
    });
  }

  getLeadsByStatus(status: LeadStatus): Lead[] {
    return this.leads.filter(lead => lead.status === status);
  }

  updateMetrics(): void {
    this.metrics.totalLeads = this.leads.length;
    this.metrics.newLeads = this.leads.filter(l => l.status === 'NEW').length;
    this.metrics.contacted = this.leads.filter(l => l.status === 'CONTACTED').length;
    this.metrics.won = this.leads.filter(l => l.status === 'WON').length;
  }

  updateChartData(): void {
    this.statusChartData = [
      { label: 'New', value: this.metrics.newLeads, color: '#00ff88' },
      { label: 'Contacted', value: this.metrics.contacted, color: '#00d4ff' },
      { label: 'Won', value: this.metrics.won, color: '#ffd700' },
      { label: 'Lost', value: this.leads.filter(l => l.status === 'LOST').length, color: '#ff1744' },
    ];
  }

  openAddLead(): void {
    this.leadToEdit = null;
    this.addLeadOpen = true;
  }

  openEditLead(lead: Lead): void {
    this.leadToEdit = lead;
    this.addLeadOpen = true;
  }

  closeAddLead(): void {
    this.addLeadOpen = false;
    this.leadToEdit = null;
  }

  onLeadAdded(): void {
    this.toastService.success('Lead created successfully');
    this.loadLeads();
  }

  onLeadUpdated(): void {
    this.toastService.success('Lead updated successfully');
    this.loadLeads();
  }

  drop(event: CdkDragDrop<Lead[]>, newStatus: LeadStatus): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }

    const lead = event.previousContainer.data[event.previousIndex];
    if (!lead || lead.status === newStatus) return;

    this.updating = true;
    const previousStatus = lead.status;

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    lead.status = newStatus;
    this.updateColumnCounts();
    this.updateMetrics();
    this.updateChartData();
    this.cdr.detectChanges();

    this.leadService.updateLeadStatus(lead.id, newStatus).subscribe({
      next: (result) => {
        this.leads = this.leads.map(l => l.id === result.id ? result : l);
        this.updateColumnCounts();
        this.updateMetrics();
        this.updateChartData();
        this.updating = false;
        this.toastService.success(`Lead "${result.customer}" moved to ${newStatus}`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        lead.status = previousStatus;
        this.loadLeads();
        this.error = 'Failed to update status';
        this.toastService.error(`Failed to move "${lead.customer}" to ${newStatus}. Reverted.`);
        this.updating = false;
        this.cdr.detectChanges();
      }
    });
  }

  openLead(lead: Lead): void { this.selectedLead = lead; this.drawerOpen = true; }
  closeDrawer(): void { this.drawerOpen = false; this.selectedLead = null; }

  confirmDelete(lead: Lead): void { this.leadToDelete = lead; this.deleteModalOpen = true; }
  cancelDelete(): void { this.deleteModalOpen = false; this.leadToDelete = null; }

  deleteLead(): void {
    if (!this.leadToDelete) return;
    const deletedLeadName = this.leadToDelete.customer;

    this.leadService.deleteLead(this.leadToDelete.id).subscribe({
      next: () => {
        this.leads = this.leads.filter(l => l.id !== this.leadToDelete!.id);
        this.updateColumnCounts();
        this.updateMetrics();
        this.updateChartData();
        this.cancelDelete();
        this.toastService.success(`Lead "${deletedLeadName}" deleted successfully`);
      },
      error: err => {
        console.error(err);
        this.error = 'Failed to delete lead';
        this.toastService.error(`Failed to delete "${deletedLeadName}". Please try again.`);
        this.cancelDelete();
      }
    });
  }

  logout(): void {
    this.auth.logout();
    this.toastService.info('Logged out successfully');
    this.router.navigate(['/login']);
  }

  get totalPages(): number { return Math.max(1, Math.ceil(this.leads.length / this.pageSize)); }
  get paginatedLeads(): Lead[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.leads.slice(start, start + this.pageSize);
  }
  previousPage(): void { if (this.currentPage > 1) this.currentPage--; }
  nextPage(): void { if (this.currentPage < this.totalPages) this.currentPage++; }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
