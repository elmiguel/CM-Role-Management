import * as mongoose from 'mongoose'
import * as _base from './_base'
const Schema = mongoose.Schema

let ColumnSchema = new Schema(_base.fields)
ColumnSchema.add({
  name: String,
  courseId: String,
  description: String,
  organization: Boolean,
  ultraStatus: String,
  externalGrade: Boolean,
  score: {
    possible: Number,
    decimalPlaces: Number,
  },
  grading: {
    type: { type: String },
    due: Date,
    attemptsAllowed: Number,
    scoringModel: String,
    anonymousGrading: {
      type: { type: String },
      releaseAfter: Date
    },
    contentId: String
  }
})

const default_select = 'id externalId name externalGrade score grading contentId availability'
ColumnSchema.plugin(require('./base'))
ColumnSchema.statics = _base.statics

module.exports = mongoose.model('Column', ColumnSchema, 'columns')
