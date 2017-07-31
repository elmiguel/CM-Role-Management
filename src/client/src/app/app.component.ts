import { Component, Input, OnInit, Renderer2, ElementRef, OnChanges, SimpleChanges } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { BbRestApiService } from './services/bb-rest-api.service'
import { ApiService } from './services/api.service'
import { User } from './models/user'
import { UserSetting } from './models/user-setting'
import { UserInventory } from './models/user-inventory'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private nativeElement: any
  private bbApi: BbRestApiService
  private api: ApiService
  user: any
  title = 'app works!'
  users: User[] = []
  showUsers: boolean = false
  searchTerm: string = ''
  // userInventory: UserSetting[] = []
  userInventory: any
  courses = [
    {
      "username": "skenanya",
      "courses": [
        { "courseId": "ENC1101", "sectionId": "234523", "editMode": false },
        { "courseId": "ENC1101", "sectionId": "234234", "editMode": false },
        { "courseId": "ENC1101", "sectionId": "553548", "editMode": false },
      ]
    },
    {
      "username": "bkalev",
      "courses": [
        { "courseId": "ENC1101", "sectionId": "234523", "editMode": false },
        { "courseId": "ENC1101", "sectionId": "234234", "editMode": false },
        { "courseId": "ENC1101", "sectionId": "553548", "editMode": false },
      ]
    },
    {
      "username": "kchip",
      "courses": [
        { "courseId": "ENC1101", "sectionId": "234523", "editMode": true },
        { "courseId": "ENC1101", "sectionId": "234234", "editMode": true },
        { "courseId": "ENC1101", "sectionId": "553548", "editMode": true },
      ]
    },
    {
      "username": "gmilán",
      "courses": [
        { "courseId": "ENC1101", "sectionId": "234523", "editMode": false },
        { "courseId": "ENC1101", "sectionId": "234234", "editMode": false },
        { "courseId": "ENC1101", "sectionId": "553548", "editMode": false },
      ]
    },
    {
      "username": "iÞórketi",
      "courses": [
        { "courseId": "ENC1101", "sectionId": "234523", "editMode": false },
        { "courseId": "ENC1101", "sectionId": "234234", "editMode": true },
        { "courseId": "ENC1101", "sectionId": "553548", "editMode": false },
      ]
    },
    {
      "username": "jprabhu",
      "courses": [
        { "courseId": "ENC1101", "sectionId": "234523", "editMode": true },
        { "courseId": "ENC1101", "sectionId": "234234", "editMode": false },
        { "courseId": "ENC1101", "sectionId": "553548", "editMode": true },
      ]
    }
  ]
  constructor(
    private apiService: ApiService,
    private bbRestApiService: BbRestApiService,
    private renderer: Renderer2,
    private element: ElementRef) {
    /*
      Renderer2 could be used to re-render the App root to remove the injected data
    */
    this.nativeElement = element.nativeElement
    this.bbApi = bbRestApiService
    this.api = apiService
  }

  ngOnInit() {
    this.user = JSON.parse(this.nativeElement.getAttribute('user'))
    this.renderer.removeAttribute(this.nativeElement, "user")
    this.getUserInventory(this.user.userName)
    console.log(this.user)
  }

  // searchUsers(value: string) {
  searchUsers() {
    if (this.searchTerm.length >= 3) {
      this.showUsers = true
      this.bbRestApiService.searchUsers(this.searchTerm).subscribe(users => {
        this.users = users
        console.log(this.users)
      })
    } else {
      this.showUsers = false
    }
  }

  clearUsers() {
    this.users = []
    this.showUsers = false
    this.searchTerm = ''
  }

  containsObject(user: any) {
    // console.log('containsObject(): user => ', user)
    // console.log('containsObject():', this.userInventory)
    return this.userInventory.inventory.some((x: any) =>
      x == user ||
      x.userName == user.userName ||
      ((x.userName && user.userName) && (x.name.given == user.name.given)) ||
      ((x.userName && user.userName) && (x.name.family == user.name.family))
    )
  }

  addUserToInventory(selectedUser: any) {
    console.log('addUserToInventory():selectedUser =>', selectedUser)
    if (!this.containsObject(selectedUser)) {
      this.api.getUserSettings(selectedUser.userName).subscribe((_user: UserSetting) => {
        console.log(_user)
        this.userInventory.inventory.push(_user)
        this.updateUserInventory(_user)
      })
      this.clearUsers()
    }
  }

  getUserInventory(userName: string) {
    this.api.getUserInventory(this.user.userName).subscribe((userInventory: UserInventory) => {
      this.userInventory = userInventory
      console.log('UserInventory.inventory => ', userInventory)
    })
  }

  updateUserInventory(user: any) {
    console.log(user)
    this.api.updateUserInventory(this.userInventory._id, user).subscribe((result: any) => {
      console.log('UserInventory has been updated => ', result)
    })
  }

  getCourseInfo(courseId:any) {
    this.api.getCourseInfo(courseId).subscribe((result:any) => result)
  }

  getCourseExternalId(courseId:any) {
      return courseId
    // console.log('getCourseExternalId()', courseId)
    //
    // this.api.getCourseInfo(courseId).subscribe((result:any) => result.externalId)
  }
}
