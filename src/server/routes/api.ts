import * as express from 'express'
import * as mongoose from 'mongoose'
import {MODELS} from '../config'
const promise = require('bluebird')
const sendJson = require('../middleware/sendJson')
const bbRestApi = require('../middleware/bbrest-api')
const router = express.Router()

router.get('/', (req, res) => {
  sendJson(res, null, { message: "Hello from Node + Express API!" })
})

router.get('/user/:userName', (req: any, res: any) => {
  // attempt to load the user and thier settings
  console.log(req.params)
  promise.resolve(
    MODELS.users.load({ list: false, select: '', criteria: req.params })
  )
    .then((user: any) => {
      console.log(req.path, 'then()', user)
      return promise.all([
        MODELS.userSetting.load({ list: false, select: '', criteria: { user: user } }),
        user
      ])
    })
    .then(([userSetting, user]: any) => {
      // if no userSetting and there is a user, then create a new userSetting
      let _userSetting: any
      if (!userSetting && user) {
        return new promise((resolve: any, reject: any) =>
          new MODELS.userSetting({ user: user })
            .save()
            .then((doc: any) => resolve(doc)))
      } else {
        // there is already a userSetting
        return userSetting
      }
    })
    .then((result: any) => sendJson(res, null, result))
})

router.post('/user/:userName', (req: any, res: any) => {
  promise.all([
    // bbRestApi.setDataToDb(req, MODELS.userSetting, req.body, { many: false, populate: 'user', criteria: { userName: req.params.userName } })
    bbRestApi.setDataToDb(req, MODELS.userSetting, req.body, { many: false, populate: 'user' })
  ]).then((userSetting: any) => {
    sendJson(res, null, userSetting)
  })
  .catch((err:any) => sendJson(res, err, {message: err.message}))
})
router.get('/user/:userName/courses', (req: any, res: any) => {

  promise.resolve(
    MODELS.memberships.find({})
    .populate({
      path: 'user',
      model: 'BbUser',
      match: { _id: req.params.userName },
      populate: [
        { path: 'user', model: 'User'},
        { path: 'courses.course', model: 'Course'},
      ]
    })
    ).then((memberships: any) => {
    if(Array.isArray(memberships)) {
      memberships = memberships[0]
    }
    sendJson(res, null, memberships)
  })
  .catch((err:any) => sendJson(res, err, {message: err.message}))
})

router.get('/user/:userName/inventory', (req: any, res: any) => {
  promise.resolve(
    MODELS.userInventory.find({}).populate({
      path: 'user',
      model: 'BbUser',
      match: { userName: req.params.userName }
    })
      .populate({
        path: 'inventory',
        model: 'UserSetting',
        populate: [
          { path: 'user', model: 'BbUser' },
          { path: 'courses', model: 'Course' },
          { path: 'terms', model: 'Term' }
        ]
      })
  )
    .then((inventory: any) => {
      // find always return an array, so if the length is zero, then we
      // do not have an inventory, we have to load the user then pass it along
      if (inventory.length == 0) {
        // load the user and set the inventory to null
        return promise.all([
          MODELS.users.load({ list: false, select: '', criteria: req.params }),
          null
        ])
      } else {
        // we have an inventory, pass it along
        return promise.all([
          null,
          inventory
        ])
      }
    })
    .then(([user, inventory]: any) => {
      // at this stage, if we have a user and we do not have an inventory,
      // create the inventory and set the user and pass it along
      if (user && !inventory) {
        console.log('Yes we do, creating new inventory....')
        return new promise((resolve: any, reject: any) => new MODELS.userInventory({ user: user }).save().then((doc: any) => resolve(doc)))
      } else {
        return inventory
      }
    })
    .then((inventory: any) => {
      // finally, we have an inventory
      // find always returns an array, since this is a single instance, reset
      if(Array.isArray(inventory)) {
        inventory = inventory[0]
      }
      sendJson(res, null, inventory)
    })
})

router.post('/user-settings/:userSetting/term/add', (req: any, res: any) => {
  console.log(req.body)
  promise.resolve(
    MODELS.userSetting.update({ _id: req.params.userSetting }, { $push: { terms: req.body } })
  )
    .then((inventory: any) => {
      console.log('Updated Inventory => ', inventory)
      sendJson(res, null, inventory)
    })
})

router.post('/user-settings/:userSetting/term/remove', (req: any, res: any) => {
  console.log(req.body)
  promise.resolve(
    MODELS.userSetting.update({ _id: req.params.userSetting }, { $pull: { terms: { $in: [req.body] } } })
  )
    .then((inventory: any) => {
      sendJson(res, null, inventory)
    })
})

