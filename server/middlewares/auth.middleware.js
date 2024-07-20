import AppError from "../utils/error.util.js";
import jwt from 'jsonwebtoken';

const isLoggedIn =async (req,res,next)=>{
    const { token } =req.cookies;

    if(!token){
        return next(new AppError('Unautheticated,please login again ',401));
    }

    const userDetails= await jwt.verify(token,process.env.JWT_SECRET);
    req.user= userDetails;

    next();




}

const authorizedRoles=(...roles)=>(req,res,next)=>{
    const currentUserRoles= req.user.roles;
    if(!roles.includes(currentUserRoles)){
        return next(
            new AppError('You do not have permission to access this route',500)
        )

    }
    next();
}

export{
    isLoggedIn,
    authorizedRoles
}