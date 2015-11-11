var mongoose = require('mongoose');

var driverSchema = new mongoose.Schema({
    // taskAddedForUsers: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // }]

    driverName : String,
    driverCar: Date
});

module.exports = mongoose.model('Driver', driverSchema);
