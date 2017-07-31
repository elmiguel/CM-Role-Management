
const User = require('./models/user')
const UserSetting = require('./models/user-setting')
const UserInventory = require('./models/user-inventory')
const Attempt = require('./models/attempt')
const BbUser = require('./models/bbuser')
const Column = require('./models/column')
const ColumnUser = require('./models/column-user')
const Content = require('./models/content')
const Course = require('./models/course')
const Membership = require('./models/membership')
const Term = require('./models/term')
const Token = require('./models/token')

export const MODELS: any = {
  users: BbUser,
  courses: Course,
  terms: Term,
  contents: Content,
  memberships: Membership,
  columns: Column,
  columnUsers: ColumnUser,
  groups: null,
  attempts: Attempt,
  announcements: null,
  children: null,
  version: null,
  dataSources: null,
  token: Token,
  dataSets: null,
  user: User,
  userSetting: UserSetting,
  userInventory: UserInventory
}

export const DEFAULT_ADMIN_USER: any = {
  userName: 'bbadmin',
  password: 'TEMPASSWORD',
  profile: { firstName: 'Admin', lastName: 'Overlord' },
  role: "Admin"
}

export const DEFAULT_ADMIN_BBUSER: any = {
  id: "_0_1",
  uuid: "00000000000000000000000000000000",
  externalId: "00000",
  dataSourceId: "_2_1",
  userName: "bbadmin",
  educationLevel: "Unknown",
  gender: "Unknown",
  __v: 0,
  contact: {
    email: "bbadmins@irsc.edu"
  },
  name: {
    title: "System Admin",
    family: "Overlord",
    given: "Admin"
  },
  systemRoleIds: [
    "SystemAdmin"
  ],
  availability: {
    available: "Yes"
  }
}


const winston = require('winston')
winston.emitErrs = true;
export const logPath: any = './logs/all-logs.log'
export const logger: any = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: logPath,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
})

export const stream: any = {
  write: (message: any, encoding: any) => {
    logger.info(message);
  }
}


export const allowed_users: any = ['usernames', 'listed', 'here']

export const jwtConfig: any = {
  secret: '<JWT-SECRET>',
  publicRoutes: ['/login']
}


export let mongooseConfig: any = {
  database: 'mongodb://localhost:27017/mean-cm-instructors',
  defaults: {
    select: '',
    populate: '',
    page: 0,
    limit: 30,
    sort: 1,
    criteria: {}
  }
}

export let cors: any = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// LDAP Settings
export const LDAPConfig: any = {
  ldap: {
    url: 'ldap://ip.add.re.ss',
    base: 'OU=<OU_HERE>',
    bindDN: '<USERNAME>',
    bindCredentials: '<PASSWORD>'
  },
  integrated: false,
  log: ''
}

// Different Module Settings
export const ADConfig: any = {
  url: 'ldap://ip.add.re.ss',
  baseDN: 'OU=<OU_HERE>',
  username: '<USERNAME>',
  password: '<PASSWORD>',
  attributes: {
    user: ['sAMAccountName', 'mail', 'employeeID', 'sn', 'givenName', 'displayName', 'memberOf']
  }
}

export let BbConfig: any = {
  key: '<KEY>',
  secret: '<SECRET>',
  credentials: 'client_credentials',
  cert_path: './trusted/keytool_crt.pem',
  url: 'https://<BB_LEARN_INSTANCE>/learn/api/public/v1',
  auth: ''
}

BbConfig.auth = new Buffer(BbConfig.key + ":" + BbConfig.secret).toString("base64")

// future implementation, id = number not _id_1!!
// id: 1234
export let COURSES_OF_INTEREST: any = [
  { externalId: '<MAIN_COURSE_OF_INTEREST>', id: '_ID_1' }
]
// id = number not _id_1
// id: 1234
export let ITEMS_OF_INTEREST: any = [
  { id: '_ID_1', name: "Total" }
]
