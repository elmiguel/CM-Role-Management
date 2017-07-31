import { Injectable } from '@angular/core';
import { URLSearchParams, Http, Response } from '@angular/http'

import { User } from '../models/user'
import { UserSetting } from '../models/user-setting'
import { Term } from '../models/term'
import { UserInventory } from '../models/user-inventory'

import { Observable } from 'rxjs/Observable'
// Subject only tracks new and current subscriptions and current data
import { Subject } from 'rxjs/Subject'

// ReplaySubject tracks all subscriptions and sends all tracked data
import { ReplaySubject } from 'rxjs/ReplaySubject'

// Import RxJs required methods
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

@Injectable()
export class ApiService {

  terms: Term[] = []

  constructor(private http: Http) {
    this.http.get('/bbapi/terms')
      .map((res: Response) => res.json())
      .subscribe((terms: any) => this.terms = terms)
  }

  refrshTerms() {
    return this.http.get('/bbapi/terms?myRefresh=true')
      .map((res: Response) => res.json())
      .subscribe((terms: any) => this.terms = terms)
  }

  getUserSettings(user: string): Observable<UserSetting> {
    console.log('getUserSettings():user =>', user)
    return this.http.get(`/api/user/${user}`)
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json().error) || 'Server error')
  }

  updateUserSetting(userSetting: any) {
    return this.http.post(`/api/user/${userSetting.user.userName}`, userSetting)
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json().error) || 'Server error')
  }

  updateUserSettingCourses(userSetting: any, courses:any) {
    return this.http.post(`/api/user-settings/${userSetting._id}/courses`, courses)
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json().error) || 'Server error')
  }

  getUserInventory(userName: string): Observable<UserInventory> {
    return this.http.get(`/api/user/${userName}/inventory`)
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json().error) || 'Server error')
  }

  updateUserInventory(inventory: any, user: any) {
    console.log('api.service:updateUserInventory [received user] => ', user)
    return this.http.post(`/api/inventory/${inventory}/add`, user)
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json().error) || 'Server error')
  }

  removeUserFromInventory(inventory: any, user: any) {
    console.log('api.service:updateUserInventory [received user] => ', user)
    return this.http.post(`/api/inventory/${inventory}/remove`, user)
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json().error) || 'Server error')
  }

  addTermForUser(userSetting: any, term: any) {
    console.log('api.service:removeTerm [received term] => ', term)
    return this.http.post(`/api/user-settings/${userSetting._id}/term/add`, term)
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json().error) || 'Server error')
  }

  removeTermForUser(userSetting: any, term: any) {
    console.log('api.service:removeTerm [received term] => ', term)
    return this.http.post(`/api/user-settings/${userSetting._id}/term/remove`, term)
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json().error) || 'Server error')
  }

  addCourseFilterForUser(userSetting: any, courseId: any) {
    console.log('api.service:courseFilter [received courseId] => ', userSetting, courseId)
    return this.http.post(`/api/user-settings/${userSetting._id}/courseFilter/add`, { courseId })
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json().error) || 'Server error')
  }

  removeCourseFilterForUser(userSetting: any, courseId: any) {
    console.log('api.service:courseFilter [received courseId] => ', courseId)
    return this.http.post(`/api/user-settings/${userSetting._id}/courseFilter/remove`, { courseId })
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json().error) || 'Server error')
  }

  getMemberships(userName:any) {
    console.log('attempting to load data from database....')
    return this.http.get(`/api/user/${userName}/courses`)
    .map((res:Response) => res.json())
    .catch((err: any) => Observable.throw(err.json().error) || 'Server error')
  }

  getCourseInfo(courseId:any) {
    return this.http.get(`/api/courses/:courseId`)
    .map((res:Response) => res.json())
    .catch((err: any) => Observable.throw(err.json().error) || 'Server error')
  }
}
