import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GesturesService {

  constructor() { }
private readonly saveNoteSubject = new Subject<void>();

  readonly saveNoteRequested$ = this.saveNoteSubject.asObservable();

  requestSaveNote(): void {
    this.saveNoteSubject.next();
  }
 
}
