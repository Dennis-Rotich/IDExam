import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import teacherModel from '../models/teacherModel.js';

const register = async(req, res)=>{
    try {
        const {name, email, password} = req.body

        const existingTeacher = await teacherModel.findOne({email});
        if(existingTeacher){
            return res.status(400).json({success:false, message:"Email already in use."})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const teacher = new teacherModel({name, email, password:hashedPassword})
        await teacher.save();

        res.status(201).json({success:true, message:"Teacher registered successfully"})
    } catch (error) {
        res.status(500).json({success:false, message:"Server error during registration"})
    }
}

const login = async(req, res)=>{
    try {
        const {email, password} = req.body

        const teacher = await teacherModel.findOne({email});
        if(!teacher){
            return res.status(400).json({success:false, message:"Invalid email or password."});
        }

        const isMatch = await bcrypt.compare(password, teacher.password);
        if(!isMatch){
            return res.status(400).json({success:false, message:'Invalid email or password.'});
        }

        const token = jwt.sign(
            {id: teacher._id, role:'teacher'},
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
        );

        res.json({success:true, token, user:{ id: teacher._id, name:teacher.name, role:'teacher' }})
    } catch (error) {
        res.status(500).json({success:false, message:"Server error during login."})
    }
}

export {register, login}