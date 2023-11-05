const Problem = require('../models/Problem')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')
var compiler = require('compilex');
const axios = require('axios')

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
        const problems = await Problem.find().skip(skip).limit(perPage).lean()
		if ( !problems?.length ) {
			return res.status(400).json ({message : 'No Problem Found'})
		}
		return res.status(200).json({problems})
    } catch(error) {
        return res.status(500).json({message : "Server Error"});
    }  
   
})

// @desc run problem
// @route POST /problem/run
// @access Private

const runProblem = asyncHandler(async(req,res)=>{
    const {_id, code, language} = req.body
    const problem  = await Problem.findOne({_id:_id}).exec()

    if (!language) {
        language = 'c++'
    }
    for (const testCase of problem.testcase) {
        const input = testCase.input
        const expectedOutput = testCase.output
        // const input = testValues.split(',').filter(value => value.trim() !== '')
    
		if(!input?.length || !expectedOutput?.length) {
			return res.status(400).json ({message : "No data found"})
		}
		// res.status(200).json({message : "Success"})
		console.log("Input" ,input)
		console.log("Expected Output",expectedOutput)
		console.log("Language" , language)
		console.log("code: ",code)

		if(language === 'c' || language === 'c++') {
			// if(inputRadio === "true") {
			// 	var envData = { OS : "windows" , cmd : "g++", options : {timeout : 10000} };
			// 	compiler.compileCPPWithInput(envData, code, input, function(data){
			// 		if(data.error) {
			// 			return res.status(400).json({error: data.error});
			// 		} else {
			// 			if (data.output === expectedOutput){ 
			// 				console.log("Test Case Passed")
			// 				return res.status(200).json(data.output)
			// 			} else {
			// 				console.log("Test Case Failed")
			// 				return res.status(202).json(data.output)
			// 			}
			// 		}
			// 	});
				
			// } else {
				// var envData = { OS : "windows" , cmd : "g++", options : {timeout : 10000}};
				// compiler.compileCPP(envData, code, function(data) {
				// 	if(data.error){
				// 		console.log(data.error);
				// 		return res.send(data.error);
				// 	} else if (data.output === expectedOutput){ 
				// 		console.log("Output Matched :",data.output)
				// 		return res.status(200).json(data.output)
				// 	} else {
				// 		console.log("Output not matched:",data.output)
				// 		res.status(201).json(data.output)
				// 	}
				// }); 
			// }
			var envData = { OS : "windows" , cmd : "g++", options : {timeout : 10000}};
			compiler.compileCPP(envData, code, function(data) {
				if(data.error){
					console.log(data.error);
					return res.send(data.error);
				} else if (data.output === expectedOutput){ 
					console.log("Output Matched :",data.output)
					return res.status(200).json(data.output)
				} else {
					console.log("Output not matched:",data.output)
					return res.status(201).json(data.output)
				}
			}); 
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

})

// @desc show problem
// @route POST /problem/show
// @access Private
const showProblem = asyncHandler(async(req,res)=>{
    const {_id} = req.body
    console.log(_id)

    if(!_id) {
        return res.status(400).json({message : "Id is required"})
    }
    const problem = await Problem.findOne({_id : _id}).lean().exec()
   
    if (problem) {
        return res.status(200).json(problem)
    }
})

// @desc create problem
// @route POST /problem
// @access Private
const createNewProblem = asyncHandler(async(req,res) => {
    const { _id, id, title, category, difficulty, company, desc, example, testcase } = req.body

    if(!id) {
        return res.status(400).json({message : "Id is required"})
    }
    const duplicate = await Problem.findOne({id}).lean().exec()

    if(duplicate) {
        return res.status(409).json({message : "Duplicate Id"})
    }

    const problemObject = { _id, id, title, category, difficulty, company, desc, example, testcase }
    const problem = await Problem.create(problemObject)

    if(problem) {
        return res.status(201).json({message : `New Problem with id ${id} craeted`})
	} else {
        return res.status(400).json({message : 'Invalid data received'})
    }
    
})

// @desc submit problem
// @route POST /problem/submit
// @access Private

const submitProblem = asyncHandler(async (req, res) => {
    const { user_id, problem_id, code, language } = req.body;
    if (!user_id || !problem_id || !code || !language) {
      	return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
		const problem = await Problem.findOne({ _id: problem_id }).exec();
		const user = await User.findOne({ _id: user_id }).exec();
		
		let status;
		const response = await axios.post('http://localhost:3500/problem/run', {
			code: code,
			language: language,
			_id: problem_id,
		});
	
		if (response.status === 200) {
			status = "Solved";
			console.log("Status:", status);
		} else {
			status = "Tried";
			console.log("Status:", status);
		}
	
		
		const problemExists = user.problems.some((problem) =>
			problem.problemId.toString() === problem._id.toString()
		);
	
		if (problemExists) {
			user.problems.forEach((problem) => {
				if (problem.problemId.toString() === problem._id.toString()) {
					if (problem.status !== "Solved") {
						problem.status = status;
					}
				}
			});
		} else {
			const newProblem = {
				problemId: problem._id,
				status: status,
			};
			user.solvedProblems.push(newProblem);
		}

		console.log("Before submissions:", problem.submissions);
		problem.submissions += 1;

		if (status === "Solved") {
			problem.correct_submissions += 1;
			console.log("Correct", problem.correct_submissions);
		}

		const accuracy =(( problem.correct_submissions/problem.submissions) * 100).toFixed(2);
		console.log("After submissions:", problem.submissions);
		console.log("Accuracy",accuracy,"%")
		problem.accuracy = accuracy
		
		await Promise.all([user.save(), problem.save()]);
	
		return res.status(200).json(problem);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
});

module.exports = {
    getAllProblems,
    createNewProblem,
    submitProblem,
    showProblem,
    runProblem,
  
   
}


