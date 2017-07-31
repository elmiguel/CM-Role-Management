import * as mongoose from 'mongoose'
import * as _base from './_base'
import * as _ from 'lodash'
const Schema = mongoose.Schema


let TermSchema = new Schema(_.merge(_base.fields, {
  description: String,
  availability: {
    available: String,
    duration: {
      type: { type: String, enum: ['Continuous', 'DateRange', 'FixedNumDays'] },
      start: Date,
      end: Date,
      daysOfUse: Number
    }
  }
}))

const default_select = 'id externalId name description availability'
TermSchema.statics = _base.statics

module.exports = mongoose.model('Term', TermSchema, 'terms')
