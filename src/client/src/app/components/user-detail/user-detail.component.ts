import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { UserSetting } from '../../models/user-setting'
import { ApiService } from '../../services/api.service'
import { BbRestApiService } from '../../services/bb-rest-api.service'
import * as _ from 'lodash'

@Component({
  selector: 'irsc-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  // @Input() userSetting: UserSetting;
  @Input() userSetting: any;
  @Output() emitter: EventEmitter<string> = new EventEmitter()
  private api: ApiService
  private bbapi: BbRestApiService

  terms: any
  courseId: any = ''
  courses: any = [] // this will hold the comlete membership list
  filteredCourses: any = [] // these will be sent back up to apiService

  // Note:
  // I broke it up this way to help with development,
  // ideally this would be done all in one Observable and the filtering
  // would be done on the indiviual UX/Component case during rendering

  constructor(
    private apiService: ApiService,
    private bbApiService: BbRestApiService
  ) {
    this.api = apiService
    this.bbapi = bbApiService
  }

  ngOnInit() {
    this.log()
    this.terms = this.api.terms
  }

  destroy() {
    this.emitter.emit('destroy')
  }

  log(): void {
    // console.log(this.userSetting)
  }

  refreshTerms() {
    console.log('Refreshing terms....')
    this.api.refrshTerms()
  }

  containsTerm(term: any) {
    return this.userSetting.terms.some(x => x._id == term._id)
  }

  updateUserTerm(term: any) {
    console.log('updateUserTerm =>', term)
    // if checked, remove term from userSetting.terms and save
    if (this.containsTerm(term)) {
      console.log('contains term, removing and saving')
      this.api.removeTermForUser(this.userSetting, term).subscribe((result: any) => {
        console.log('Terms has been updated!!')
        console.log('Term Removed', result)
        console.log(this.userSetting)
      })
    } else {
      // else, add term to userSetting.terms and save
      console.log('does not contains term, adding adn saving')
      this.api.addTermForUser(this.userSetting, term).subscribe((result: any) => {
        console.log('Terms has been updated!!')
        console.log('Term Added', result)
        console.log(this.userSetting)
      })
    }
  }

  updateUserSetting() {
    this.userSetting.passed = !this.userSetting.passed
    console.log(this.userSetting.passed)
    this.api.updateUserSetting(this.userSetting).subscribe((userSetting: UserSetting) => {
      console.log('User has been updated!!')
      console.log(this.userSetting)
    })
  }

  containsCourseId(courseId: any) {
    return this.userSetting.courseFilters.some(x => x == courseId)
  }



  addCourseId() {
    let courseId = this.courseId.toUpperCase()
    if (!this.containsCourseId(courseId)) {
      this.api.addCourseFilterForUser(this.userSetting, courseId).subscribe((result: any) => {
        console.log('CourseFilters has been updated!!')
        console.log('Course Filter Added', result)
        this.userSetting.courseFilters.push(courseId)
        // make sure to update the filteredCourses
        this.setFilteredCourses()
        console.log(this.userSetting.courseFilters)
        this.courseId = ''
      })
    }
    console.log(this.courseId.toUpperCase())
  }

  removeCourseId(i: number, courseId: any) {
    this.api.removeCourseFilterForUser(this.userSetting, courseId.toUpperCase()).subscribe((result: any) => {
      console.log('CourseFilters has been updated!!')
      console.log('Course Filter Removed', result)
      this.userSetting.courseFilters.splice(i, 1)
      this.setFilteredCourses()
      console.log(this.userSetting.courseFilters)
    })
  }

  setFilteredCourses() {
    // when setting the course filters, if there are no memberships
    // assume we haven't retreived them yet. Trigger memberships
    if (this.courses.length == 0){
      console.log('No Courses, refreshing Courses....')
      this.refreshCourses()
    } else {
      console.log('alsdfjasldfjas;ldifja;sldjfa;sldjfas;ldkjfas;ldkjfas;ldkfj')
      if (this.filteredCourses) {
        this.filteredCourses = _.filter(this.courses, (course:any) => {
          let _course = course.course
          let re = new RegExp(this.userSetting.courseFilters.join('|'))
          console.log('filtering course against:', re)
          console.log('Course Info: course.externalId =>', _course.externalId, ' | ', 'course.courseId =>', _course.courseId)
          return re.test(_course.externalId) || re.test(_course.couseId)
        })
        console.log('Courses filtered:')
        console.log(this.filteredCourses)
        if (this.filteredCourses == undefined || this.filteredCourses.length <= 0){
          this.filteredCourses = []
        }
        this.api.updateUserSettingCourses(this.userSetting, this.filteredCourses).subscribe((result) => {
          console.log('User Setting Courses should be updated:', result)
          this.userSetting.courses = result
        })
      }
    }
  }

  getCourses() {
    this.api.getMemberships(this.userSetting.user.userName).subscribe((memberships:any) => {
      this.courses = memberships
    })
  }

  refreshCourses() {
    this.bbapi.getMemberships(this.userSetting.user.id)
      .subscribe((memberships:any) => {
        console.log('refreshCourses =>', memberships)
        // here will will set the course list
        // and the filtered courses in "one-shot"
        // the memberships return as {user:user, memberships: [obj]}
        this.courses = memberships.memberships
        console.log('Courses have been refereshed...')
        console.log(this.courses)

        // only filter after we are sure that we have memberships
        if(this.courses.length > 0){
          this.setFilteredCourses()
        }
      })
  }
}
