"use strict"
import * as _ from 'lodash'
const promise = require('bluebird')
const co = require('co')
const sendJson = require('../middleware/sendJson')
const bbRestApi = require('../middleware/bbrest-api')

function extractParam(param: any, join = false, source = 'mongo') {
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

export const BbUserController = {
  // courses: (req: any, res: any) => {
  //   let BbUser = res.app.locals.bb.models.users
  //   let Course = res.app.locals.bb.models.courses
  //   let Membership = res.app.locals.bb.models.memberships
  //
  //
  //   let params = extractParam(req.params.userId)
  //
  //
  //   // first check the user and store or update
  //   // user does not exist, retrieve, store, reset user, continue
  //   // then load the courses and store or update
  //   // locate the potentional membership by userId + courseId
  //   // create or update membership record; ensure ObjectId references to base collections
  //   // combine file result to send back to the caller
  //   promise.all([
  //     BbUser.load({ criteria: params }),
  //     bbRestApi.getDataFromBb2(req, Membership)
  //   ])
  //     .then(([user, memberships]: any) => {
  //       // is only one membership, turn it into an array
  //       memberships = !Array.isArray(memberships) ? [memberships] : memberships
  //       let courses: any = []
  //       for (let course of memberships) {
  //         let pathOverride = `/courses/${extractParam(course.courseId, true, 'bb')}`
  //         courses.push(bbRestApi.getDataFromBb2(req, Course, pathOverride))
  //       }
  //
  //       return [user, memberships, courses]
  //     })
  //     .then(([user, memberships, courses]: any) => {
  //       promise.all(courses)
  //         .then((courses: any) => {
  //           courses.forEach((obj: any, i: number) => {
  //             // console.log(i, obj[0])
  //             // remove mysterious array wrapping
  //             courses[i] = obj[0]
  //           })
  //           sendJson(res, null, { user, memberships, courses })
  //         })
  //     })
  // },

  courses2: (req: any, res: any) => {
    let BbUser = res.app.locals.bb.models.users
    let Course = res.app.locals.bb.models.courses
    let Membership = res.app.locals.bb.models.memberships
    let UserSetting = res.app.locals.bb.models.userSettings
    let criteria = extractParam(req.params.userId)
    // first attempt to load the memberships
    promise.all([
      BbUser.load({ criteria: criteria }),
      Membership.find({})
        .populate({
          path: 'user',
          model: 'BbUser',
          match: criteria,
          populate: [
            { path: 'course', model: 'Course' }
          ]
        })
    ])
      .then(([user, memberships]: any) => {

        // make sure user was not return as an array
        if (Array.isArray(user)) {
          user = user[0]
        }

        // now if there is no user and no memberships, we need to load from Bb
        // what is the user hasn't been stored?

        let pathOverride = `/users/${req.params.userId}`
        // if (!user && memberships.length == 0) {
        if (!user || memberships.length == 0) {
          console.log('BbUserController.courses2 =>', memberships)
          return promise.all([
            bbRestApi.getDataFromBb2(req, BbUser, pathOverride),
            null // we will load the memberships in a future stage
          ])
        } else {
          return [user, memberships]
        }
      })
      .then(([user, memberships]: any) => {
        // console.log('is user being turned back into an array? => ', user)
        // make sure user was not return as an array
        if (Array.isArray(user)) {
          user = user[0]
        }
        // at this point we should already have the user
        // and but we need to  have the memberships
        if (!memberships) {
          return promise.all([
            user,
            // we need to pass the user into the Membership for reference
            // so for now we will set store to false in getDataFromBb2()
            bbRestApi.getDataFromBb2(req, Membership, null, {}, {}, false)
          ])
        } else {
          return promise.all([user, memberships])
        }
      })
      .then(([user, memberships]: any) => {
        // so now we have a use and memberships
        // but now we need to ensure all the course data is stored and referenced
        // first we make sure that the user actually has memberships
        // if not, then just pass it along

        // is only one membership, turn it into an array
        memberships = !Array.isArray(memberships) ? [memberships] : memberships

        if (memberships.length == 0) {
          return promise.all([user, memberships, null])
        } else {
          // we have memberships, now we need to do some manipulation
          let courses: any = []

          for (let [i, course] of memberships.entries()) {
            let pathOverride = `/courses/${extractParam(course.courseId, true, 'bb')}`
            courses.push(bbRestApi.getDataFromBb2(req, Course, pathOverride))
          }
          return promise.all([user, memberships, promise.all(courses)])
        }
      })
      .then(([user, memberships, courses]: any) => {
        if(courses) {
          courses.forEach((obj: any, i: number) => {
            // console.log(i, obj[0])
            // remove mysterious array wrapping
            if(Array.isArray(obj)){
              courses[i] = obj[0]
            }
          })
        }

        return [user, memberships, courses]
      })
      .then(([user, memberships, courses]: any) => {
        let _memberships: any = []
        for (let [i, membership] of memberships.entries()) {
          membership = _.merge(membership, { user: user, course: courses[i] })
          _memberships.push(Membership.create(membership))
          // 
          // Course.load({ criteria: { _id: courses[i]._id } })
          //   .then((course:any) => {
          //     membership = _.merge(membership, { user: user, course: course })
          //     _memberships.push(Membership.create(membership))
          //   })
        }
        return promise.all([
          user,
          memberships
        ])
      })
      .then(([user, memberships]: any) => {
        // memberships.memberships = _.pullAllBy(memberships.memberships, [{ user: memberships.user }])
        return { user, memberships }
      })
      .then((results: any) => {
        sendJson(res, null, results)
      })

  },

  list: (req: any, res: any) => {
    let BbUser = res.app.locals.bb.models.users
    // console.log(req.query)
    // if (req.query.myRefresh === 'true') {
    //   bbRestApi.getDataFromBb2(req, BbUser).then((_doc: any) => sendJson(res, null, _doc))
    // } else {
    //   BbUser.list({ limit: 100 })
    //     .then((users: any) => sendJson(res, null, users))
    //     .catch((err: any) => console.log(err))
    // }
    //


    // let Term = res.app.locals.bb.models.terms
    promise.all([
      req.query.myRefresh == 'true',
      BbUser.list(
        {
          criteria: req.query.search ?
            {
              $or: [
                { userName: new RegExp(req.query.search, 'i') },
                { 'name.given': new RegExp(req.query.search, 'i') },
                { 'name.family': new RegExp(req.query.search, 'i') }
              ]
            } :
            {}
        })
    ])
      .then(([refresh, users]: any) => {
        if (users.length > 0 && !refresh) {
          return [refresh, users]
        } else {
          return promise.all([
            refresh,
            bbRestApi.getDataFromBb2(req, BbUser, null, {}, req.query.search ? { userName: req.query.search } : {}).then((_doc: any) => _doc)
          ])
        }
      })
      .then(([refresh, users]: any) => {
        sendJson(res, null, users)
      })
      .catch((err: any) => sendJson(res, err, {}))



  },

  load: (req: any, res: any) => {
    let BbUser = res.app.locals.bb.models.users
    let params = extractParam(req.params.userId)
    console.log(params)
    promise.all([
      req.query.myRefresh == 'true',
      BbUser.load({ criteria: params })
    ])
      .then(([refresh, user]: any) => {
        if (typeof refresh == 'boolean' && user != undefined) {
          sendJson(res, null, user)
        } else {
          // saves to the user but returns null instead of the user
          console.log('Should be getting data from Bb.')
          bbRestApi.getDataFromBb2(req, BbUser).then((_doc: any) => sendJson(res, null, _doc))
        }
      })
      .catch((err: any) => sendJson(res, err, {}))
  },

}
