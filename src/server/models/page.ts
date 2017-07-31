import * as mongoose from 'mongoose'
const Schema = mongoose.Schema

let PageSchema = new Schema({
  title: String,
  tag: String,
  body: String,
  date: { type: Date, default: Date.now }
},
{
  timestamps: true
})

const default_select = 'title tag body date'

PageSchema.statics = {
  load: (options:any, cb:any) => {
    let select = options.select || default_select
    return this.findOne(options.critera)
               .select(select)
               .exec(cb)
  },

  list: function (options:any, cb:any) {
    let criteria = options.criteria || {}
    let select = options.select || default_select
    let sort = options.sort || 1
    let page = options.page || 0
    let limit = options.limit || 30
    return this.find(criteria)
               .select(select)
               .populate('pages', select)
               .sort({ _id: sort })
               .limit(limit)
               .skip(limit * page)
               .exec(cb)
  }
}
export default mongoose.model('Page', PageSchema, 'pages')
