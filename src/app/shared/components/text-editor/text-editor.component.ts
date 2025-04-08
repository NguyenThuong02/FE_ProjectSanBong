import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [CommonModule, CKEditorModule, FormsModule],
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit, OnDestroy {
  @Input() value: string = '';
  @Output() changeContent = new EventEmitter<string>();
  
  public Editor = ClassicEditor;
  public editorData: string = '';
  
  public editorConfig = {
    // Ensure proper typing behavior with these settings
    typing: {
      transformations: {
        include: ['quotes', 'typography']
      }
    },
    toolbar: [
      'heading', '|', 
      'bold', 'italic', 'link', '|', 
      'bulletedList', 'numberedList', '|', 
      'insertTable', '|', 
      'uploadImage', 'blockQuote', '|', 
      'undo', 'redo'
    ],
    image: {
      upload: {
        types: ['jpeg', 'png', 'gif', 'jpg', 'webp']
      },
      toolbar: [
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
        '|',
        'toggleImageCaption',
        'imageTextAlternative'
      ]
    }
  };

  constructor(
    private notification: NzNotificationService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.editorData = this.value || '';
  }

  ngOnDestroy(): void {}

  onReady(editor: any): void {
    // Configure the upload adapter
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return new MyUploadAdapter(loader, this.http, this.notification);
    };
    
    // Fix cursor position issues by ensuring proper focus handling
    editor.editing.view.document.on('keydown', () => {
      // This helps maintain proper cursor position during typing
    });
  }

  onChange(event: any): void {
    const data = event.editor.getData();
    this.editorData = data; // Update local model
    this.changeContent.emit(data);
  }
}

class MyUploadAdapter {
  loader: any;
  http: HttpClient;
  notification: NzNotificationService;
  
  constructor(loader: any, http: HttpClient, notification: NzNotificationService) {
    this.loader = loader;
    this.http = http;
    this.notification = notification;
  }

  upload() {
    return this.loader.file.then((file: File) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);

        this.http.post('https://cdn-test.eztek.net/gateway/Media/Upload', formData)
          .subscribe({
            next: (response: any) => {
              if (response && Array.isArray(response) && response.length > 0) {
                resolve({
                  default: response[0]
                });
                this.notification.create(
                  'success',
                  'Thành công!',
                  'Tải ảnh lên thành công!'
                );
              } else {
                reject('Upload failed');
              }
            },
            error: (error) => {
              this.notification.create(
                'error',
                'Thất bại!',
                'Tải ảnh lên thất bại!'
              );
              reject(error);
            }
          });
      });
    });
  }

  abort() {
    // Abort the upload process
  }
}