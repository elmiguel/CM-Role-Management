const promise = require('bluebird')

export let fields = {
  id: String,
  uuid: String,
  externalId: String,
  dataSourceId: String,
  availability: {
    available: String,
    duration: {
      type: { type: String }
    }
  }
}

export let statics: any = {
  load: function(options: any) {
    return this.findOne(options.criteria || {})
      // return this.findOne({ userName: 'mbechtel' })
      .select(options.select || '')
      .populate(options.populate || '')
      .exec()
  },

  list: function(options: any) {
    let limit = options.limit || 30
    let page = options.page || 0
    return this.find(options.criteria || {})
      .select(options.select || '')
      .populate(options.populate || '')
      .sort({ _id: options.sort || 1 })
      .limit(limit)
      .skip(limit * page)
      .exec()
  },

  findOrCreate: function(options: any) {
    return promise.resolve(
      this.findOne(options.criteria || {})
        .select(options.select || '')
        .populate(options.populate || '')
        .exec()
    )
      .then((doc: any) => {
        if (!doc || doc == undefined) {
          doc = { message: "Could not find any documents based off the criteria given:", criteria: options.criteria || {} }
        }
        return doc
      })
      .then((result: any) => result)
  }
}
