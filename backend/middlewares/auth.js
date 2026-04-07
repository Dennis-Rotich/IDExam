import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({success:false, message:"Authentication token missing or invalid."})
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        res.status(403).json({success: false, message:"Invalid or expired token. Try logging in again"})
    }
}

const isTeacher = (req, res, next) => {
    if(req.user.role !== 'instructor'){
        return res.status(403).json({success: false, message:'Instructor privileges required.'})
    }
    next()
}

//check if the user is an admin
const isAdmin = (req, res, next) => {
    if(req.user.role !== 'admin'){
        return res.status(403).json({success: false, message:'Admin privileges required.'})
    }
    next()
}

export {verifyToken, isTeacher, isAdmin}