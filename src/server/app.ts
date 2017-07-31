import * as express from 'express'
import * as session from 'express-session'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as async from 'async'
import * as methodOverride from 'method-override'
import * as nunjucks from 'nunjucks'
import * as config from './config'

const bbRestApi = require('./middleware/bbrest-api')
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
const mongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')
const env = process.env.NODE_ENV || 'development'
const port = process.env.PORT || 3000

process.env.DEBUG = process.env.NODE_DEBUG == 'bbApi' ? true : false

fs.pathExists(config.logPath)
  .then((exists: any) => {
    if (!exists) {
      fs.createFile(config.logPath)
      console.log(`${config.logPath} was created.`)
    }
  })

mongoose.Promise = require('bluebird')
mongoose.connection.once('open', () => {
  mongoose.connection.on('error', (err: any) => {
    console.log(err)
  })
  // mongoose.connection.dropDatabase((err: any, result: any) => {
  //   console.log('dropped database')
  // })
})
mongoose.connect(config.mongooseConfig.database)
/*
  CREATE DEFAULT ADMIN IF NOT EXISTS
*/

let bbAdmin = config.MODELS.user.findOne({ userName: 'bbadmin' }).exec()
bbAdmin.then((existingUser: any) => {
  if (existingUser) return

  let user = new config.MODELS.user(config.DEFAULT_ADMIN_USER)
  user.save()
    .then(function(err: any, user: any) {
      // if (err) throw (err)
      console.log('Trying to save bbadmin to users collection for demo')
      if (err) {
        console.log('Error, most likey the user already exists!')
      } else {
        // let userInfo = {
        //   _id: user._id,
        //   firstName: user.profile.firstName,
        //   lastName: user.profile.lastName,
        //   username: user.userName,
        //   role: user.role
        // }
        // console.log(userInfo)
        console.log('bbadmin user was found in users collection')
      }
    }).catch((err: any) => {
      console.log(err)
    })
})
  .catch((err: any) => console.error(err))


// Also Create one for the bbusers collection to help in app functionality
bbAdmin = config.MODELS.users.findOne({ userName: 'bbadmin' }).exec()
bbAdmin.then((existingUser: any) => {
  if (existingUser) {
    return
  }

  let user = new config.MODELS.users(config.DEFAULT_ADMIN_BBUSER)

  user.save()
    .then(function(err: any, user: any) {
      // if (err) throw (err)
      console.log('Trying to save bbadmin to bbusers collection for demo')
      if (err) {
        console.log('Error, most likey the user already exists!')
      } else {
        console.log('bbadmin user was found in bbusers collection')
      }
    }).catch((err: any) => {
      console.log(err)
    })
},
  (err: any) => console.error(err))


/* END OF ADMIN USER */


const app = express()
const nunjucks_options = {
  autoescape: true,
  express: app
}
app.locals.bb = {}
app.locals.bb.apiUrl = config.BbConfig.url
app.locals.bb.models = config.MODELS

config.MODELS.token.getToken((token: any) => {
  if (token && token.isValid()) {
    app.locals.bb.payload = token
  } else {
    bbRestApi.setToken((token: any) => {
      app.locals.bb.payload = token
    })
  }
})

let angular_path = path.resolve(__dirname, '..', '..', 'dist', 'public')
let static_path: string = path.resolve(__dirname, 'public')
if (env === 'production') {
  static_path = angular_path
}

app.set('views', [static_path, angular_path])
nunjucks.configure(app.get('views'), nunjucks_options)

app.set('x-powered-by', false)
app.enable('trust proxy')

// Helper function to side load all middleware in async mode
function parallel(middlewares: any) {
  return (req: any, res: any, next: any) => {
    async.each(middlewares, (mw: any, cb: any) => {
      mw(req, res, cb);
    }, next);
  };
}

app.use(parallel([
  require('morgan')("combined", { "stream": config.stream }),
  cookieParser(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  methodOverride((req: any) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
  }),
  session({
    secret: config.jwtConfig.secret,
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({
      url: config.mongooseConfig.database,
      collection: 'sessions'
    })
  })
]))

app.use('/', require('./routes/auth'))
app.use('/api', ensureLoggedIn('/login'), require('./routes/api'))
app.use('/bbapi', ensureLoggedIn('/login'), require('./routes/bbapi'))
/*
  catch all for static files, since the current setup cannot take an express.static()
  as this will render the use user injecto to angular void.
*/
app.get('*', (req: any, res: any) => {
  let _file = path.join(req.app.get('views')[1], req.path)
  let fileExists = fs.existsSync(_file)
  if (!req.path.endsWith('.html') && fileExists) {
    res.sendFile(_file)
  } else {
    res.redirect('/')
  }
})

// error handler
app.use((err: any, req: any, res: any, next: any) => {
  if (err.name != 'UnauthorizedError') return next(err)
  console.log('err.name')
  res.redirect('/login')
})

app.listen(port, (err: Error) => {
  if (err) {
    console.error('There was an error while trying to start the server:', err)
  }

  console.log(`Server is listening on port: ${port}`)
})
