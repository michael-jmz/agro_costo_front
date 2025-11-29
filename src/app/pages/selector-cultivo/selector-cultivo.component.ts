import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'pages-selector-cultivo',
  imports: [RouterOutlet],
  templateUrl: './selector-cultivo.component.html',
  styleUrl: './selector-cultivo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SelectorCultivoComponent { }
