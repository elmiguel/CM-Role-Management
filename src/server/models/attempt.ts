import * as mongoose from 'mongoose'
import * as _base from './_base'
const Schema = mongoose.Schema

let AttemptSchema = new Schema(_base.fields)
AttemptSchema.add({
  userId: String,
  courseId: String,
  columnId: String,
  groupAttemptId: String,
  groupOverride: Boolean,
  studentComments: String,
  studentSubmission: String,
  exempt: Boolean,
  status: String,
  text: String,
  score: Number,
  notes: String,
  feedback: String
})

const default_select = 'id userId courseId groupAttemptId groupOverride groupOverride studentComments studentSubmission exempt status text score notes feedback'
AttemptSchema.plugin(require('./base'))
AttemptSchema.statics = _base.statics

module.exports = mongoose.model('Attempt', AttemptSchema, 'attempts')
