import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { TodosRoutingModule } from './todos-routing.module'
import { TodosComponent } from './components/todos/todos.component'
import { TodoComponent } from './components/todos/todo/todo.component'
import { FormsModule } from '@angular/forms'
import { TasksComponent } from './components/todos/todo/tasks/tasks.component'
import { TaskComponent } from './components/todos/todo/tasks/task/task.component'
import { TodoFiltersComponent } from './components/todos/todo/todo-filters/todo-filters.component'
import { TodoFooterComponent } from './components/todos/todo/todo-footer/todo-footer.component'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatInputModule } from '@angular/material/input'

@NgModule({
  declarations: [
    TodosComponent,
    TodoComponent,
    TasksComponent,
    TaskComponent,
    TodoFiltersComponent,
    TodoFooterComponent,
  ],
  imports: [
    CommonModule,
    TodosRoutingModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
  ],
})
export class TodosModule {}
