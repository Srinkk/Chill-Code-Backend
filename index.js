const express = require('express');
const cors  = require('cors')

const { generateFile }= require('./generateFile');
const { executeCpp } =  require ('./executeCpp');

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:3000'],
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  credentials: true
}))





app.get ("/",(req,res)=>{
  return res.json(req.body);
});

app.post("/run", async(req,res)=>{
    const { language = "cpp",code } = req.body;
    console.log(code);
    console.log(language);
    // console.log(input);
    // console.log(inputRadio);
    
    if(code  == undefined)
    {
     return res.status(400).json({success : false, error : "Empty code body"})
    }
    try{
    const filepath = await  generateFile(language,code);
    const output = await executeCpp(filepath);
    console.log(output);
    return res.json({filepath,output}); 
    } catch (err)
    {
      res.status(500).json({err});
    }
   
});

app.listen(3500,()=>{
    console.log('Listening to port 3500');
});