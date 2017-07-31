import * as _ from 'lodash'
const promise = require('bluebird')
import { BbConfig, MODELS } from '../config'
const sendJson = require('../middleware/sendJson')
const request = require('request-promise')

exports.api = (req: any, res: any, next: any) => {

  if (!res.locals.bb) {
    res.locals.bb = {}
  }

  if (!res.locals.bb.restConfig) {
    res.locals.bb.restConfig = {}
  }

  // default isMany to false
  res.locals.bb.restConfig.isMany = false

  if (process.env.DEBUG) {
    console.log('[ bbrest-api:req.params ]\t', req.params)
    console.log('[ bbrest-api:bb.apiUrl ]\t', req.app.locals.bb.apiUrl)
    console.log('[ bbrest-api:bb.payload ]\t', req.app.locals.bb.payload)
  }
  next()
}

exports.setToken = (cb: any) => {
  request({
    method: 'post',
    url: `${BbConfig.url}/oauth2/token`,
    headers: {
      "Authorization": `Basic ${BbConfig.auth}`
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  })
    .then((body: any) => {
      MODELS.token.create(body, (err: any, token: any) => {
        if (err) throw (err)
        cb(token)
      })
    }).catch((err: any) => console.log(err))
}

// exports.getDataFromDb = (model: any, options: any) => {
//   return new promise((resolve: any, reject: any) => {
//     // if list = true then return list else load single query
//     console.log('MODEL COLLECTION:', model.collection.name)
//     let list: any = options && options.list
//     let data: any
//     let criteria = options.criteria || {}
//     console.log(criteria)
//     // data promise
//     if (list) {
//       data = model.list(criteria)
//     } else {
//       data = model.load(criteria)
//     }
//
//     data.then(
//       (result: any) => { resolve(result) },
//       (err: any) => reject(err)
//     )
//   })
// }

exports.getDataFromDb = (model: any, options: any) => {
  let list = options && options.list
  let data: any

  if (list) {
    data = model.list(options.criteria || {})
  } else {
    data = model.load(options.criteria || {})
  }

  return data
}

exports.setDataToDb = (req: any, model: any, data: any, options: any) => {
  // console.log('setDataToDb():data =>', data)
  return new promise((resolve: any, reject: any) => {
    // if list = true then return list else load single query
    let many: any = options && (options.many == true)
    let criteria = options.criteria || { _id: data._id } || {}
    let _data = options.data || { $set: data }

    // data promise
    if (many) {
      // bulk update
    } else {
      // single instace update
      return model.findOneAndUpdate(criteria, _data, { new: true })
        .populate(options.populate || '')
        .exec()
        .then((doc: any) => {
          if (doc) {
            resolve(doc)
          } else {
            reject({ message: "Could not update the current document." })
          }
        },
        (err: any) => reject(err))
    }
  })
}

// promise Pattern
exports.getDataFromBb2 = (req: any, model: any, pathOverride: any, extendWith: any = {}, search: any = {}, store: boolean = true) => {
  console.log('~'.repeat(100))
  console.log('~'.repeat(100))
  console.log('~'.repeat(100))
  console.log(model.collection.name, pathOverride, extendWith)
  console.log('~'.repeat(100))
  console.log('~'.repeat(100))
  console.log('~'.repeat(100))
  return new promise((resolve: any, reject: any) => {
    let data
    let url = req.app.locals.bb.apiUrl
    if (pathOverride) {
      url += pathOverride
    } else {
      url += req.path
    }
    console.log('getDataFromBb2:url => ', url)

    if (process.env.DEBUG) {
      console.log(url)
    }

    request({
      method: req.method,
      url: url,
      headers: {
        "Authorization": `Bearer ${req.app.locals.bb.payload.access_token}`
      },
      qs: search != {} ? search : req.query,
      form: req.body,
      json: true
    })
      .then((body: any) => {
        console.log(body)
        return body.results ? body.results : [body]
      },
      (err: any) => resolve(err.body))
      .map((doc: any) => {
        if (store) {
          if (process.env.DEBUG) {
            console.log('map(doc):url =>', url)
          }
          let criteria: any = {}
          // if (extendWith != {}) {
          if (!_.isEmpty(extendWith)) {
            doc = _.merge(doc, extendWith)
            console.log('extended doc:', doc)
          } else {
            console.log(extendWith)
          }

          console.log('MODEL COLECTION NAME', model.collection.name)

          if (model.collection.name == 'memberships') {
            criteria = { userId: doc.userId, courseId: doc.courseId }
          } else if (model.collection.name == 'columns') {
            criteria = { id: doc.id, courseId: doc.courseId }
          } else if (model.collection.name == 'columnusers') {
            console.log('ColumnUsers:')
            criteria = { userId: doc.userId, columnId: doc.columnId }
          } else if (model.collection.name == 'attempts') {
            console.log('Attempts Extension is process.....')
            criteria = { id: doc.id, courseId: doc.courseId, columnId: doc.columnId }
          } else {
            criteria = { id: doc.id }
          }

          if (criteria.id == undefined) {
            delete criteria.id
          }
          console.log(criteria)

          return model.findOneAndUpdate(criteria, { $set: doc }, { new: true }).exec()
            .then((_doc: any) => {
              if (!_doc) {
                return model.create(doc)
                  .then((_new: any) => _new)
                  .catch((err: any) => reject(err))
              } else {
                return _doc
              }
            })
            .catch((err: any) => reject(err))
        } else {
          return doc
        }
      })
      .then((result: any) => {
        resolve(result)
      })
      .catch((err: any) => reject(err))
  })
}
