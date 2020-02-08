export default class RenderableNote {
  constructor(key, noteData) {
    this.key = key;
    this.noteData = noteData;
    this.body = noteData.body;
    this.title = noteData.title;
    this.createdAt = noteData.created_at;
    this.updatedAt = noteData.updated_at;
  }

  render() {
    let noteItem = document.createElement('li');
    noteItem.dataset.title = this.title;
    noteItem.classList.add('content-main__list-item');

    noteItem.innerHTML = `
      <span class="content__title">${this.title}</span>
      <span class="content__preview">${this.body}</span>
    `;

    return noteItem;
  }
}
