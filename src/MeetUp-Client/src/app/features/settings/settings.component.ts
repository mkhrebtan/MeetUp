import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Card} from 'primeng/card';
import {InputText} from 'primeng/inputtext';
import {Select} from 'primeng/select';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Card,
    InputText,
    Select,
    Button
  ]
})
export class SettingsComponent {
}
