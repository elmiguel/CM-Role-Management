import * as mongoose from 'mongoose'
import * as _base from './_base'
const Schema = mongoose.Schema

let ColumnUserSchema = new Schema(_base.fields)
ColumnUserSchema.add({
  userId: String,
  columnId: String,
  status: String,
  text: String,
  score: Number,
  overridden: Date,
  notes: String,
  feedback: String,
  exempt: Boolean,
  corrupt: Boolean
})

const default_select = 'id userId columnId status text score overridden notes feedback exempt corrupt'
ColumnUserSchema.plugin(require('./base'))
ColumnUserSchema.statics = _base.statics

module.exports = mongoose.model('ColumnUser', ColumnUserSchema, 'columnusers')
