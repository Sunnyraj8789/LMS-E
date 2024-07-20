import Course from "../models/couse.model.js"
import AppError from "../utils/error.util.js";
import fs from 'fs/promises';
import cloudinary from 'cloudinary';
import { countReset } from "console";

const getAllCourses=async function(req,res,next){
    try{
        const courses=await Course.find({}).select('-lectures');

    res.status(200).json({
        success:true,
        message:'All courses',
        courses,
    });
    } catch(e){
        return next(
            new AppError(e.message,500)
        )

    }
    

}


const getLectutresByCourseId= async function(req,res,next){

    try{
        const { id } =req.params;
        console.log('course id >',id);

        const course=await Course.findById(id);
        console.log('course details >',course);

        if(!course){
            new AppError('invalid course id',400);

        }

        res.status(200).json({
            success:true,
            message:'Coursee lectures fetched successfully',
            lectures: course.lectures
        });





    } catch(e){
        return next(
            new AppError(e.message,500)
        )
    }



}


const createCourse=async(req,res,next)=>{
    const {title,description,category,createdBy}=req.body;

    if(!title||!description||!category||!createdBy){
        return next(
            new AppError('All feilds are required',400)
        )
    }

    const course=await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail:{

            public_id:'DUMMY',
            secure_url:'DUMMY'
                
    
        },
    });

    if(!course){
        return next(
            new AppError('Course Could not create,please try again',500)
        )

    }

    if(req.file){

        try{
            
        const result=await cloudinary.v2.uploader.upload(req.file.path,{
            folder:'lms'

        });
        console.log(JSON.stringify(result));
        if(result){
            course.thumbnail.public_id=result.public_id;
            course.thumbnail.secure_url=result.secure_url;
        }

        fs.rm(`uploads/${req.file.filename}`);
    }
    catch(e){
        return next(
            new AppError(e.message,500)
        )

    }

        }

        await course.save();
         res.status(200).json({
            success:true,
            message:'Course create successfully',
            course,
         });
}

const updateCourse=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const course=await Course.findByIdAndUpdate(
            id,
            {
                $set: req.body
            },
            {
                runValidators:true

            }
        );

        if(!course){
            return next(
                new AppError('Course with given id does not exists',500)
            )
        }

        res.status(200).json({
            success:true,
            message:'Course updated Successfully',
            course
        })


    }catch(e){
        return next(
            new AppError(e.message,500)
        )

    }


}

const removeCourse=async(req,res,next)=>{

    try{
        const {id}=req.params;
        const course=await Course.findById(id);

        if(!course){
            return next(
                new AppError('Course with given id does not exist',500)
            )
        }

        await  Course .findByIdAndDelete(id);
        res.status(200).json({
            success:true,
            message:'Course deleted successfully'
        })

       
    } catch(e){
        return next(
            new AppError(e.message,500)
        )
    }

}

const addLectureToCourseById =async(req,res,next)=>{
    try{
    const { title,description}=req.body;
    const { id}=req.params;

    if(!title||!description){
        return next(
            new AppError('All feilds are required ',400)
        )
    }

    const course =await Course.findById(id);

    if(!course){
        return next(
            new AppError('Course with given id does not exists',500)
        )
    }


    const lectureData=
    {
        title,
        description,
        lecture:{ }

    };

    if(req.file){

        try{
            
            const result=await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'lms'
    
            });
            console.log(JSON.stringify(result));
            if(result){
                lectureData.lecture.public_id=result.public_id;
                lectureData.lecture.secure_url=result.secure_url;
            }
    
            fs.rm(`uploads/${req.file.filename}`);
        }
        catch(e){
            return next(
                new AppError(e.message,500));
    
        }
    

    }


console.log('lectures >',JSON.stringify(lectureData));
    course.lectures.push(lectureData);

    course.numbersOfLectures=course.lectures.length;

    await course.save();


    res.status(200).json({
        success:true,
        message: 'Lecture succcesfully added to the course',
        course
    })
}
catch(e){
    return next(
        new AppError(e.message,500)
    )
}
};


export{
    getAllCourses,
    getLectutresByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureToCourseById

}