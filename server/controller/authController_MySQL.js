import db from '../models/index.js';
import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import JWT from 'jsonwebtoken';
import UserModel from '../models/userModel_MySQL.js';
const User = UserModel(db.sequelize);
// User registration
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address} = req.body;

    // Validations
    if (!name || !email || !password || !phone || !address) {
      return res.status(400).send({ message: 'All fields are required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: 'User already registered. Please log in.',
      });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user in the MySQL database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    res.status(201).send({
      success: true,
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in registration',
      error: error.message,
    });
  }
};

// User login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Check if the user exists
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'Email is not registered',
      });
    }

    // Compare passwords
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(200).send({
        success: false,
        message: 'Invalid password',
      });
    }

    // Generate JWT token
    const token = await JWT.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).send({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in login',
      error: error.message,
    });
  }
};

// Forgot Password
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    // Validation
    if (!email || !answer || !newPassword) {
      return res.status(400).send({ message: 'Email, answer, and new password are required' });
    }

    // Find user by email and answer
    const user = await UserModel.findOne({ where: { email, answer } });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'Wrong email or answer',
      });
    }

    // Hash the new password and update it in the database
    const hashed = await hashPassword(newPassword);
    await user.update({ password: hashed });

    res.status(200).send({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Something went wrong',
      error: error.message,
    });
  }
};

// Test controller
export const testController = (req, res) => {
  try {
    res.send('Protected Routes');
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};