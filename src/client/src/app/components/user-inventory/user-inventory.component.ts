import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ComponentRef,
  ViewChild } from '@angular/core'
import { UserSetting } from '../../models/user-setting'
import { UserInventory } from '../../models/user-inventory'
import { UserDetailComponent } from '../user-detail/user-detail.component'
import { ApiService } from '../../services/api.service'

@Component({
  selector: 'irsc-user-inventory',
  templateUrl: './user-inventory.component.html',
  styleUrls: ['./user-inventory.component.scss']
})
export class UserInventoryComponent implements OnInit, OnChanges {
  // @Input() userInventory: UserInventory[] = []
  @Input() userInventory: any = []
  private api: ApiService
  constructor(
    private apiService: ApiService
  ) {
    this.api = apiService
  }

  ngOnInit() {
    // console.log('UserInventoryComponent:', this.userInventory)
  }

  ngOnChanges(changes: SimpleChanges) {
    // for (let propName in changes) {
    //   let chng = changes[propName]
    //   let cur = JSON.stringify(chng.currentValue)
    //   let prev = JSON.stringify(chng.previousValue)
    //   console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`)
    // }
  }

  removeUserFromInventory(i: any, user: any) {
    this.api.removeUserFromInventory(this.userInventory._id, user).subscribe((result: any) => {
      this.userInventory.inventory.splice(i, 1)
      console.log('User removed', this.userInventory)
      console.log('UserInventory has been removed => ', result)
    })
  }

  destroyUserDetailCmp(event: any) {
    // console.log(event)
  }
}
