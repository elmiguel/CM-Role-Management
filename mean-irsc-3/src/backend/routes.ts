import * as express from 'express'
const router = express.Router()

router.get('/', (req:any, res:any) => {
  res.sendFile('index.html')
})

export default router
