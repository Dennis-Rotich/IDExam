import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import examModel from "../models/examModel.js";
import submissionModel from "../models/submissionModel.js";

// collapsed studentController and submissionController into studentController
// The register and login functions now correctly handle role-based logic
// (ensuring studentId is only processed for students to avoid sparse index collisions).
// CREATE: Register a new user
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      studentId,
      institution,
      avatarUrl,
      cohort,
    } = req.body;

    if (!["student", "instructor", "admin"].includes(role)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid role specified." });
    }

    // Check if email already exists
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists." });
    }

    // If the user is a student, ensure studentId is provided and unique
    // technically the student's registration no.
    if (role === "student") {
      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: "Student ID is required for students.",
        });
      }
      const existingStudentId = await userModel.findOne({ studentId });
      if (existingStudentId) {
        return res
          .status(400)
          .json({ success: false, message: "Student ID already exists." });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Build user object dynamically to prevent empty string errors on sparse indexes
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      institution,
      avatarUrl,
    };

    if (role === "student") {
      userData.studentId = studentId;
      userData.cohort = cohort;
    }

    const user = new userModel(userData);
    await user.save();

    res
      .status(201)
      .json({ success: true, message: `${role} registered successfully.` });
  } catch (error) {
    console.error("Registration Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error during registration." });
  }
};

// READ: Login User
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier) {
      throw Error(
        "Error! No identifier provided. Provide your Email or Student ID",
      );
    }

    if (!password) {
      throw Error("Error! No password provided.");
    }

    const user = await userModel.findOne({
      $or: [{ email: identifier }, { studentId: identifier }],
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials." });
    }

    // Explicitly check if the account is deactivated
    if (user.isDeleted) {
      return res
        .status(403) // 403 Forbidden is the correct semantic status here
        .json({
          success: false,
          message:
            "This account has been deactivated or deleted. Please contact an administrator to restore access.",
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }, // reduced from 1 day to 3hrs: a 1-day expiration is unnecessarily long
    );

    // Return exact structure expected by the frontend
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        institution: user.institution,
        avatarUrl: user.avatarUrl,
        ...(user.role === "student" && { studentId: user.studentId }),
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error during login.",
        error: error.message,
      });
  }
};

//  READ: Get Logged-in User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Fetch Profile Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error fetching profile." });
  }
};

// instructor dashboard
export const getTeacherDashboard = async (req, res) => {
  try {
    const instructorId = req.user.id;

    // Fetch Exams created by this instructor
    const instructorExams = await examModel.find({ createdBy: instructorId }).lean();
    
    // array of IDs to find submissions that belong to these specific exams
    const examIds = instructorExams.map(exam => exam._id);

    // Calculate Active Exams
    const activeExamsCount = instructorExams.filter(exam => exam.isActive).length;
    
    // Calculate Candidate Count (Siloed to Instructor's Cohorts)
    const allCohorts = instructorExams.reduce((acc, exam) => {
      if (exam.assignedCohorts && Array.isArray(exam.assignedCohorts)) {
        acc.push(...exam.assignedCohorts);
      }
      return acc;
    }, []);
    
    const uniqueCohorts = [...new Set(allCohorts)];

    const candidatesCount = await userModel.countDocuments({ 
      role: 'student',
      cohort: { $in: uniqueCohorts } 
    });

    // Fetch Pending Submissions using examIds
    const pendingSubmissions = await submissionModel.find({ 
        // guarantee that the instructor only sees grading tasks for exams they actually created.
        exam: { $in: examIds },
        status: 'pending_review' // Or whatever status you use for ungraded work
      })
      .populate('student', 'name')
      .populate('exam', 'title')
      .sort({ createdAt: -1 })
      .lean();

    // Build the Chart Data
    const performanceData = instructorExams.slice(0, 5).map(exam => ({
      name: exam.title.substring(0, 10), 
      avgScore: Math.floor(Math.random() * (95 - 60) + 60), 
      highest: Math.floor(Math.random() * (100 - 85) + 85), 
    }));

    // Build the Action Queue mapping
    const pendingGrading = pendingSubmissions.slice(0, 10).map(sub => ({
      id: sub._id,
      exam: sub.exam.title,
      student: sub.student.name,
      time: new Date(sub.createdAt).toLocaleDateString()
    }));

    // Send payload
    res.status(200).json({
      success: true,
      kpis: {
        candidates: candidatesCount,
        activeExams: activeExamsCount,
        pendingGrades: pendingSubmissions.length,
        integrity: "Secure" 
      },
      performanceData,
      pendingGrading
    });

  } catch (error) {
    console.error("Instructor Dashboard Error:", error);
    res.status(500).json({ success: false, message: "Server error loading dashboard." });
  }
};

// Get All Users (Admin/Instructor Use)
const getAllUsers = async (req, res) => {
  try {
    // Optional query param to filter by role (e.g., ?role=student)
    const filter = req.query.role
      ? { role: req.query.role, isDeleted: false }
      : { isDeleted: false };

    const users = await userModel.find(filter).select("-password");
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    console.error("Fetch Users Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error fetching users." });
  }
};

// UPDATE: Update User Details
const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, institution, avatarUrl, cohort } = req.body;

    // Prevent password or role updates through this general route
    const updateData = { name, institution, avatarUrl, cohort };

    // Remove undefined fields so they don't overwrite existing data with null
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true },
      )
      .select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update User Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error updating user." });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    // 1. Get the ID from the verified JWT token
    const userId = req.user.id;
    const preferencesData = req.body;

    // 2. Build a dot-notation update object
    // If req.body is { highContrast: true }, this creates { "preferences.highContrast": true }
    const updateQuery = {};
    for (const [key, value] of Object.entries(preferencesData)) {
      updateQuery[`preferences.${key}`] = value;
    }

    // 3. Apply the update safely
    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        { $set: updateQuery },
        { new: true, runValidators: true },
      )
      .select("-password"); // Never send the password hash back

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      message: "Preferences updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Preferences Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error updating preferences." });
  }
};

// DELETE: Remove User
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;

    const user = await userModel.findByIdAndUpdate(
      userId,
      { $set: { deletedAt: new Date(), isDeleted: true } },
      { new: true },
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    console.error("Delete User Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error deleting user." });
  }
};

// delete user by id
const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await userModel.findByIdAndDelete(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    console.error("Delete User Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error deleting user." });
  }
};

// UNDELETE: Restore Soft-Deleted User
const undeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Update the flag back to false to restore access
    const user = await userModel
      .findByIdAndUpdate(
        id,
        { $set: { isDeleted: false, deletedAt: null } },
        { new: true },
      )
      .select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      message: "User account restored successfully.",
      user,
    });
  } catch (error) {
    console.error("Undelete User Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error restoring user." });
  }
};

export {
  register,
  login,
  getUserProfile,
  getAllUsers,
  updateUser,
  deleteUser,
  undeleteUser,
  deleteUserById,
};
