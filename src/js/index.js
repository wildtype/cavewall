import NoteList from './note_list';

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
        this.editOrNewContent();
      } else {
        this.noteList.search(this.searchBox.value);
      }
    });
  }

  editOrNewContent() {
    let selectedNote = this.noteList.renderableNotes[0];

    if (selectedNote) {
      this.noteList.activeNote = selectedNote;
      this.editBox.value = `${selectedNote.title}\n\n${selectedNote.body}`;
      this.editBox.focus()
    } else {
      const newTitle = this.searchBox.value;

      this.editBox.value = `${newTitle}\n\n`;
      this.editBox.focus();
      this.searchBox.value = '';

      this.noteList.appendNewNote(newTitle);
      this.noteList.search('');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => { 
  let app = new Application();
  app.main();
});
