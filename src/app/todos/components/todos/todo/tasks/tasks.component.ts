import { Component, Input, OnInit } from '@angular/core'
import { Observable, combineLatest, map } from 'rxjs'
import { TaskStatusEnum } from 'src/app/core/enums/taskStatus.enum'
import { Task, UpdateTaskModel } from 'src/app/todos/models/task.models'
import { TasksService } from 'src/app/todos/services/tasks.service'
import { TodosService } from 'src/app/todos/services/todos.service'

@Component({
  selector: 'tl-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  @Input() todoId!: string

  tasks$?: Observable<Task[]>
  taskTitle = ''
  isShowAllTasks = false
  numberOfTasks = 5
  buttonName = '...more'

  constructor(private tasksService: TasksService, private todosService: TodosService) {}

  ngOnInit() {
    // subscribe

    this.tasks$ = combineLatest([this.tasksService.tasks$, this.todosService.todos$]).pipe(
      map(res => {
        const todos = res[1]
        const activeTodo = todos.find(tl => tl.id === this.todoId)
        const tasks = res[0]
        let activeTasks = tasks[this.todoId]

        if (activeTodo?.filter === 'completed') {
          activeTasks = activeTasks.filter(t => t.status === TaskStatusEnum.completed)
        }
        if (activeTodo?.filter === 'active') {
          activeTasks = activeTasks.filter(t => t.status === TaskStatusEnum.active)
        }
        return activeTasks
      })
    )

    this.tasksService.getTasks(this.todoId)
  }

  addTaskHandler() {
    this.tasksService.addTask({ todoId: this.todoId, title: this.taskTitle })
    this.taskTitle = ''
  }

  removeTask(data: { todoId: string; taskId: string }) {
    this.tasksService.removeTask(data)
  }

  changeTask(data: { todoId: string; taskId: string; model: UpdateTaskModel }) {
    this.tasksService.updateTask(data)
  }

  isShowTasksHandle() {
    this.isShowAllTasks = !this.isShowAllTasks
    if (this.isShowAllTasks) {
      this.numberOfTasks = 10
      this.buttonName = '...less'
    } else {
      this.numberOfTasks = 5
      this.buttonName = '...more'
    }
  }
}
