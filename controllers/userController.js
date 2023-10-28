const User = require('../models/User')
const Problem = require('../models/Problem')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')


// @desc get user
// @route POST /user/login
// @access Private
const getUserId = asyncHandler(async(req,res)=>{
    const  { e_mail , password } = req.body

    if ( !e_mail || !password)
    {
        return res.status(400).json({message : "All fields are required"})
    }

    const user = await User.findOne({e_mail : e_mail }).exec()
    if(!user)
    {
        return res.status(400).json({message: "Account not found"})
    }
    const match = await bcrypt.compare(password,user.password)
    if (!match) 
    {
        return res.status(400).json({message : "Password Didn't match"})

    }
    res.status(200).json (user)
})

// @desc create user
// @route POST /user
// @access Private
const createNewUser = asyncHandler(async(req,res)=>{
    const { userId, password, name ,e_mail} = req.body;

    if( !userId || !password || !name) {
        res.json({message : "All fields are required"});
    }
    const dup_id = await User.findOne({e_mail}).lean().exec()
    if(dup_id)
    {
        res.json({message : "This email already exists"});
    }
       
        const hashPwd = await bcrypt.hash(password, 10);
        const newUser = {name, e_mail,userId,password:hashPwd}
        const userAdded = await User.create(newUser)

        if(userAdded)
        {   await userAdded.save();
            res.status(200).json({message : "New User Created"});
        }
        else {
            res.status (400).json ({message : "Cannot create new user"});
        }

})
//-----------------------------------Custom Functions---------------------------------
// @desc get solved problems
//@route POST /user/solved
//@access Private
const getSolvedProblems = asyncHandler(async(req,res)=>{
    const {_id} = req.body;
    if (!_id)
    {
        res.status(400).json({message:"Id is required"})
    }

    const user = await User.findOne({_id:_id}).exec();
    const solvedProblems = []
    for (const problem of user.problems)
  {
     if(problem.status === "Solved")
     {
        const p_id = problem.problemId;
        const s_problem = await Problem.findOne({_id : p_id})
        solvedProblems.push(s_problem)
     }
  }
    res.status(200).json(solvedProblems)
})
// @desc get tried problems
//@route POST /user/tried
//@access Private
const getTriedProblems = asyncHandler(async(req,res)=>{
    const { _id } = req.body;
    if ( !_id )
    {
        res.status(400).json({message:"Id is required"})
    }

    const user = await User.findOne({_id:_id}).exec();
    const triedProblems = []
    for ( const problem of user.problems )
  {
     if(problem.status === "Tried")
     {
        const p_id = problem.problemId;
        const t_problem = await Problem.findOne({_id : p_id})
        triedProblems.push(t_problem)
     }
  }
    res.status(200).json(triedProblems)
})
//-----------------------------------------------------------------------------------------

module.exports = {
    createNewUser,
    getUserId,
    getSolvedProblems,
    getTriedProblems
}