import * as express from 'express'
import * as path from 'path'
import * as fs from 'fs'
import * as async from 'async'
import * as nunjucks from 'nunjucks'
import * as bodyParser from 'body-parser'

const env = process.env.NODE_ENV || 'development'
const port = process.env.PORT || 3000
const app = express()
const nunjucks_options = {
  autoescape: true,
  express: app
}

app.set('view engine', 'html')
app.set('views', path.resolve(__dirname, 'app'))
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

console.log(path.resolve(__dirname, '../dist', 'public'))

app.use(parallel([
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
]))
// app.use('/js', express.static(path.resolve(__dirname, 'public', 'js')))
// app.use('/css', express.static(path.resolve(__dirname, 'public', 'css')))

app.get('*', (req: any, res: any) => {
  let _file = path.join(req.app.get('views'), req.path)
  let fileExists = fs.existsSync(_file)
  let user: any = {}
  if (req.user) {
    user = req.user.toJSON()
  }
  if (!req.path.endsWith('.html') && fileExists) {
    res.sendFile(_file)
  } else {
    res.render('index', { data: { user: user, route: req.path } })
  }
})

app.use('/', require('./routes').default)

// error handler
app.use((err: any, req: any, res: any, next: any) => {
  if (err.name != 'UnauthorizedError') return next(err)
  res.redirect('/')
})

app.listen(port, (err: Error) => {
  if (err) {
    console.error('There was an error while trying to start the server:', err)
  }

  console.log(`Server is listening on port: ${port}`)
})
