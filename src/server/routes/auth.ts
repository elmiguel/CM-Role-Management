import { jwtConfig } from '../config'
import * as express from 'express'
import * as path from 'path'

const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn

const passportService = require('../passport')
const router = express.Router()

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false, successReturnToOrRedirect: '/', failureRedirect: '/login' })
const requireLogin = passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' })

// Constants for role types
const REQUIRE_ADMIN = "Admin"
const REQUIRE_OWNER = "Owner"
const REQUIRE_CLIENT = "Client"
const REQUIRE_MEMBER = "Member"

router.use(passport.initialize())
router.use(passport.session())

router.get('/', ensureLoggedIn('/login'), (req: any, res: any) => {
  res.render('app.html', { user: req.user.toJSON() })
})

router.get('/logout', (req: any, res: any) => {
  req.logout()
  res.redirect('/login')
})

router.get('/login', (req: any, res: any) => {
  if (req.user) {
    res.redirect('/')
  } else {
    res.render('index.html')
  }
})

router.post('/login', requireLogin)

export = router
