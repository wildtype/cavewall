import NoteList from './note_list.js';

class Application {
  constructor() {
    this.searchBox = document.getElementById('content__search');
    this.editBox = document.getElementById('content-main__editor');
    this.noteList = new NoteList();
  }

  main() {
    this.noteList.init();

    this.searchBox.addEventListener('keyup', (e) => {
      if (e.keyCode == 13) {
        this.editContent();
      } else {
        this.noteList.search(this.searchBox.value);
      }
    });
  }

  editContent() {
    let selectedNote = this.noteList.renderableNotes[0];

    this.editBox.value = `${selectedNote.title}\n\n${selectedNote.body}`;
    this.editBox.focus()
  }
}

document.addEventListener('DOMContentLoaded', () => { 
  let app = new Application();
  app.main();
});
