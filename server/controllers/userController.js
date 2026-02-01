import Resume from "../models/Resume.js";
import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const generateToken = (userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
    return token;
}

// controller for user registration
// POST: /api/users/register
export const registerUser = async(req, res) => {
    try {
        const {name, email, password} = req.body;

        // check if required fields are present
        if(!name || !email || !password){
            return res.status(400).json({message: 'Tələb olunan sahələr mövcud deyil'})
        }

        // check if user already exists
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({message: 'Bu e-mail artıq qeydiyyatdan keçib'})
        }

        // create new user
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            name, email, password: hashedPassword
        })

        // return success message
        const token = generateToken(newUser._id)
        newUser.password = undefined;

        return res.status(201).json({message: 'Istifadəçi uğurla yaradılmışdır', token, user: newUser})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}


// controller for user login
// POST: /api/users/login

export const loginUser = async(req, res) => {
    try {
        const {email, password} = req.body;

        // check if user exists
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: 'Yanlış e-mail və ya şifrə'})
        }

        // check if password is correct
        if(!user.comparePassword(password)){
            return res.status(400).json({message: 'Yanlış e-mail və ya şifrə'})
        }

       // return success message
        const token = generateToken(user._id)
        user.password = undefined;

        return res.status(200).json({message: 'Uğurla daxil oldunuz', token, user})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}


// controller for getting user by id
// GET: /api/users/data

export const getUserById = async(req, res) => {
    try {
        const userId = req.userId;

        // check if user exists
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({message: 'User not found'})
        }

        // return user
        user.password = undefined;
        return res.status(200).json({user})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// Controller for getting user resumes
// GET: /api/users/resumes
export const getUserResumes = async(req, res) => {
    try {
        const userId = req.userId;

        // return user resumes
        const resumes = await Resume.find({userId})
        return res.status(200).json({resumes})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// Controller for getting user analytics
// GET: /api/users/analytics
export const getUserAnalytics = async(req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        return res.status(200).json({
            analytics: user.analytics || {
                resumesCreated: 0,
                resumesViewed: 0,
                downloadsCount: 0,
                sessionsCount: 0,
                totalTimeSpent: 0,
                lastActivityDate: null,
                templatesUsed: {}
            }
        });
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

// Controller for updating user analytics
// PUT: /api/users/analytics
export const updateUserAnalytics = async(req, res) => {
    try {
        const userId = req.userId;
        const { analytics } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { analytics },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        return res.status(200).json({
            message: 'Analytics updated successfully',
            analytics: user.analytics
        });
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

// Controller for forgot password
// POST: /api/users/forgot-password
export const forgotPassword = async(req, res) => {
    try {
        const { email } = req.body;

        // check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Istifadəçi tapılmadı' });
        }

        // generate reset token
        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // save reset token to user
        user.resetToken = resetToken;
        user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
        await user.save();

        // send email with reset link (async, don't wait)
        const transporter = nodemailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 587,
            secure: false,
            auth: {
                user: 'apikey',
                pass: process.env.SENDGRID_API_KEY
            }
        });

        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Şifrə Sıfırlama Tələbi',
            html: `
                <h2>Şifrə Sıfırlama</h2>
                <p>Siz şifrə sıfırlaması tələb etmisiniz.</p>
                <p><a href="${resetUrl}">Şifrəni sıfırlamaq üçün buraya klikləyin</a></p>
                <p>Bu link 1 saat müddətində etibarlı olacaqdır.</p>
            `
        };

        // Send email without waiting
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email error:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        return res.status(200).json({ message: 'Şifrə sıfırlama linki e-mailinizə göndərildi!' });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// Controller for reset password
// POST: /api/users/reset-password
export const resetPassword = async(req, res) => {
    try {
        const { token, newPassword } = req.body;

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // check if user exists
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'Istifadəçi tapılmadı' });
        }

        // check if token is valid and not expired
        if (user.resetToken !== token || user.resetTokenExpiry < new Date()) {
            return res.status(400).json({ message: 'Sıfırlama linki keçərsizdir və ya müddəti bitib' });
        }

        // update password
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        return res.status(200).json({ message: 'Şifrə uğurla sıfırlanmışdır' });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}