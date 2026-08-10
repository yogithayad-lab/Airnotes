import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar />
    <main class="app-shell">
      <router-outlet />
    </main>
  `,
  styles: [`
    .app-shell {
      width: min(1220px, calc(100% - 44px));
      margin: 0 auto;
      padding: 24px 0 64px;
    }

    @media (max-width: 640px) {
      .app-shell {
        width: min(100% - 24px, 1220px);
        padding-top: 18px;
      }
    }
  `]
})
export class AppComponent {}
