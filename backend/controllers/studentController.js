import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import studentModel from '../models/studentModel.js';

const register = async(req, res)=>{
    try {
        const {name, email, password, studentId} = req.body;

        const existingStudent = await studentModel.findOne({ $or: [{ email }, { studentId }] });

        if(existingStudent){
            console.log(existingStudent);
            return res.status(400).json({success:false, message:'Email or Student ID already exists.'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const student = new studentModel({name, email, password:hashedPassword, studentId});
        await student.save();
        
        res.status(201).json({success:true, message:'Student registered successfully.'})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false, message:'Server error during registration.'})
    }
}

const login = async(req, res)=>{
    try {
        const {identifier, password} = req.body;

        const student = await studentModel.findOne({
            $or: [{email:identifier}, {studentId:identifier}]
        });

        if(!student){
            return res.status(404).json({success:false, message:'Invalid credentials'})
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if(!isMatch){
            return res.status(400).json({success:false, message:'Invalid credentials'})
        }

        const token = jwt.sign(
            {id:student._id, role:'student'},
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        );

        res.json({success:true, token, user:{id:student._id, name:student.name, studentId:student.studentId, role:'student'}})

    } catch (error) {
        console.log(error.message);
        
        res.status(500).json({success:false, message:'Server error during login.'})
    }
}

export {register, login}