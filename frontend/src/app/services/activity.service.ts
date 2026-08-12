import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Activity { id: string; type: string; details: string|null; leadId: string; userId: string; createdAt: string; user: { id: string; name: string; email: string; role: string; }; }
export interface Note { id: string; content: string; leadId: string; userId: string; createdAt: string; user: { id: string; name: string; email: string; }; }

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private apiUrl = `${environment.apiUrl}/leads`;
  constructor(private http: HttpClient) {}
  getActivities(leadId: string): Observable<Activity[]> { return this.http.get<Activity[]>(`${this.apiUrl}/${leadId}?_t=${Date.now()}`); }
  getNotes(leadId: string): Observable<Note[]> { return this.http.get<Note[]>(`${this.apiUrl}/${leadId}/notes?_t=${Date.now()}`); }
  addNote(leadId: string, content: string): Observable<Note> { return this.http.post<Note>(`${this.apiUrl}/${leadId}/notes`, { content }); }
}
