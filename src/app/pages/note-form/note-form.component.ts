import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NoteCategory } from '../../models/note.model';
import { NotesService } from '../../services/notes.service';
import { GestureRecognitionComponent } from 'src/app/components/gesture-recognition/gesture-recognition.component';
import { GesturesService } from 'src/app/services/gestures.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink,GestureRecognitionComponent],
  templateUrl: './note-form.component.html',
  styleUrl: './note-form.component.css'
})
export class NoteFormComponent implements OnInit {
  readonly noteId = signal<string | null>(null);
  readonly isEditMode = computed(() => this.noteId() !== null);
  readonly submitted = signal(false);
     private readonly destroyRef = inject(DestroyRef);

  readonly noteForm = this.formBuilder.nonNullable.group({
    category: ['college' as NoteCategory, Validators.required],
    title: ['', [Validators.required, Validators.maxLength(80)]],
    contextName: ['', [Validators.required, Validators.maxLength(80)]],
    noteDate: [this.today(), Validators.required],
    content: ['', [Validators.required, Validators.minLength(3)]]
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly notesService: NotesService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
   
    private readonly gestureService: GesturesService
  ) {}

 ngOnInit(): void {
    this.gestureService.saveNoteRequested$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.saveNote();
      });

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    const note = this.notesService.getNoteById(id);

    if (!note) {
      this.router.navigateByUrl('/');
      return;
    }

    this.noteId.set(id);

    this.noteForm.patchValue({
      category: note.category,
      title: note.title,
      contextName: note.contextName,
      noteDate: note.noteDate,
      content: note.content
    });
  }

  
  saveNote(): void {
    this.submitted.set(true);

    if (this.noteForm.invalid) {
      this.noteForm.markAllAsTouched();
      return;
    }

    const formValue = this.noteForm.getRawValue();
    const id = this.noteId();

    if (id) {
      this.notesService.updateNote(id, formValue);
    } else {
      this.notesService.createNote(formValue);
    }

    this.router.navigateByUrl('/');
  }

  hasError(controlName: keyof typeof this.noteForm.controls): boolean {
    const control = this.noteForm.controls[controlName];
    return control.invalid && (control.touched || this.submitted());
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }

  // gesture:
  onGestureDetected(event: any) {
    let gesture = '';
    if (event === 'swipe-right') {
      gesture = 'swipe_right';
    }
    return gesture;

  }
}
