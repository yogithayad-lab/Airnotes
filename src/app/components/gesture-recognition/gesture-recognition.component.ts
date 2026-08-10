import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core';

import { Router } from '@angular/router';

import {
  FilesetResolver,
  GestureRecognizer
} from '@mediapipe/tasks-vision';

@Component({
  selector: 'app-gesture-recognition',
  standalone: true,
  imports: [],
  templateUrl: './gesture-recognition.component.html',
  styleUrl: './gesture-recognition.component.css'
})
export class GestureRecognitionComponent {
 @ViewChild('video')
  video!: ElementRef<HTMLVideoElement>;

  message = 'Gesture control is off';

  private recognizer!: GestureRecognizer;
  private noteOpened = false;
@Output() saveRequested = new EventEmitter<void>();
  constructor(private router: Router) {}

  async startGestureControl(): Promise<void> {
    this.message = 'Starting gesture control...';

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });

    this.video.nativeElement.srcObject = stream;
    await this.video.nativeElement.play();

    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
    );

    this.recognizer =
      await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/' +
            'gesture_recognizer/gesture_recognizer/float16/1/' +
            'gesture_recognizer.task'
        },
        runningMode: 'VIDEO'
      });

    this.message = 'Show gestures to control the app. Open palm to create a new note, swipe right to go back.';

    this.detectGesture();
  }
private lastGesture = '';
private lastGestureTime = 0;
private readonly gestureCooldown = 1500;

private previousY: number | null = null;
private readonly movementThreshold = 0.04;

private lastScrollTime = 0;
private readonly scrollCooldown = 500;

private detectGesture(): void {
  const result = this.recognizer.recognizeForVideo(
    this.video.nativeElement,
    performance.now()
  );

    const landmarks = result.landmarks?.[0];

  const gesture =
    result.gestures[0]?.[0]?.categoryName ?? '';

  const currentTime = Date.now();

  // Reset when the user lowers or changes their hand
  if (!gesture) {
    this.lastGesture = '';
  }

  const canTrigger =
    gesture !== this.lastGesture ||
    currentTime - this.lastGestureTime > this.gestureCooldown;

  if (gesture === 'Open_Palm' && canTrigger) {
    this.lastGesture = gesture;
    this.lastGestureTime = currentTime;
    this.noteOpened = true;

    this.message = 'Open palm detected';
    this.router.navigate(['/notes/new']);
  }

  else if (gesture === 'Thumb_Up' && canTrigger) {
    this.lastGesture = gesture;
    this.lastGestureTime = currentTime;

    this.message = 'Thumb up detected — saving note';
    this.saveRequested.emit();

    // Do not set noteOpened to false here.
    // The form may still be invalid.
  }

  else if (gesture === 'Closed_Fist' && canTrigger) {
    this.lastGesture = gesture;
    this.lastGestureTime = currentTime;
    this.noteOpened = false;

    this.message = 'closed fist detected - going back to home';
    this.router.navigate(['/']);
  }

  else if (gesture === 'Pointing_Up' && canTrigger) {
     this.message = 'Pointing up detected - going back to home';
     window.scrollBy({
          top: 350,
          behavior: 'smooth'
        });

    
    }

  // else if (gesture === 'Pointing_Up' && canTrigger) {
  //    this.message = 'Pointing up detected - going back to home';

  
  //    const currentY = landmarks[0].y; // Wrist

  //   if (this.previousY !== null) {

  //     const now = Date.now();

  //     if (
  //       currentY < this.previousY - this.movementThreshold &&
  //       now - this.lastScrollTime > this.scrollCooldown
  //     ) {

  //       this.message = 'Hand Up - Scroll Up';

  //       window.scrollBy({
  //         top: 350,
  //         behavior: 'smooth'
  //       });

  //       this.lastScrollTime = now;
  //     }
  //   }

  //   this.previousY = currentY;
  // } else {
  //   this.previousY = null;
  // }

  requestAnimationFrame(() => this.detectGesture());
}
    
}
