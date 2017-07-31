/**
 * Module dependencies.
 */
import {MODELS} from '../config'
const LocalStrategy = require('passport-local').Strategy


/**
 * Expose
 */

module.exports = new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  (username: string, password: string, done: any) => {
    var options = {
      criteria: { userName: username },
      select: 'username'
    }
    MODELS.user.load(options, (err: any, user: any) => {
      if (err) return done(err)
      if (!user) {
        return done(null, false, { message: 'Unknown user' })
      }
      //if (!user.authenticate(password)) {
      //  return done(null, false, { message: 'Invalid password' })
      //}
      return done(null, user)
    })
  }
)
