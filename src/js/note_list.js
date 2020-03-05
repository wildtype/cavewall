import RenderableNote from './renderable_note';
import Hashids from 'hashids';

export default class NoteList {
  constructor() {
    this.noteListElement = document.querySelector(
      '#content-main__list ol'
    );
    this.storedNotes = [];
    this.allNotes = [];
    this.renderableNotes = [];
    this.activeNote = undefined;
    this.hashids = new Hashids('cavewall');
  }

  init() {
    this.populateContent();
    this.render();
  }

  populateContent() {
    this.storedNotes = JSON.parse(localStorage.getItem('notes'));

    this.allNotes = Object.keys(this.storedNotes).map((key) => {
      return new RenderableNote(key, this.storedNotes[key]);
    });

    this.renderableNotes = this.allNotes;
  }

  saveToStorage() {
    this.storedNotes[this.activeNote.key] = this.activeNote.properties;
    localStorage.setItem('notes', JSON.stringify(this.storedNotes));
  }

  appendNewNote(title) {
    const key = this.hashids.encode(Date.now());
    const time = new Date();
    const noteData = {
      title: title,
      body: '',
      created_at: time.toISOString(),
      updated_at: time.toISOString()
    };

    const newNote = new RenderableNote(key, noteData);
    this.allNotes.push(newNote);
    this.activeNote = newNote;
  }


  render() {
    let noteListFragment = document.createDocumentFragment();

    this.renderableNotes.forEach((note) => {
      noteListFragment.appendChild(note.render());
    });

    this.noteListElement.innerHTML = '';
    this.noteListElement.appendChild(noteListFragment);
  }

  search(term) {
    this.renderableNotes = this.allNotes.filter((note) => {
      return note.title.toLowerCase().includes(term.toLowerCase());
    });

    this.render();
  }
}
