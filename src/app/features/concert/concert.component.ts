import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-concert',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './concert.component.html',
  styleUrl: './concert.component.scss'
})
export class ConcertComponent {

}
