import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";

// ==========================================
// CREATE: Register a new user
// ==========================================
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
    if (role === "student") {
      if (!studentId) {
        return res
          .status(400)
          .json({
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

// ==========================================
// READ: Login User
// ==========================================
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // 1. Find the user without filtering out deleted accounts
    const user = await userModel.findOne({
      $or: [{ email: identifier }, { studentId: identifier }],
    });

    // 2. If no user is found at all, return standard error
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials." });
    }

    // 3. Explicitly check if the account is deactivated
    if (user.isDeleted) {
      return res
        .status(403) // 403 Forbidden is the correct semantic status here
        .json({ 
          success: false, 
          message: "This account has been deactivated or deleted. Please contact an administrator to restore access." 
        });
    }

    // 4. Proceed with password verification for active users
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3h" },
    );

    // Return exact structure expected by frontend Zustand auth store
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
      .json({ success: false, message: "Server error during login." });
  }
};

// ==========================================
// READ: Get Logged-in User Profile
// ==========================================
const getUserProfile = async (req, res) => {
  try {
    // Assumes you have an auth middleware that sets req.user
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

// ==========================================
// 4. READ: Get All Users (Admin/Instructor Use)
// ==========================================
const getAllUsers = async (req, res) => {
  try {
    // Optional query param to filter by role (e.g., ?role=student)
    const filter = req.query.role ? { role: req.query.role, isDeleted: false } : {};

    const users = await userModel.find(filter).select("-password");
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    console.error("Fetch Users Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error fetching users." });
  }
};

// ==========================================
// 5. UPDATE: Update User Details
// ==========================================
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, institution, avatarUrl, cohort } = req.body;

    // Prevent password or role updates through this general route
    const updateData = { name, institution, avatarUrl, cohort };

    // Remove undefined fields so they don't overwrite existing data with null
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    const updatedUser = await userModel
      .findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true },
      )
      .select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res
      .status(200)
      .json({
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

// ==========================================
// 6. DELETE: Remove User
// ==========================================
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel
      .findByIdAndUpdate(
        id,
        { $set: { deletedAt: new Date(), isDeleted: true } },
        { new: true},
      )
      .select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res
      .status(200)
      .json({
        success: true,
        message:
          "User account deactivated and scheduled for permanent deletion.",
      });
  } catch (error) {
    console.error("Delete User Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error deleting user." });
  }
};

// ==========================================
// 7. UNDELETE: Restore Soft-Deleted User
// ==========================================
const undeleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Update the flag back to false to restore access
        const user = await userModel.findByIdAndUpdate(
            id,
            { $set: { isDeleted: false, deletedAt: null } }, 
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.status(200).json({ 
            success: true, 
            message: "User account restored successfully.", 
            user 
        });

    } catch (error) {
        console.error("Undelete User Error:", error.message);
        res.status(500).json({ success: false, message: "Server error restoring user." });
    }
};

export { register, login, getUserProfile, getAllUsers, updateUser, deleteUser, undeleteUser };
