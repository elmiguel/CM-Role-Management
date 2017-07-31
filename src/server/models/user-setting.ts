import * as mongoose from 'mongoose'
const promise = require('bluebird')
const Schema = mongoose.Schema
const BbUser = require('./bbuser')



let UserSettingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'BbUser' },
  courseFilters: [{ type: String }],
  courses: [{
    membership: { type: Schema.Types.ObjectId, ref: 'Mmebership' },
    editMode: { type: Boolean, default: false }
  }],
  terms: [{ type: Schema.Types.ObjectId, ref: 'Term' }],
  passed: { type: Boolean, default: false }
})
UserSettingSchema.plugin(require('./base'))
UserSettingSchema.set("timestamps", true)
const default_select = 'user courses terms passed'

UserSettingSchema.statics.load = function(options: any) {
  let select = options.select || default_select
  return this.findOne(options.criteria)
    .select(select)
    .populate('user')
    .exec()
}

UserSettingSchema.statics.findOneOrCreate = function(options: any) {
  let criteria = options.criteria || {}
  let select = options.select || default_select
  let $ = this

  return promise.all([
    $.findOne(criteria).select(select).exec(),
    BbUser.findOne(criteria).exec()
  ])
    .then((results: any) => {
      if (results[0]) {
        return results[0]
      } else if (results[1]) {
        return $.create({
          userName: results[1].userName,
          name: results[1].name
        })
          .then((_new: any) => Promise.resolve(_new))
      }
    })
    .catch((err: any) => console.log(err))
}

UserSettingSchema.statics.list = function(options: any) {
  let criteria = options.criteria || {}
  let select = options.select || default_select
  let sort = options.sort || 1
  let page = options.page || 0
  let limit = options.limit || 30
  return this.find(criteria)
    .select(select)
    .sort({ _id: sort })
    .limit(limit)
    .skip(limit * page)
    .exec()
}

export = mongoose.model('UserSetting', UserSettingSchema, 'user_settings')
