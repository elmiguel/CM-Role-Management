import * as mongoose from 'mongoose'
import * as _base from './_base'
const Schema = mongoose.Schema

let MembershipSchema = new Schema(_base.fields)
MembershipSchema.add({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'BbUser' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  userId: String,
  courseId: String,
  childCourseId: String,
  courseRoleId: String
})
MembershipSchema.plugin(require('./base'))
MembershipSchema.statics = _base.statics

module.exports = mongoose.model('Membership', MembershipSchema, 'memberships')
