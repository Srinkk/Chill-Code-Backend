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
    submitProblem
   
}


