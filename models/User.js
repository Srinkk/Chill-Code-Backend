const mongoose =  require('mongoose');
const Problem = require('./Problem');

const userSchema = new mongoose.Schema({
    password : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required: true
    },
    e_mail :{
        type :String,
        required : true
    },
    rating: {
        type: Number,
        required: true
    },
    solvedProblems: {
        hard: {
            type: Number,
            required: true
        },
        medium: {
            type: Number,
            required: true
        },
        easy: {
            type: Number,
            required: true
        },
        problems: [{
            id: {
                type: mongoose.Schema.Types.ObjectId
            },
            title: {
                type: String
            },
            difficulty: {
                type: String
            }
        }]
    },
    streak: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model ('User',userSchema)