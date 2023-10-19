require ('dotenv').config()
const express = require('express');
const app = express();
const cors  = require('cors')
const bodyParser = require("body-parser")
const path = require ("path")
const corsOptions = require('./config/corsOptions')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const PORT = process.env.PORT || 3500

connectDB()

var compiler = require('compilex');
var options = {stats : true}; 
compiler.init(options);

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(bodyParser());
app.use(cors(corsOptions))
app.use('/problem', require('./routes/problemRoutes'))
app.use('/user', require('./routes/userRoutes'))


app.get ("/",(req,res)=>{
 res.sendfile(__dirname + "/index.html");
});

app.post("/run", (req,res)=>{
    const { language = "cpp",code, input, inputRadio = 'false' } = req.body;
    console.log(code);
    console.log(language);
    console.log(input);
    console.log(inputRadio);
    // try{
    //     const filepath = await  generateFile(language,code, input);
    // }
    // catch(err){
    //     res.json(err);
    // }
    
   
    if(language === 'c' || language === 'c++')
    {
      if(inputRadio === "true")
      {
          var envData = { OS : "windows" , cmd : "g++", options : {timeout : 10000} };
          compiler.compileCPPWithInput(envData, code, input, function(data){
              if(data.error) {
                  res.send(data.error);
                }
                else {
                  console.log(data.output)
                  res.send(data.output);
                }
          });
      }
      else {
          var envData = { OS : "windows" , cmd : "g++", options : {timeout : 10000}};
          compiler.compileCPP(envData, code, function(data){
            if(data.error){
              console.log(data.error);
              res.send(data.error);
            }else{
              console.log(data.output);
              res.send(data.output);
            }
          }); 
      }
    }
   
   
  
})

app.get("/fullStat", function(req,res){
    compiler.fullStat(function (data) {
        res.send(data);
    });
})
   
app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
      res.json({ message: '404 Not Found' })
  } else {
      res.type('txt').send('404 Not Found')
  }
})

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
  console.log(err)
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})

compiler.flush(function(){
    console.log('All temporary files flushed !'); 
    });
   
