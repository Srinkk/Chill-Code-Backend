const mongoose =  require('mongoose');
const Problem = require('./Problem');


const userSchema = new mongoose.Schema({
    userId:{
        type : "String",
        required: true
    },
    password : {
        type : "String",
        required : true
    },
    name : {
        type : "String",
        required : true
    },
    e_mail :{
        type :String,
        required : true
    },
    problems : [
        {
            problemId : {
                type : mongoose.Schema.Types.ObjectId,
                ref : Problem,
                required : true
            },
            status : {
                type : String,
                default : "Unsolved"
            }

        }
    ]

    

    

})

module.exports = mongoose.model ('User',userSchema)