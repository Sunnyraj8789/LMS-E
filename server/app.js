import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from'dotenv';
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js';
import courseRoutes from './routes/course.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';
import Course from './models/couse.model.js';
config();

const app=express();

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials:true
}));

app.use(cookieParser());

app.use(morgan('dev'));  //if in case wrong url enter the user then you can specify the which is entred by the user

//specify the server is up then ping and server is down then pong 
app.use('/ping', function(req,res){
    res.send('pong');
});

//routes of three modules

app.use('/api/v1/user',userRoutes);
// app.use('/api/v1/courses',courseRoutes);

app.use('/api/v1/courses',courseRoutes);








//in case user enter the other url which is not ping or not belongs to the these  three module 
//or user wants to give the random url
app.all('*',(req,res)=>{
    res.status(404).send('OOPS!! 404 page not found');


});


app.use(errorMiddleware);

export default app;



