import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FilterType } from 'src/app/todos/models/todos.models'

@Component({
  selector: 'tl-todo-filters',
  templateUrl: './todo-filters.component.html',
  styleUrls: ['./todo-filters.component.scss'],
})
export class TodoFiltersComponent {
  @Input() filter!: FilterType
  @Output() changeFilterEvent = new EventEmitter<FilterType>()

  changeFilterHandler(filter: FilterType) {
    this.changeFilterEvent.emit(filter)
  }
}
