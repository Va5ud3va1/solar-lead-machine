import { Component, inject, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.css']
})
export class ToastComponent implements OnInit, OnDestroy {
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  toasts: Toast[] = [];

  ngOnInit(): void {
    this.toastService.toasts$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(toasts => {
      this.toasts = toasts;
      setTimeout(() => this.cdr.detectChanges(), 0);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  dismiss(toast: Toast): void {
    this.toastService.remove(toast.id);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  }
}
