import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from './post.model';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PostFormComponent {
  @Input() post: Post | null = null;
  @Input() mode: 'create' | 'update' | 'view' = 'create';
  @Output() save = new EventEmitter<Post>();
  @Output() cancel = new EventEmitter<void>();

  form = signal<Post>({
    id: this.post?.id,          
    userId: this.post?.userId ?? 1,
    title: this.post?.title ?? '',
    body: this.post?.body ?? ''
  });

  errors = signal<{ [key: string]: string }>({});

  ngOnChanges() {
    if (this.post) {
      this.form.set({
        id: this.post.id,        
        userId: this.post.userId,
        title: this.post.title,
        body: this.post.body
      });
    }
  }

  validate(): boolean {
    const errors: { [key: string]: string } = {};
    const { userId, title, body } = this.form();
    if (!userId || isNaN(Number(userId))) {
      errors["userId"] = 'El userId es requerido y debe ser numérico';
    }
    if (!title || title.length < 3) {
      errors["title"] = 'El título es requerido (mínimo 3 caracteres)';
    } else if (title.length > 50) {
      errors["title"] = 'El título no puede superar 50 caracteres';
    }
    if (!body || body.length < 5) {
      errors["body"] = 'El cuerpo es requerido (mínimo 5 caracteres)';
    } else if (body.length > 2000) {
      errors["body"] = 'El cuerpo no puede superar 200 caracteres';
    }
    this.errors.set(errors);
    return Object.keys(errors).length === 0;
  }

  onSubmit() {
    if (this.validate()) {
      this.save.emit(this.form()); 
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
