export type NoteCategory = 'college' | 'job';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  contextName: string;
  noteDate: string;
  createdAt: string;
  updatedAt: string;
}
