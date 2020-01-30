window.main = function() {
  let searchBox = document.getElementById('content__search');
  let editBox = document.getElementById('content-main__editor');
  let noteListElement = document.querySelector('#content-main__list ol');
  let notes = [];
  let renderableNotes = [];
  let activeNote = undefined;

  let editContent = function() {
    let selectedNote = renderableNotes[0];

    editBox.value = `${selectedNote.title}\n\n${selectedNote.content}`;
    editBox.focus()
  };

  let renderNoteList = function() {
    let noteListFragment = document.createDocumentFragment();

    renderableNotes.forEach((note) => {
      let noteItem = document.createElement('li');
      noteItem.dataset.title = note.title;
      noteItem.classList.add('content-main__list-item');

      noteItem.innerHTML = `<span class="content__title">${note.title}</span><span class="content__preview">${note.content}</span>`;

      noteListFragment.appendChild(noteItem);
    });

    noteListElement.innerHTML = '';
    noteListElement.appendChild(noteListFragment);
  };

  let filterNotes = function() {
    let term = searchBox.value;

    renderableNotes = notes.filter((note) => {
      return note.title.toLowerCase().includes(term.toLowerCase()); 
    });
  };

  let search = function(e) {
    filterNotes();
    renderNoteList();
  };

  let populateContent = function() {
    notes = JSON.parse(localStorage.getItem('notes'));
    renderableNotes = notes;
    renderNoteList();
  };

  populateContent();

  searchBox.addEventListener('keyup', function(e) {
    if (e.keyCode == 13) {
      editContent();
    } else {
      search();
    }
  });
};

document.addEventListener('DOMContentLoaded', window.main);
