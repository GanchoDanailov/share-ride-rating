var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
    taskAddedForUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model("Task", TaskSchema);

// var mongoose = require('mongoose');
//
// var PostSchema = new mongoose.Schema({
//     title: String,
//     postedBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     comments: [{
//         text: String,
//         postedBy: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User'
//         }
//     }]
// });
//
// module.exports = mongoose.model("Post", PostSchema);
