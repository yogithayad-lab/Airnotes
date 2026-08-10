import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.css'
})
export class NoteCardComponent {
  @Input({ required: true }) note!: Note;
  @Output() deleteRequested = new EventEmitter<Note>();

  requestDelete(): void {
    this.deleteRequested.emit(this.note);
  }
}
