import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { errorHandler } from '../middleware/errorHandler.js';

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return next(errorHandler(401, 'Kindly fill in all fields!'));

    const newEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: newEmail });

    if (existingUser) {
      return next(errorHandler(401, 'Email already in use'));
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      username,
      email: newEmail,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({
      message: 'User created successfully. ',
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Registration failed due to a server error' });
    console.log(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(errorHandler(401, 'Please fill all the fields'));
    }

    const newEmail = email.toLowerCase();

    const validUser = await User.findOne({ email: newEmail });
    if (!validUser) return next(errorHandler(401, 'Invalid credentials'));

    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Invalid credentials'));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        sameSite: 'none',
      })
      .status(200)
      .json({ rest, token });
  } catch (err) {
    next(err);
  }
};

// Sign user out
export const logout = async (req, res, next) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};