router.post('/user-settings/:userSetting/courseFilter/add', (req: any, res: any) => {
  console.log('req.params.userSetting => ', req.params.userSetting)
  console.log(req.body)
  promise.resolve(
    MODELS.userSetting.update({ _id: req.params.userSetting }, { $push: { courseFilters: req.body.courseId } })
  )
    .then((inventory: any) => {
      console.log('Updated Inventory => ', inventory)
      sendJson(res, null, inventory)
    })
})

router.post('/user-settings/:userSetting/courseFilter/remove', (req: any, res: any) => {
  console.log('req.params.userSetting => ', req.params.userSetting)
  console.log(req.body)
  promise.resolve(
    MODELS.userSetting.update({ _id: req.params.userSetting }, { $pull: { courseFilters: { $in: [req.body.courseId] } } })
  )
    .then((inventory: any) => {
      sendJson(res, null, inventory)
    })
})



// this will just update the userSetting.courses as a snapshot
router.post('/user-settings/:userSetting/courses', (req: any, res: any) => {
  console.log(req.path)
  console.log('attempting to update userSetting.courses =>', req.body)
  promise.all([
    req.body,
    MODELS.userSetting.load({criteria: {_id: req.params.userSetting}})
  ])
  .then(([courses, userSetting]:any) => {
    let _memberships:any = []
    if (courses.length > 0) {
      for (let [i, membership] of courses.entries()) {
        console.log(`membership[${i}]:`, membership)
        // MODELS.userSetting.update(
        //   { _id: userSetting._id },
        //   { $push: { courses: { course: membership } } }
        // )
        // .exec()
        // .then((doc:any) => _memberships.push(doc))
        // MODELS.userSetting.findByIdAndUpdate(userSetting._id, { $push: { courses: { course: membership } } })

        MODELS.courses.load({ criteria: { _id: membership._id } })
          .then((course:any) => {
            // MODELS.userSetting.findByIdAndUpdate(userSetting._id, { $push: { courses: { course: course } } })
            // .exec()
            // .then((doc:any) => _memberships.push(doc))
            MODELS.userSetting.update(
              { _id: userSetting._id },
              { $push: { courses: { course: membership } } }
            )
            .exec()
            .then((doc:any) => _memberships.push(doc))
          })
      }
    }

    // return [courses, userSetting, promise.resolve(_memberships)]
    // return promise.resolve(_memberships)
    return promise.all(_memberships)
  })
  // .then(([courses, userSetting]:any) => {
  //   sendJson(res, null, { courses, userSetting})
  // })
  .then((memberships:any) => {
    sendJson(res, null, memberships)
  })
  .catch((err:any) => sendJson(res, err, { message: err.message }))


  // promise.resolve(
  //   MODELS.userSetting.load({criteria: {_id: req.params.userSetting}})
  // )
  //   .then((userSetting: any) => {
  //     if(!userSetting) {
  //       // at the level, is there is no userSetting, we need to bail out
  //       return promise.all([null, null])
  //     }
  //     else {
  //       return promise.all([
  //         MODELS.users.load({ criteria: { _id: userSetting.user._id }}),
  //         MODELS.userSetting.update({ _id: userSetting._id }, { $set: { courses: req.body } })
  //       ])
  //     }
  //   })
  //   .then(([user, userSetting]:any) => {
  //     if(user == undefined && userSetting == undefined) {
  //       // nothing to see here, carry on...
  //       return 0
  //     } else {
  //       return userSetting
  //     }
  //   })
  //   .then((result:any) => {
  //
  //     return promise.resolve(
  //       MODELS.userSetting.load({criteria: {_id: req.params.userSetting}})
  //     )
  //   })
  //   .then((result: any) => {
  //     console.log('Updated User Setting Courses => ', result)
  //     sendJson(res, null, result)
  //   })
})


router.post('/inventory/:inventory/add', (req: any, res: any) => {
  promise.resolve(
    MODELS.userInventory.update({ _id: req.params.inventory }, { $push: { inventory: req.body } })
  )
    .then((inventory: any) => {
      console.log('Updated Inventory => ', inventory)
      sendJson(res, null, inventory)
    })
})

router.post('/inventory/:inventory/remove', (req: any, res: any) => {
  console.log(req.body)
  promise.resolve(
    MODELS.userInventory.update({ _id: req.params.inventory }, { $pull: { inventory: { $in: [req.body] } } })
  )
    .then((inventory: any) => {
      sendJson(res, null, inventory)
    })
})

router.get('/courses/:courseId', (req: any, res: any) => {
  console.log('%'.repeat(100))
  console.log('%'.repeat(100))
  console.log(req.params)
  console.log('%'.repeat(100))
  console.log('%'.repeat(100))
  promise.resolve(
    MODELS.courses.load({criteria: {_id: req.params.courseId } })
  )
  .then((doc:any) => {
    if(Array.isArray(doc)){
      doc = doc[0]
    }
    sendJson(res, null, doc)
  })
})

export = router
