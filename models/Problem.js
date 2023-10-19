const mongoose = require('mongoose')


const problemSchema = new mongoose.Schema({
    id : {
        type : "String",
        required : true
    },
    title : {
        type : String,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    difficulty : {
        type : String,
        required : true
    },
    company : {
        type : String,
        required : true
    },
    desc : {
        type : String,
        required : true
    },
    examples : [
        {
          "input": {
            type: "String",
            required: true
          },
          "output": {
            type: "String",
            required: true
          },
          "explanation": {
            type: "String",
            required: false
          }
        } 
    ],
      
    testcase :[
        {
            "input": {
                type: "String",
                required: true       
            },
             "output":{
               type: "String",
               required : true
             }
        }

    ],
    submissions : {
        type : Number,
        required : false
    },
    accuracy : {
        type : Number,
        required : false
    }
    // judgingCode : {
    //     type : String,
    //     required : true
    // }   
})

module.exports = mongoose.model('Problem',problemSchema)