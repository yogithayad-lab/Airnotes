import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NoteFormComponent } from './pages/note-form/note-form.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    title: 'AirNotes'
  },
  {
    path: 'notes/new',
    component: NoteFormComponent,
    title: 'Create Note'
  },
  {
    path: 'notes/:id/edit',
    component: NoteFormComponent,
    title: 'Edit Note'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
