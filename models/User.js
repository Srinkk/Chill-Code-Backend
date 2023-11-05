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
<<<<<<< HEAD
    rating: {
        type: Number,
        required: true
    },
=======
    // problems : [
    //     {
    //         problemId : {
    //             type : mongoose.Schema.Types.ObjectId,
    //             ref : Problem,
    //             required : true
    //         },
    //         status : {
    //             type : String,
    //             default : "Unsolved"
    //         },
    //         language: {
    //             type : String,
    //             default : 'c++'
    //         },
    //         code : {
    //             type : String,
    //             required : true
    //         }
    //     }
    // ],
    // rating: {
    //     type: Number,
    //     required: true
    // },
>>>>>>> abffd2db0b859f3e0d1418bd1f766fe8e3933c9e
    solvedProblems: {
        hard: {
            type: Number,
            default : 0
        },
        medium: {
            type: Number,
            default : 0
        },
        easy: {
            type: Number,
            default : 0
        },
<<<<<<< HEAD
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
=======
        problems: [
        {
           problemId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : Problem,
            required : true
           },
           solution: [{
             cpp: {
                type : String,
                default:"code in cpp"
             },
             java: {
                type : String,
                default:"code in java"
             },
             python: {
                type : String,
                default:"code in python"
             }
           }]
        }
    ]
>>>>>>> abffd2db0b859f3e0d1418bd1f766fe8e3933c9e
    },
    streak: {
        type: Number,
        default : 0
    },
    last_potd : {
        type : Date
    }
<<<<<<< HEAD
=======


    

>>>>>>> abffd2db0b859f3e0d1418bd1f766fe8e3933c9e
})

module.exports = mongoose.model ('User',userSchema)