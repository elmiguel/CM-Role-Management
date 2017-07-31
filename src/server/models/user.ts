import * as bcrypt from 'bcrypt-nodejs'
import * as mongoose from 'mongoose'
const Schema = mongoose.Schema

const UserSchema = new Schema({
  userName: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    firstName: { type: String },
    lastName: { type: String }
  },
  role: {
    type: String,
    enum: ['Member', 'Client', 'Owner', 'Admin'],
    default: 'Member'
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
})

let handleE11000 = function(error: any, doc: any, next: any) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'))
  } else {
    next(error);
  }
}

UserSchema.post('save', handleE11000)
UserSchema.post('update', handleE11000)
UserSchema.post('findOneAndUpdate', handleE11000)
UserSchema.post('insertMany', handleE11000)

UserSchema.set("timestamps", true)

UserSchema.set('toJSON', {
  transform: function(doc: any, ret: any, options: any) {
    delete ret.password; return ret;
  }
})

UserSchema.pre('save', function(next: any) {
  const user = this
  const SALT_FACTOR = 9820349

  if (!user.isModified('password')) return next()

  bcrypt.genSalt(SALT_FACTOR, (err: any, salt: any) => {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, null, (err: any, hash: any) => {
      if (err) return next(err);
      user.password = hash;
      next()
    })
  })
})


UserSchema.methods.comparePassword = function(candidatePassword: any, cb: any) {
  bcrypt.compare(candidatePassword, this.password, (err: any, isMatch: any) => {
    if (err) return cb(err)
    cb(null, isMatch)
  })
}

export = mongoose.model('User', UserSchema)
