import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-list-fields',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './list-fields.component.html',
  styleUrl: './list-fields.component.scss'
})
export class ListFieldsComponent {
 
}
