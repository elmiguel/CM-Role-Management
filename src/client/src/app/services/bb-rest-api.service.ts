import { Injectable } from '@angular/core';
import { URLSearchParams, Http, Response } from '@angular/http'

import { User } from '../models/user'
import { Membership } from '../models/membership'

import { Observable } from 'rxjs/Observable'
// Subject only tracks new and current subscriptions and current data
import { Subject } from 'rxjs/Subject'

// ReplaySubject tracks all subscriptions and sends all tracked data
import { ReplaySubject } from 'rxjs/ReplaySubject'

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
@Injectable()
export class BbRestApiService {

  constructor(private http: Http) { }

  getUsers(): Observable<User[]> {
    return this.http.get('/bbapi/users')
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json().error) || 'Server error')
  }

  searchUsers(value: string): Observable<User[]> {
    return this.http.get(`/bbapi/users?search=${value}`)
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json().error) || 'Server error')
  }

  getMemberships(user:string): Observable<Membership[]> {
    return this.http.get(`/bbapi/users/${user}/courses`)
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json().error) || 'Server error')
  }
}
