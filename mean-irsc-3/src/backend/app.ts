import * as express from 'express'
import * as path from 'path'

const app = express()
const port = process.env.NODE_ENV || 3000

app.use(express.static(path.join(__dirname, '../', 'frontend')))

app.use(require('./routes').default())

app.listen(port)
