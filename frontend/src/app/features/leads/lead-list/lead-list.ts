import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanComponent } from '../kanban/kanban';

@Component({
  selector: 'app-lead-list',
  standalone: true,
  imports: [
    CommonModule,
    KanbanComponent
  ],
  templateUrl: './lead-list.html',
  styleUrl: './lead-list.css'
})
export class LeadList {

}
