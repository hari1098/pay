import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _toasts = signal<ToastMessage[]>([]);
  readonly toasts = this._toasts.asReadonly();

  private addToast(type: ToastMessage['type'], title: string, description?: string, duration = 5000): void {
    const id = Date.now().toString();
    this._toasts.update(toasts => [...toasts, { id, type, title, description, duration }]);
    setTimeout(() => this.removeToast(id), duration);
  }

  removeToast(id: string): void {
    this._toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  success(title: string, description?: string): void {
    this.addToast('success', title, description);
  }

  error(title: string, description?: string): void {
    this.addToast('error', title, description);
  }

  info(title: string, description?: string): void {
    this.addToast('info', title, description);
  }

  warning(title: string, description?: string): void {
    this.addToast('warning', title, description);
  }
}
