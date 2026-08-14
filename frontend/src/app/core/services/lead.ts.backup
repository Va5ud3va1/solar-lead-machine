import { environment } from '../../../environments/environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type LeadStatus = 'NEW' | 'CONTACTED' | 'WON' | 'LOST';

export interface Lead {
  id: string;
  customer: string;
  email?: string | null;
  phone: string;
  city?: string | null;
  status: LeadStatus;
  assignedToId: string | null;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeadService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/leads`;

  getAllLeads(): Observable<Lead[]> {
    return this.http.get<Lead[]>(this.apiUrl);
  }

  searchLeads(search: string): Observable<Lead[]> {
    return this.http.get<Lead[]>(
     `${this.apiUrl}?search=${encodeURIComponent(search)}`
  );
}
  filterLeads(search: string, status: string) {
  return this.http.get<Lead[]>(
    `${this.apiUrl}?search=${encodeURIComponent(search)}&status=${status}`
  );
}

  getMyLeads(): Observable<Lead[]> {
    return this.http.get<Lead[]>(`${this.apiUrl}/my`);
  }

  getLeadById(id: string): Observable<Lead> {
    return this.http.get<Lead>(`${this.apiUrl}/${id}`);
  }

  createLead(lead: {
    customer: string;
    phone: string;
    email?: string | null;
    city?: string | null;
    status?: LeadStatus;
    assignedToId?: string | null;
  }): Observable<Lead> {
    const payload = {
      customer: lead.customer,
      phone: lead.phone,
      email: lead.email ?? null,
      city: lead.city ?? null,
      status: lead.status || 'NEW',
      assignedToId: lead.assignedToId ?? null
    };
    return this.http.post<Lead>(this.apiUrl, payload);
  }

  updateLeadStatus(id: string, status: LeadStatus): Observable<Lead> {
    return this.http.put<Lead>(`${this.apiUrl}/${id}/status`, { status });
  }

  updateLead(id: string, data: Partial<Lead>): Observable<Lead> {
    return this.http.put<Lead>(`${this.apiUrl}/${id}`, data);
  }

  deleteLead(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
