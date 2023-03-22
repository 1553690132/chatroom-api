const mongoose = require('../db/index')

const OccupationSchema = new mongoose.Schema({
    job: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
})

module.exports = mongoose.model('Occupation', OccupationSchema, 'ct_occupation')