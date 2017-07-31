import crypto = require('crypto')
import * as _base from './_base'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

let BbUserSchema = new Schema(_base.fields)
BbUserSchema.add({
  userName: { type: String },
  educationLevel: String,
  gender: String,
  lastLogin: String,
  systemRoleIds: [String],
  name: {
    given: String,
    family: String,
    title: String
  },
  contact: {
    email: String
  }
})
BbUserSchema.plugin(require('./base'))
const default_select = 'id uuid externalId userName name email'
BbUserSchema.statics = _base.statics
// BbUserSchema.plugin(require('mongoose-aliasfield'))
// BbUserSchema.set('timestamps', true)

/**
 * Virtuals
 */

BbUserSchema
  .virtual('password')
  .set((password: string) => {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(() => {
    return this._password
  })

BbUserSchema.pre('save', (next: any) => {
  //if (!this.isNew) return next()

  //if (!validatePresenceOf(this.password)) {
  //    next(new Error('Invalid password'))
  //} else {
  next()
  //}
})

module.exports = mongoose.model('BbUser', BbUserSchema, 'bbusers')
