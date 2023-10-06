const {exec}  = require('child_process');
const fs = require('fs');
const path = require('path');
const outputPath = path.join(__dirname,"outputs");
// var compiler = require('compilex');
// var options = {stats : true}; //prints stats on console 
// compiler.init(options);

if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath,{recursive:true});
}

const executeCpp = async(filepath) =>{
  const jobId = path.basename (filepath).split(".")[0];
const outPath = path.join(outputPath,`${jobId}.exe`);
return new Promise((resolve,reject)=>{
    exec(`gcc ${filepath} -o ${outPath} && cd ${outputPath} &&  ${outPath} `,

//    exec (`g++ ${filepath} -o ${outPath} && cd ${outputPath} && ./${jobId}.out`,
   (error, stdout, stderr)=>{
    error && reject({error,stderr});
    console.log(error);
    stderr && reject(stderr);
    console.log(stderr);
    resolve(stdout);
    console.log(stdout);
   
   });
});
    
      // if(language === 'c' || language === 'c++')
      // {
      //   if(inputRadio === "true")
      //   {
      //       var envData = { OS : "windows" , cmd : "g++"};
      //       compiler.compileCPPWithInput(envData, code, input, function(data){
      //           if(data.error){
      //               res.send(data.error);
      //             }else{
      //               res.send(data.output);
      //             }
      //       });
      //   }
      //   else {
      //       var envData = { OS : "windows" , cmd : "g++"};
      //       compiler.compileCPP(envData, code, function(data){
      //         if(data.error){
      //           console.log(data.error);
      //           res.send(data.error);
      //         }else{
      //           console.log(data.output);
      //           res.send(data.output);
      //         }
      //       }); 
      //   }
      // }
      // compiler.flush(function(){
      //   console.log('All temporary files flushed !'); 
      //   });
      //   compiler.flushSync();
      //   compiler.fullStat(function(data){
      //       res.send(data);
      //   });



}
module.exports = {
    executeCpp

};
