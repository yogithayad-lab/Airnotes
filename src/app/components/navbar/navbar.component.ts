import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GestureRecognitionComponent } from '../gesture-recognition/gesture-recognition.component';
import { GesturesService } from 'src/app/services/gestures.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, GestureRecognitionComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(
    private gestureService: GesturesService
  ) {}

  onSaveRequested(): void {
    this.gestureService.requestSaveNote();
  }
}
