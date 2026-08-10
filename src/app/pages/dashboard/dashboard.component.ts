import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NoteCardComponent } from '../../components/note-card/note-card.component';
import { Note, NoteCategory } from '../../models/note.model';
import { NotesService } from '../../services/notes.service';
import { GestureRecognitionComponent } from 'src/app/components/gesture-recognition/gesture-recognition.component';
import { CommonModule } from '@angular/common';

type CategoryFilter = 'all' | NoteCategory;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, RouterLink, NoteCardComponent,GestureRecognitionComponent,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  readonly searchTerm = signal('');
  readonly categoryFilter = signal<CategoryFilter>('all');
  readonly noteToDelete = signal<Note | null>(null);

  readonly filteredNotes = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const category = this.categoryFilter();

    return this.notesService.notes().filter((note) => {
      const matchesCategory = category === 'all' || note.category === category;
      const searchableText = `${note.title} ${note.contextName} ${note.content}`.toLowerCase();
      const matchesSearch = !query || searchableText.includes(query);
      return matchesCategory && matchesSearch;
    });
  });

  constructor(readonly notesService: NotesService) {}

  updateSearch(value: string): void {
    this.searchTerm.set(value);
  }

  setFilter(filter: CategoryFilter): void {
    this.categoryFilter.set(filter);
  }

  openDeleteDialog(note: Note): void {
    this.noteToDelete.set(note);
  }

  cancelDelete(): void {
    this.noteToDelete.set(null);
  }

  confirmDelete(): void {
    const note = this.noteToDelete();
    if (!note) {
      return;
    }

    this.notesService.deleteNote(note.id);
    this.noteToDelete.set(null);
  }

  showPopup = false;

openPopup() {
  this.showPopup = true;
}

closePopup() {
  this.showPopup = false;
}
}
