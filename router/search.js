const router = require('express').Router()
const search_handler = require('../router_handler/search_handler')

router.get('/people', search_handler.searchPeople)

router.get('/group', search_handler.searchGroup)

// router.get('/users', search_handler.searchUserFriendAndGroup)

module.exports = router