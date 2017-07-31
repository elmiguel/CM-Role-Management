import { LDAPConfig, MODELS } from '../config'

const WindowsStrategy = require('passport-windowsauth')

/**
 * Expose
 */

module.exports = (logger: any) => {
  let options = LDAPConfig

  if (logger) {
    options.log = logger
  }

  return new WindowsStrategy(
    options,
    (profile: any, done: any) => {
      let options = {
        criteria: { userName: profile._json.sAMAccountName }
      }

      MODELS.user.load(options, (err: any, user: any) => {
        if (err) throw (err)
        if (user) {
          done(null, user)
        }
      })
    }
  )
}
