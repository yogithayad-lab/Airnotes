import { Injectable, computed, signal } from '@angular/core';
import { Note } from '../models/note.model';

const STORAGE_KEY = 'airnotes_notes';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private readonly notesState = signal<Note[]>(this.loadNotes());

  readonly notes = this.notesState.asReadonly();
  readonly totalNotes = computed(() => this.notesState().length);
  readonly collegeNotes = computed(() =>
    this.notesState().filter((note) => note.category === 'college')
  );
  readonly jobNotes = computed(() =>
    this.notesState().filter((note) => note.category === 'job')
  );

  createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note {
    const now = new Date().toISOString();
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    };

    this.notesState.update((notes) => [newNote, ...notes]);
    this.persist();
    return newNote;
  }

  getNoteById(id: string): Note | undefined {
    return this.notesState().find((note) => note.id === id);
  }

  updateNote(
    id: string,
    changes: Partial<Omit<Note, 'id' | 'createdAt'>>
  ): boolean {
    let updated = false;

    this.notesState.update((notes) =>
      notes.map((note) => {
        if (note.id !== id) {
          return note;
        }

        updated = true;
        return {
          ...note,
          ...changes,
          updatedAt: new Date().toISOString()
        };
      })
    );

    if (updated) {
      this.persist();
    }

    return updated;
  }

  deleteNote(id: string): void {
    this.notesState.update((notes) => notes.filter((note) => note.id !== id));
    this.persist();
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notesState()));
  }

  private loadNotes(): Note[] {
    try {
      const storedNotes = localStorage.getItem(STORAGE_KEY);
      return storedNotes ? (JSON.parse(storedNotes) as Note[]) : [];
    } catch {
      return [];
    }
  }
}
