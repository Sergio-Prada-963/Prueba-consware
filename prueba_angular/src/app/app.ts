import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from './posts/post.model';
import { PostFormComponent } from './posts/post-form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [CommonModule, PostFormComponent],
  standalone: true
})
export class App {
  protected readonly title = signal('Mi Título Centrado');
  protected readonly cards = signal<Post[]>([]);
  protected readonly showForm = signal(false);
  protected readonly formMode = signal<'create'|'update'|'view'>('create');
  protected readonly selectedPost = signal<Post|null>(null);

  showDeleteModal = signal(false);
  deleteId = signal<number|null>(null);

  constructor() {
    this.fetchCards();
  }

  trackById(index: number, card: Post) {
    return card.id;
  }

  async fetchCards() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
      const data = await response.json();
      this.cards.set(data);
    } catch {
      this.cards.set([]);
    }
  }

  onNewPost() {
    this.selectedPost.set(null);
    this.formMode.set('create');
    this.showForm.set(true);
  }

  async onSavePost(post: Post) {
    if (this.formMode() === 'update' && post.id) {
      await this.updatePost(post);
    } else if (this.formMode() === 'create') {
      await this.createPost(post);
    }
  }

  private async createPost(post: Post) {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      const data = await response.json();
      this.cards.set([data, ...this.cards()]);
      this.showForm.set(false);
    } catch {
      alert('Error al guardar el post');
    }
  }

  private async updatePost(post: Post) {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      const data = await response.json();
      this.cards.set(this.cards().map(c => c.id === data.id ? data : c));
      this.showForm.set(false);
    } catch {
      alert('Error al actualizar el post');
    }
  }

  onCancelForm() {
    this.showForm.set(false);
  }

  async onViewPost(card: Post) {
    await this.loadPost(card, 'view');
  }

  async onEditPost(card: Post) {
    await this.loadPost(card, 'update');
  }

  private async loadPost(card: Post, mode: 'view' | 'update') {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${card.id}`);
      if (!response.ok) throw new Error('No se pudo obtener el post');
      const data = await response.json();
      this.selectedPost.set(data);
    } catch {
      this.selectedPost.set(card);
    }
    this.formMode.set(mode);
    this.showForm.set(true);
  }

  onDeletePost(id: number) {
    this.deleteId.set(id);
    this.showDeleteModal.set(true);
  }

  async confirmDelete() {
    const id = this.deleteId();
    if (id == null) return;

    try {
      await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { method: 'DELETE' });
      this.cards.set(this.cards().filter(card => card.id !== id));
    } catch {
      alert('Error al eliminar el post');
    }

    this.showDeleteModal.set(false);
    this.deleteId.set(null);
  }

  cancelDelete() {
    this.showDeleteModal.set(false);
    this.deleteId.set(null);
  }
}
