const Problem = require('../models/Problem')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')
var compiler = require('compilex');


var options = {stats : true}; 
compiler.init(options);

// @desc Get all problems
// @route GET /problem
// @access Private
const getAllProblems = asyncHandler(async(req,res)=>{
    const page = parseInt(req.query.page) || 1;
    const perPage = 5;

    const skip = (page -1)*perPage;

    try {
        const problems = await Problem.find()
          .skip(skip)
          .limit(perPage)
          .lean()

          if ( !problems?.length )
          {
              return res.status(400).json ({message : 'No Problem Found'})
          }
          res.status(200).json(problems)

    } catch(error)
    {
        return res.status(500).json({message : "Server Error"});
    }  
   
})

// @desc run problem
// @route POST /problem/run
// @access Private

const runProblem = asyncHandler(async(req,res)=>{
    const {_id,code,language,inputRadio} = req.body
    const problem  = await Problem.findOne({_id:_id}).exec()

    if (!language)
    {
        language  = 'c++'
    }
    for (const testCase of problem.testcase)
    {
        const input = testCase.input
        const expectedOutput = testCase.output
        // const input = testValues.split(',').filter(value => value.trim() !== '')
    
    if(!input?.length || !expectedOutput?.length)
    {
        res.status(400).json ({message : "No data found"})
    }
    // res.status(200).json({message : "Success"})
    console.log("Input" ,input)
    console.log("Expected Output",expectedOutput)
    console.log("Language" , language)
    console.log("code: ",code)
    console.log("input",inputRadio)

    if(language === 'c' || language === 'c++')
    {
      if(inputRadio === "true")
      {
          var envData = { OS : "windows" , cmd : "g++", options : {timeout : 10000} };
          
          
          compiler.compileCPPWithInput(envData, code, input, function(data){
              if(data.error) {
                  res.status(400).json({error: data.error});
                }
                else {
                    if (data.output === expectedOutput){ 
                    console.log("Test Case Passed")
                    res.status(200).json(data.output)
                   }
                   else {
                    console.log("Test Case Failed")
                    res.status(401).json(data.output)
                   }
                   
                }
          });
        
      }
      else {
          var envData = { OS : "windows" , cmd : "g++", options : {timeout : 10000}};
          compiler.compileCPP(envData, code, function(data){
            if(data.error){
              console.log(data.error);
              res.send(data.error);
            } 
            else {
                if (data.output === expectedOutput){ 
                console.log("Output Matched :",data.output)
                res.status(200).json(data.output)
               }
               else {
                console.log("Output not matched:",data.output)
                res.status(201).json(data.output)
               }
               
            }
          }); 
      }
    }   
    
}

try {
    const fullStatData = await new Promise((resolve) => {
        compiler.fullStat(resolve);
    });
    console.log(fullStatData);
} catch (error) {
    console.error(error);
}
console.log('All temporary files flushed !');
})





// @desc show problem
// @route POST /problem/show
// @access Private
const showProblem =  asyncHandler(async(req,res)=>{
    const {_id} = req.body

    if(! _id)
    {
        return res.status(400).json({message : "Id is required"})
    }
    const problem = await Problem.findOne({_id : _id}).lean().exec()
   
    if(problem)
    {
        return res.status(200).json(problem)
    }
   
})

// @desc create problem
// @route POST /problem
// @access Private
const createNewProblem = asyncHandler(async(req,res) => {
    const { _id, id, title, category, difficulty, company, desc, example, testcase } = req.body

    if( ! id)
    {
        return res.status(400).json({message : "Id is required"})
    }
    const duplicate = await Problem.findOne({id}).lean().exec()

    if(duplicate) {

        return res.status(409).json({message : "Duplicate Id"})
    }

    const problemObject = { _id, id, title, category, difficulty, company, desc, example, testcase }
    const problem = await Problem.create(problemObject)

    if(problem)
    {
        res.status(201).json({message : `New Problem with id ${id} craeted`})
    }
    else {
        res.status(400).json({message : 'Invalid user data received'})
    }
    
})

// @desc submit problem
// @route POST /problem/submit
// @access Private

const submitProblem = asyncHandler(async(req,res)=>{
    const { user_id,problem_id} = req.body;
    const problem = await Problem.findOne({_id : problem_id}).lean().exec();
    console.log(problem._id);
    const user =  await User.findOne({_id :user_id}).lean().exec();
    user.problems.forEach(problem => {
        console.log(problem.problemId)
    });
    // user.problems[0].problemId = problem._id;
    // user.problems[0].status = "Solved";
    const updateUser = await user.save();
    console.log(updateUser);
     if (updateUser)
     {
        res.status(200).json({message:"User Updated "})
     }
     

})



module.exports = {
    getAllProblems,
    createNewProblem,
    submitProblem,
    showProblem,
    runProblem,
  
   
}


