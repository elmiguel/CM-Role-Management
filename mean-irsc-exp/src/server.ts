import * as cluster from 'cluster'
const numCPUs = require('os').cpus().length
const env = process.env.NODE_ENV || 'development'
if (env === 'production') {
  if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork()
    }
    cluster.on('online', worker => console.log(`Worker ${worker.process.pid} is online.`))
    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`)
      console.log('Starting a new worker')
      cluster.fork()
    })
    Object.keys(cluster.workers).forEach((id: any) => console.log(id, process.argv))
  } else {
    require('./app')
  }
} else {
  require('./app')
}
