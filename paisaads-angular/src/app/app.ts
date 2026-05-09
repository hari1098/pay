import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastComponent],
  template: `
    <app-navbar />
    <div class="min-h-screen"><router-outlet /></div>
    <app-footer />
    <app-toast />
  `,
  styles: ``,
})
export class App {
  protected readonly title = 'PaisaAds';
}
