import crypto = require('crypto')
import * as _ from 'lodash'
import * as _base from './_base'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

let ContentSchema = new Schema(_.merge(_base.fields, {
  availability: {
    available: String,
    allowGuests: Boolean,
    adaptiveRelease: {
      start: Date,
      end: Date
    }
  }
}))

ContentSchema.add({
  parentId: String,
  title: String,
  body: String,
  description: String,
  position: Number,
  hasChildren: Boolean,
  hasGradebookColumns: Boolean,
  hasAssociatedGroups: Boolean,
  contentHandler: {
    id: String
  }
})

const default_select = 'id parentId title body position hasChildren availability'
ContentSchema.statics = _base.statics

module.exports = mongoose.model('Content', ContentSchema, 'contents')
