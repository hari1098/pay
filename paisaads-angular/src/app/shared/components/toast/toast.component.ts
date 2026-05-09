import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      @for (toast of notification.toasts(); track toast.id) {
        <div
          class="flex items-start gap-3 p-4 rounded-lg shadow-lg border animate-slide-up"
          [class]="getToastClass(toast.type)"
        >
          <div class="flex-1">
            <p class="font-semibold text-sm">{{ toast.title }}</p>
            @if (toast.description) {
              <p class="text-xs mt-1 opacity-80">{{ toast.description }}</p>
            }
          </div>
          <button
            class="text-current opacity-50 hover:opacity-100 text-lg leading-none"
            (click)="notification.removeToast(toast.id)"
          >&times;</button>
        </div>
      }
    </div>
  `,
})
export class ToastComponent {
  readonly notification = inject(NotificationService);

  getToastClass(type: string): string {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  }
}
