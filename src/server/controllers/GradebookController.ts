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

export let GradebookController = {
  attempt: (req: any, res: any) => {
    let Attempt = res.app.locals.bb.models.attempts
    let Column = res.app.locals.bb.models.columns
    let BbCourse = res.app.locals.bb.models.courses
    let params = extractParam(req.params.courseId)

    promise.all([
      req.query.myRefresh == 'true',
      BbCourse.load({ criteria: params })
    ])
      .then(([refresh, course]: any) => {
        if (typeof refresh == 'boolean' && course != undefined) {
          return [refresh, course]
        } else {
          console.log('Should be getting data from Bb.')
          return [refresh, bbRestApi.getDataFromBb2(req, BbCourse).then((_doc: any) => _doc)]
        }
      }).then(([refresh, course]: any) => {
        console.log('Course Info Retrieved:', course.externalId)
        params = extractParam(req.params.columnId)
        return promise.all([
          refresh,
          course,
          Column.load({ criteria: params })
        ])
      })
      .then(([refresh, course, column]: any) => {
        if (column.length > 0) {
          return [refresh, course, column]
        } else {
          return promise.all([refresh, course, bbRestApi.getDataFromBb2(req, Column, null, { courseId: course.id })])
        }
      })
      .then(([refresh, course, column]: any) => {
        console.log('Column Info Retrieved, loading attempt...')
        params = extractParam(req.params.attemptId)
        return promise.all([
          refresh,
          course,
          column,
          Attempt.load({ criteria: params })
        ])
      })
      .then(([refresh, course, column, attempt]: any) => {
        if (attempt.length > 0) {
          return [refresh, course, column, attempt]
        } else {
          return promise.all([refresh, course, bbRestApi.getDataFromBb2(req, Attempt, null, { courseId: course.id, columnId: column.id })])
        }

      })
      .then(([refresh, course, column, attempt]: any) => {
        sendJson(res, null, { course, column, attempt })
      })
      .catch((err: any) => sendJson(res, err, {}))
  },
  attempts: (req: any, res: any) => {
    let Attempt = res.app.locals.bb.models.attempts
    let Column = res.app.locals.bb.models.columns
    let BbCourse = res.app.locals.bb.models.courses
    let params = extractParam(req.params.courseId)

    promise.all([
      req.query.myRefresh == 'true',
      BbCourse.load({ criteria: params })
    ])
      .then(([refresh, course]: any) => {
        if (typeof refresh == 'boolean' && course != undefined) {
          return [refresh, course]
        } else {
          console.log('Should be getting data from Bb.')
          return [refresh, bbRestApi.getDataFromBb2(req, BbCourse).then((_doc: any) => _doc)]
        }
      }).then(([refresh, course]: any) => {
        console.log('Course Info Retrieved:', course.externalId)
        console.log('Params:', params)
        return promise.all([
          refresh,
          course,
          Column.load({ criteria: { courseId: course.id } })
        ])
      })
      .then(([refresh, course, column]: any) => {
        if (column) {
          console.log('Attempts:column info', column)
          return [refresh, course, column]
        } else {
          return promise.all([refresh, course, bbRestApi.getDataFromBb2(req, Column, null, { courseId: course.id })])
        }
      })
      .then(([refresh, course, column]: any) => {
        console.log('Column Info Retrieved, loading attempts...', column.id)
        return promise.all([
          refresh,
          course,
          column,
          Attempt.list({ criteria: { columnId: column.id } })
        ])
      })
      .then(([refresh, course, column, attempts]: any) => {
        console.log('Course:', course)
        console.log('Column:', column)
        console.log('Attempts:', attempts)
        if (attempts.length > 0) {
          return [refresh, course, column, attempts]
        } else {
          console.log('Attempting to load attempts from Bb')
          return promise.all([refresh, course, bbRestApi.getDataFromBb2(req, Attempt, null, { courseId: course.id, columnId: column.id })])
        }
      })
      .then(([refresh, course, column, attempts]: any) => {
        sendJson(res, null, { course, column, attempts })
      })
      .catch((err: any) => sendJson(res, err, {}))
  },
  column: (req: any, res: any) => {
    let Column = res.app.locals.bb.models.columns
    let BbCourse = res.app.locals.bb.models.courses
    let params = extractParam(req.params.courseId)
    console.log(params)
    promise.all([
      req.query.myRefresh == 'true',
      BbCourse.load({ criteria: params })
    ])
      .then(([refresh, course]: any) => {
        if (typeof refresh == 'boolean' && course != undefined) {
          return [refresh, course]
        } else {
          console.log('Should be getting data from Bb.')
          return [refresh, bbRestApi.getDataFromBb2(req, BbCourse).then((_doc: any) => _doc)]
        }
      }).then(([refresh, course]: any) => {
        console.log('Course Info Retrieved:', course.externalId)
        params = extractParam(req.params.columnId)
        return promise.all([
          refresh,
          course,
          Column.load({ criteria: params })
        ])
      })
      .then(([refresh, course, column]: any) => {
        if (column.length > 0) {
          return [refresh, course, column]
        } else {
          return promise.all([refresh, course, bbRestApi.getDataFromBb2(req, Column, null, { courseId: course.id })])
        }
      })
      .then(([refresh, course, column]: any) => {
        sendJson(res, null, { course, column })
      })
      .catch((err: any) => sendJson(res, err, {}))
  },
  columns: (req: any, res: any) => {
    let Column = res.app.locals.bb.models.columns
    let BbCourse = res.app.locals.bb.models.courses
    let params = extractParam(req.params.courseId)
    console.log(params)
    promise.all([
      req.query.myRefresh == 'true',
      BbCourse.load({ criteria: params })
    ])
      .then(([refresh, course]: any) => {
        if (typeof refresh == 'boolean' && course != undefined) {
          return [refresh, course]
        } else {
          console.log('Should be getting data from Bb.')
          return [refresh, bbRestApi.getDataFromBb2(req, BbCourse).then((_doc: any) => _doc)]
        }
      }).then(([refresh, course]: any) => {
        console.log('Course Info Retrieved:', course.externalId)
        return promise.all([
          refresh,
          course,
          Column.list({ criteria: { courseId: course.id } })
        ])
      })
      .then(([refresh, course, columns]: any) => {
        if (columns.length > 0) {
          return [refresh, course, columns]
        } else {
          return promise.all([refresh, course, bbRestApi.getDataFromBb2(req, Column, null, { courseId: course.id })])
        }
      })
      .then(([refresh, course, columns]: any) => {
        sendJson(res, null, { course, columns })
      })
      .catch((err: any) => sendJson(res, err, {}))
  },
  columnUser: (req: any, res: any) => {
    console.log(req.path)
    let Column = res.app.locals.bb.models.columns
    let ColumnUser = res.app.locals.bb.models.columnUsers
    let BbCourse = res.app.locals.bb.models.courses
    let params = extractParam(req.params.courseId)
    console.log(params)
    promise.all([
      req.query.myRefresh == 'true',
      BbCourse.load({ criteria: params })
    ])
      .then(([refresh, course]: any) => {
        if (typeof refresh == 'boolean' && course != undefined) {
          return [refresh, course]
        } else {
          console.log('Should be getting data from Bb.')
          return [refresh, bbRestApi.getDataFromBb2(req, BbCourse).then((_doc: any) => _doc)]
        }
      }).then(([refresh, course]: any) => {
        console.log('Course Info Retrieved:', course.externalId)
        params = extractParam(req.params.columnId)
        return promise.all([
          refresh,
          course,
          Column.load({ criteria: params })
        ])
      })
      .then(([refresh, course, column]: any) => {
        console.log('CHECKING COLUMN LOAD!!!!!!!!!', column)
        if (course.id == column.courseId) {
          console.log('Column Loaded!!!!!!!!')
          return [refresh, course, column]
        } else {
          return promise.all([refresh, course, bbRestApi.getDataFromBb2(req, Column, null, { courseId: course.id })])
        }
      })
      .then(([refresh, course, column]: any) => {

        console.log('Attempting to load column users..........................')
        return promise.all([
          refresh,
          course,
          column,
          ColumnUser.load({ criteria: { columnId: column.id, userId: req.params.userId } })
        ])
      })
      .then(([refresh, course, column, users]: any) => {
        console.log(refresh, course, column)
        console.log('CHECKING COLUMN USERS', users)
        if (users.length > 0) {
          return [refresh, course, column, users]
        } else {
          return promise.all([refresh, course, column, bbRestApi.getDataFromBb2(req, ColumnUser, null, { userId: req.params.userId })])
        }
      })
      .then(([refresh, course, column, users]: any) => {
        sendJson(res, null, { course, column, users })
      })
      .catch((err: any) => sendJson(res, err, {}))
  },
  columnUsers: (req: any, res: any) => {
    console.log(req.path)
    let Column = res.app.locals.bb.models.columns
    let ColumnUser = res.app.locals.bb.models.columnUsers
    let BbCourse = res.app.locals.bb.models.courses
    let params = extractParam(req.params.courseId)
    console.log(params)
    promise.all([
      req.query.myRefresh == 'true',
      BbCourse.load({ criteria: params })
    ])
      .then(([refresh, course]: any) => {
        if (typeof refresh == 'boolean' && course != undefined) {
          return [refresh, course]
        } else {
          console.log('Should be getting data from Bb.')
          return [refresh, bbRestApi.getDataFromBb2(req, BbCourse).then((_doc: any) => _doc)]
        }
      }).then(([refresh, course]: any) => {
        console.log('Course Info Retrieved:', course.externalId)
        params = extractParam(req.params.columnId)
        return promise.all([
          refresh,
          course,
          Column.load({ criteria: params })
        ])
      })
      .then(([refresh, course, column]: any) => {
        console.log('CHECKING COLUMN LOAD!!!!!!!!!', column)
        if (course.id == column.courseId) {
          console.log('Column Loaded!!!!!!!!')
          return [refresh, course, column]
        } else {
          return promise.all([refresh, course, bbRestApi.getDataFromBb2(req, Column, null, { courseId: course.id })])
        }
      })
      .then(([refresh, course, column]: any) => {

        console.log('Attempting to load column users..........................')
        return promise.all([
          refresh,
          course,
          column,
          ColumnUser.list({ criteria: { columnId: column.id } })
        ])
      })
      .then(([refresh, course, column, users]: any) => {
        console.log(refresh, course, column)
        console.log('CHECKING COLUMN USERS', users)
        if (users.length > 0) {
          return [refresh, course, column, users]
        } else {
          return promise.all([refresh, course, column, bbRestApi.getDataFromBb2(req, ColumnUser)])
        }
      })
      .then(([refresh, course, column, users]: any) => {
        sendJson(res, null, { course, column, users })
      })
      .catch((err: any) => sendJson(res, err, {}))
  },
  user: (req: any, res: any) => {
    console.log(req.path)

    let BbUser = res.app.locals.bb.models.users
    let Column = res.app.locals.bb.models.columns
    let ColumnUser = res.app.locals.bb.models.columnUsers
    let BbCourse = res.app.locals.bb.models.courses
    let params = extractParam(req.params.courseId)
    console.log(params)
    promise.all([
      req.query.myRefresh == 'true',
      BbCourse.load({ criteria: params }),
      BbUser.load({ criteria: extractParam(req.params.userId) }),
    ])
      .then(([refresh, course, user]: any) => {
        // console.log(refresh, course, user)
        if (typeof refresh == 'boolean' && course != undefined && user != undefined) {
          return [refresh, course, user]
        } else {
          console.log('Should be getting data from Bb.')
          return [
            refresh,
            bbRestApi.getDataFromBb2(req, BbCourse).then((_doc: any) => _doc),
            bbRestApi.getDataFromBb2(req, BbUser).then((_doc: any) => _doc)]
        }
      }).then(([refresh, course, user]: any) => {
        console.log('Course Info Retrieved:', course.externalId)
        params = extractParam(req.params.userId)
        console.log('CHECKING PARAMS:', params)
        // modify the id to be userId.....
        params = { userId: params.id }

        return promise.all([
          refresh,
          course,
          Column.list({ criteria: { courseId: course.id } }),
          user,
          ColumnUser.list({ criteria: { userId: user.id } })
        ])
      })
      .then(([refresh, course, columns, user, grades]: any) => {
        console.log('CHECKING IF GRADES ARE LOADED:', grades)
        if (grades.length > 0 && columns.length > 0) {
          return [refresh, course, columns, user, grades]
        } else {
          return promise.all([
            refresh,
            course,
            bbRestApi.getDataFromBb2(req, Column, `/courses/${req.params.courseId}/gradebook/columns`, { courseId: params }),
            user,
            bbRestApi.getDataFromBb2(req, ColumnUser)])
        }
      })
      .then(([refresh, course, columns, user, grades]: any) => {
        sendJson(res, null, { course, columns, user, grades })
      })
      .catch((err: any) => sendJson(res, err, {}))
  },
}
