const User = require('../models/User')
const Problem = require('../models/Problem')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')


// @desc get user
// @route POST /user/login
// @access Private
const getUser = asyncHandler(async(req,res)=>{
    const  { e_mail, password } = req.body

    console.log(e_mail, password)

    if (!e_mail || !password) {
        return res.status(400).json({'message' : "All fields required."})
    }

    const user = await User.findOne({e_mail : e_mail })
    if (!user) {
        return res.status(400).json({'message' : "Incorrect e-mail or password."})
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        return res.status(400).json({'message' : "Incorrect e-mail or password."})
    }
    return res.status(200).json({user})
})

// @desc create user
// @route POST /user
// @access Private
const createNewUser = asyncHandler(async(req,res)=>{
    const { e_mail, password } = req.body

    if(!e_mail) {
        return res.status(400).json({ message : "E-mail cannot be blank."});
    }
    if (!password) {
        return res.status(400).json({ message : "Password cannot be blank."})
    }

    console.log(e_mail, password)

    const dup_user = await User.findOne({e_mail}).lean().exec()
    if(dup_user)
    {
        return res.status(400).json({ message : "This email already exists"});
    }
       
    const hashPwd = await bcrypt.hash(password, 10);
    const newUser = {e_mail, username: e_mail, password: hashPwd}
    const userAdded = await User.create(newUser)

    if(userAdded) {  
        return res.status(200).json({message : "New User Created", 'user': userAdded});
    } else {
        return res.status(400).json ({message : "Cannot create new user"});
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
        return res.status(400).json({message: "Id is required"})
    }

    const user = await User.findOne({_id:_id}).exec();
    const solvedProblems = []
    for (const problem of user.problems) {
        if(problem.status === "Solved")
        {
            const p_id = problem.problemId;
            const s_problem = await Problem.findOne({_id : p_id})
            solvedProblems.push(s_problem)
        }
    }
    return res.status(200).json(solvedProblems)
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
     if(problem.status === "Tried" )
     {
        const p_id = problem.problemId;
        const t_problem = await Problem.findOne({_id : p_id})
        triedProblems.push(t_problem)
     }
  }
    if (!triedProblems?.length)
    {
        res.status(201).json({message: "You haven't tried any problem"})
    }
    res.status(200).json(triedProblems)
})
//-----------------------------------------------------------------------------------------

module.exports = {
    createNewUser,
    getUser,
    getSolvedProblems,
    getTriedProblems
}