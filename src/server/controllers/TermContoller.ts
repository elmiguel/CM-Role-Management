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

export const TermController = {
  // list: (req: any, res: any) => {
  //   let Term = res.app.locals.bb.models.terms
  //   console.log(req.query)
  //   if (req.query.myRefresh === 'true') {
  //     bbRestApi.getDataFromBb2(req, Term).then((_doc: any) => sendJson(res, null, _doc))
  //   } else {
  //     Term.list({ criteria: {} })
  //       .then((terms: any) => sendJson(res, null, terms))
  //       .catch((err: any) => console.log(err))
  //   }
  // },
  list: (req: any, res: any) => {
    let Term = res.app.locals.bb.models.terms
    promise.all([
      req.query.myRefresh == 'true',
      Term.list({ criteria: {} })
    ])
      .then(([refresh, terms]: any) => {
        if (terms.length > 0 && !refresh) {
          return [refresh, terms]
        } else {
          return promise.all([
            refresh,
            bbRestApi.getDataFromBb2(req, Term).then((_doc: any) => _doc)
          ])
        }
      })
      .then(([refresh, terms]: any) => {
        sendJson(res, null, terms)
      })
      .catch((err: any) => sendJson(res, err, {}))

  },

  load: (req: any, res: any) => {
    let Term = res.app.locals.bb.models.terms
    let params = extractParam(req.params.termId)
    promise.all([
      req.query.myRefresh == 'true',
      Term.load({ criteria: params })
    ])
      .then(([refresh, term]: any) => {
        if (!refresh && term !== undefined) {
          return [refresh, term]
        } else {
          return promise.all([
            refresh,
            bbRestApi.getDataFromBb2(req, Term).then((_doc: any) => _doc)
          ])
        }
      })
      .then(([refresh, term]: any) => {
        sendJson(res, null, term)
      })
      .catch((err: any) => sendJson(res, err, {}))
  }
}
