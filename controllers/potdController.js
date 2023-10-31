const ProblemOfTheDay = require('../models/POTD')
const asyncHandler = require('express-async-handler')
var compiler = require('compilex')
const schedule = require('node-schedule');
const axios = require('axios')

// @desc create potd
// @route POST /problemOfTheDay
// @access Private

const createPotd = asyncHandler(async(req,res)=>{
    const { _id, id, title, category, company, desc, example, testcase } = req.body
    if( ! id)
    {
        return res.status(400).json({message : "Id is required"})
    }
    const duplicate = await ProblemOfTheDay.findOne({id : id}).lean().exec()
    
    if(duplicate) {

        return res.status(409).json({message : "Duplicate Id"})
    }
    const problemObject = { _id, id, title, category, company, desc, example, testcase }
    const potd = await ProblemOfTheDay.create(problemObject)

    if(potd)
    {
        res.status(200).json({message : `POTD Created with id: ${potd.id}`})
    }
    else {
        res.status(400).json({message : 'Invalid data received'})
    }
})
// @desc Get all problems
// @route GET /allproblemOfTheDay
// @access Private
const getAllPotd = asyncHandler(async(req,res)=>{
    const potd = await ProblemOfTheDay.find().exec()
     if(!potd?.length)
     {
        return res.status(400).json({message: "No problems found"})

     }
     res.status(200).json(potd)
})

// @desc Get all problems
// @route GET /problemOfTheDay
// @access Private
const getPotd =asyncHandler(async(req,res)=>{
    const problemList = []
    const problems = await ProblemOfTheDay.find().exec()
    for(const problem of problems)
    {
        if(problem.status === "Not Selected")
        {
            problemList.push(problem._id)
        }
    }
    console.log(problemList)
    if(problemList.length === 0)
    {
        return res.status(400).json({message : "No problem left to select"})
    }
    else {
        const randomIndex = Math.floor(Math.random() * problemList.length);
        const p_id = problemList[randomIndex];
        const problemOfTheDay = await ProblemOfTheDay.findOne({_id:p_id }).exec()
        problemOfTheDay.status = "Selected"
        await problemOfTheDay.save()
        return res.status(200).json(problemOfTheDay)
    }
})

// const updateSchedule = schedule.scheduleJob('*/5 * * * *', () => {
//   getPotd();
// });


module.exports = {
    createPotd,
    getAllPotd,
    getPotd
}