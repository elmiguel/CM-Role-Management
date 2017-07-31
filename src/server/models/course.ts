import * as mongoose from 'mongoose'
import * as _base from './_base'
const Schema = mongoose.Schema

let CourseSchema = new Schema(_base.fields)
CourseSchema.add({
  courseId: String,
  name: String,
  organization: Boolean,
  ultraStatus: String,
  allowGuests: Boolean,
  readOnly: Boolean,
  enrollment: {
    type: { type: String }
  },
  locale: {
    force: Boolean
  }
})

const default_select = 'id uuid externalId courseId courseName organization availability'
CourseSchema.plugin(require('./base'))
CourseSchema.statics = _base.statics

module.exports = mongoose.model('Course', CourseSchema, 'courses')
