import * as _ from 'lodash'
import * as _base from './_base'

module.exports = exports = function bbPlugin(schema: any, options: any) {
  let handleE11000 = function(error: any, doc: any, next: any) {
    if (error.name === 'MongoError' && error.code === 11000) {
      next(new Error('There was a duplicate key error'))
    } else {
      next(error);
    }
  }

  schema.post('save', handleE11000);
  schema.post('update', handleE11000);
  schema.post('findOneAndUpdate', handleE11000);
  schema.post('insertMany', handleE11000);

  schema.set('toJSON', {
    // getters: options.getters || true,
    // virtuals: options.virtuals || false,
    transform: function(doc: any, ret: any, options: any) {
      delete ret.password
      return ret
    }
  })

  schema.set('timestamps', true)
}
