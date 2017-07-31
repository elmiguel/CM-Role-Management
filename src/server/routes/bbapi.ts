import * as express from 'express'
import * as _ from 'lodash'
import {BbUserController} from '../controllers/BbUserController'
import {CourseController} from '../controllers/CourseController'
import {GradebookController} from '../controllers/GradebookController'
import {TermController} from '../controllers/TermContoller'

const sendJson = require('../middleware/sendJson')
const request = require('request')
const router = express.Router({ mergeParams: true })
const bbRestApi = require('../middleware/bbrest-api')

router.use(bbRestApi.api)

// Base home API Route
router.get('/', (req, res) => {
  sendJson(res, null, { message: "Hello from Node + Express API!" })
})

// Users Routes
router.all('/users', BbUserController.list)
router.all('/users/:userId', BbUserController.load)
router.all('/users/:userId/courses', BbUserController.courses2)

// Courses routes
router.all('/courses', CourseController.list)
router.all('/courses/:courseId', CourseController.load)

// Membership routes
router.all('/courses/:courseId/users', CourseController.users)
router.all('/courses/:courseId/users/:userId', CourseController.user)

// Gradebook routes
router.all('/courses/:courseId/gradebook/columns', GradebookController.columns)
router.all('/courses/:courseId/gradebook/columns/:columnId', GradebookController.column)

// Graded Item Attempts routes
router.all('/courses/:courseId/gradebook/columns/:columnId/attempts', GradebookController.attempts)
router.all('/courses/:courseId/gradebook/columns/:columnId/attempts/:attemptId', GradebookController.attempt)

// User Grades per Graded Items routes
router.all('/courses/:courseId/gradebook/columns/:columnId/users', GradebookController.columnUsers)
router.all('/courses/:courseId/gradebook/columns/:columnId/users/:userId', GradebookController.columnUser)

// User Grades routes
router.all('/courses/:courseId/gradebook/users/:userId', GradebookController.user)

// Term routes
router.all('/terms', TermController.list)
router.all('/terms/:termId', TermController.load)


export = router
