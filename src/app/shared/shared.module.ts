import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { SharedRoutingModule } from './shared-routing.module'
import { NotifyComponent } from './components/notify/notify.component'
import { InfoPageComponent } from './components/info-page/info-page.component'
import { HeaderComponent } from './components/header/header.component'
import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatMenuModule } from '@angular/material/menu'
import { MatButtonModule } from '@angular/material/button'

@NgModule({
  declarations: [NotifyComponent, InfoPageComponent, HeaderComponent],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
  ],
  exports: [NotifyComponent, HeaderComponent],
})
export class SharedModule {}
