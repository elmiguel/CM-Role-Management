import { ADConfig } from '../config'
const ActiveDirectory = require('activedirectory');

module.exports = (options: any) => {
  if (!options) {
    options = ADConfig
  }

  return new ActiveDirectory(options)
}
