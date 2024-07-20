import mongoose from "mongoose";


//if in case user not fill any details then not provide the error only ignore
mongoose.set('strictQuery',false);
 
const  connectionToDb=async()=>{
   try{ 
  const{connection} =await mongoose.connect(
        process.env.MONGO_URI ||  `mongodb://localhost:27017/lms`
    );

    if(connection){
        console.log(`connected to MongoDB: ${connection.host}`);
    }
}
catch(e){
    console.log(e);
    process.exit(1);
}




}


export default connectionToDb;

