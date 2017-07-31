"use strict"
import * as _ from 'lodash'
const promise = require('bluebird')
const co = require('co')
const sendJson = require('../middleware/sendJson')
const bbRestApi = require('../middleware/bbrest-api')

function extractParam(param: any, join = false, source = 'mongo') {
  console.log(param)
  let params: any = {}
  let key

  if (/^(_\d+_1|primaryId)/.test(param)) {
    key = 'id'
  } else if (/^(\d+|externalId)/.test(param)) {
    key = 'externalId'
  } else if (/^(uuId)/.test(param)) {
    key = 'uuid'
  } else {
    key = 'userName'
  }

  params[key] = param.replace(/^(\w+:)/gi, '')
  if (join) {
    let value = params[key]
    if (source === 'bb') {
      if (key === 'id') key = ''
    }

    if (key !== '') {
      key += ':'
    }
    params = `${key}${value}`
  }
  return params
}

export const CourseController = {
  users: (req: any, res: any) => {
    let BbUser = res.app.locals.bb.models.users
    let Course = res.app.locals.bb.models.courses
    let Membership = res.app.locals.bb.models.memberships

    let params = extractParam(req.params.courseId)
    console.log('CourseController.users:params:', params)

    // first check the user and store or update
    // user does not exist, retrieve, store, reset user, continue
    // then load the courses and store or update
    // locate the potentional membership by userId + courseId
    // create or update membership record; ensure ObjectId references to base collections
    // combine file result to send back to the caller
    promise.all([
      Course.load({ criteria: params }),
      bbRestApi.getDataFromBb2(req, Membership)
    ])
      .then(([course, memberships]: any) => {
        // is only one membership, turn it into an array
        memberships = !Array.isArray(memberships) ? [memberships] : memberships
        let users: any = []
        for (let user of memberships) {
          let pathOverride = `/users/${extractParam(user.userId, true, 'bb')}`
          users.push(bbRestApi.getDataFromBb2(req, BbUser, pathOverride))
        }

        return [course, memberships, users]
      })
      .then(([course, memberships, users]: any) => {
        promise.all(users)
          .then((users: any) => {
            users.forEach((obj: any, i: number) => {
              // console.log('CourseController.users:then() => ', i, obj[0])
              // remove array wrapping
              // !Array.isArray(var) ? [var] : arr pattern in bbRestApi.getDataFromBb2
              users[i] = obj[0]
            })
            sendJson(res, null, { course, memberships, users })
          })
      })
  },

  user: (req: any, res: any) => {
    let BbUser = res.app.locals.bb.models.users

    let params = extractParam(req.params.userId)

    promise.all([
      BbUser.load({ criteria: params })
    ])
      .then((user: any) => {
        promise.all(user)
          .then((courses: any) => {
            user = user[0]
            sendJson(res, null, user)
          })
      })
  },

  list: (req: any, res: any) => {
    let BbCourse = res.app.locals.bb.models.courses
    console.log(req.query)
    if (req.query.myRefresh === 'true') {
      bbRestApi.getDataFromBb2(req, BbCourse).then((_doc: any) => sendJson(res, null, _doc))
    } else {
      BbCourse.list({ limit: 100 })
        .then((courses: any) => sendJson(res, null, courses))
        .catch((err: any) => console.log(err))
    }
  },

  load: (req: any, res: any) => {
    let BbCourse = res.app.locals.bb.models.courses
    let params = extractParam(req.params.courseId)
    console.log(params)
    promise.all([
      req.query.myRefresh == 'true',
      BbCourse.load({ criteria: params })
    ])
      .then(([refresh, course]: any) => {
        if (typeof refresh == 'boolean' && course != undefined) {
          sendJson(res, null, course)
        } else {
          // saves to the user but returns null instead of the user
          console.log('Should be getting data from Bb.')
          bbRestApi.getDataFromBb2(req, BbCourse).then((_doc: any) => sendJson(res, null, _doc))
        }
      })
      .catch((err: any) => sendJson(res, err, {}))
  },

}
