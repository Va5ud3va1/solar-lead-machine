import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivityService } from '../../services/activity.service';

@Component({ selector: 'app-note-form', standalone: true, imports: [CommonModule, FormsModule], template: `
<div class="note-form"><h3>Add Note</h3>
<div class="error-msg" *ngIf="error"><span>⚠️ {{error}}</span><button (click)="error=null">✕</button></div>
<div class="wrap" [class.err]="hasError"><textarea [(ngModel)]="noteContent" placeholder="Write a note..." rows="3" [disabled]="loading" (input)="validate()" maxlength="1000"></textarea>
<div class="counter" [class.over]="noteContent.length>max">{{noteContent.length}}/{{max}}<span *ngIf="noteContent.length>max"> ({{noteContent.length-max}} over)</span></div></div>
<div class="hints"><span [class.ok]="noteContent.trim().length>0">{{noteContent.trim().length>0?'✓':'○'}} Required</span><span [class.ok]="noteContent.length<=max">{{noteContent.length<=max?'✓':'✗'}} Max {{max}}</span></div>
<div class="actions"><button (click)="submit()" [disabled]="!valid()||loading">{{loading?'Adding...':'Add Note'}}</button></div></div>
`, styles: [`.note-form{padding:16px;background:rgba(30,41,59,0.5);border-radius:12px;margin-top:16px}h3{margin:0 0 12px;color:#e2e8f0}.error-msg{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:rgba(239,68,68,0.15);border-radius:6px;margin-bottom:10px;color:#fca5a5;font-size:.85rem}.error-msg button{background:none;border:none;color:#fca5a5;cursor:pointer}textarea{width:100%;padding:10px;border:1px solid #334155;border-radius:8px;background:#1e293b;color:#e2e8f0;resize:vertical}.wrap.err textarea{border-color:#ef4444}.counter{text-align:right;font-size:.75rem;color:#64748b;margin-top:4px}.counter.over{color:#ef4444;font-weight:600}.hints{display:flex;gap:12px;margin-top:8px;font-size:.75rem;color:#64748b}.hints span{transition:color .2s}.hints .ok{color:#10b981}.actions{margin-top:12px;display:flex;justify-content:flex-end}button{padding:8px 18px;background:#06b6d4;color:#000;border:none;border-radius:6px;font-weight:600;cursor:pointer}button:disabled{opacity:.5;cursor:not-allowed}`] })
export class NoteFormComponent {
  @Input() leadId!: string; @Output() added = new EventEmitter<void>();
  noteContent = ''; loading = false; error: string|null = null; hasError = false; max = 1000;
  constructor(private svc: ActivityService) {}
  validate() { this.hasError = false; this.error = null; if (this.noteContent.length > this.max) { this.hasError = true; this.error = `Max ${this.max} chars`; } }
  valid() { const t = this.noteContent.trim(); return t.length > 0 && t.length <= this.max; }
  submit() {
    if (!this.valid()) return;
    this.loading = true; this.error = null;
    this.svc.addNote(this.leadId, this.noteContent.trim()).subscribe({
      next: () => { this.noteContent = ''; this.loading = false; this.added.emit(); },
      error: (err) => { console.error(err); this.error = err.error?.message || 'Failed to add note'; this.loading = false; }
    });
  }
}
