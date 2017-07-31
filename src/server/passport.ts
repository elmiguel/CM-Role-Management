import { jwtConfig, MODELS } from './config'
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')
const localOptions = { usernameField: 'username' }

const localLogin = new LocalStrategy(localOptions, (username: any, password: any, done: any) => {
  MODELS.user.findOne({ userName: username }, (err: any, user: any) => {
    if (err) return done(err)

    if (!user) return done(null, false, { error: 'Your login details could not be verified. Please try again.' })

    user.comparePassword(password, (err: any, isMatch: any) => {
      if (err) return done(err)

      if (!isMatch) return done(null, false, { error: "Your login details could not be verified. Please try again." })

      return done(null, user);
    })
  })
})
const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  // Telling Passport where to find the secret
  secretOrKey: jwtConfig.secret
}
// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload: any, done: any) => {
  console.log('[jwtLogin]', payload)
  MODELS.user.findById(payload._id, (err: any, user: any) => {
    if (err) return done(err, false)

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  })
})


passport.use(jwtLogin)
passport.use(localLogin)

passport.serializeUser((user: any, cb: any) => {
  cb(null, user._id)
})

passport.deserializeUser((id: any, cb: any) => {
  MODELS.user.findById(id, (err: any, user: any) => {
    if (err) return cb(err)
    cb(null, user)
  })
})
