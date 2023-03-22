const router = require('express').Router()
const OccupationModel = require('../models/OccupationModel')

router.get('/job', (req, res) => {
    OccupationModel.find().then(results => {
        res.sends(results, 200)
    })
})

module.exports = router