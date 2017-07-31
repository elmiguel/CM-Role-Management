import {jwtConfig, MODELS} from '../config'
const crypto = require('crypto')
const jwt = require('jsonwebtoken')


function generateToken(user: any) {
  return jwt.sign(user, jwtConfig.secret, {
    expiresIn: 10080 // in seconds
  })
}

// Set user info from request
function setUserInfo(request: any) {
  return {
    _id: request._id,
    firstName: request.profile.firstName,
    lastName: request.profile.lastName,
    username: request.username,
    role: request.role
  }
}

export function setToken(req: any, res: any, next: any) {
  let userInfo = setUserInfo(req.user)
  let token = 'JWT ' + generateToken(userInfo)
  req.headers.authorization = token
  next()
}

export function roleAuthorization(role: any) {
  return function(req: any, res: any, next: any) {
    const user = req.user;

    MODELS.user.findById(user._id, function(err: any, foundUser: any) {
      if (err) {
        res.status(422).json({ error: 'No user was found.' });
        return next(err)
      }

      // If user is found, check role.
      if (foundUser.role == role) {
        return next()
      }

      res.status(401).json({ error: 'You are not authorized to view this content.' })
      return next('Unauthorized')
    })
  }
}
