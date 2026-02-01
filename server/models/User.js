import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    resetToken: {type: String, default: null},
    resetTokenExpiry: {type: Date, default: null},
    analytics: {
        resumesCreated: {type: Number, default: 0},
        resumesViewed: {type: Number, default: 0},
        downloadsCount: {type: Number, default: 0},
        sessionsCount: {type: Number, default: 0},
        totalTimeSpent: {type: Number, default: 0},
        lastActivityDate: {type: Date, default: null},
        templatesUsed: {
            classic: {type: Number, default: 0},
            minimal: {type: Number, default: 0},
            modern: {type: Number, default: 0},
            'minimal-image': {type: Number, default: 0},
            'modern-colorful': {type: Number, default: 0},
            timeline: {type: Number, default: 0},
            creative: {type: Number, default: 0},
            professional: {type: Number, default: 0},
        }
    }
}, {timestamps: true})

UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password)
}

const User = mongoose.model("User", UserSchema)

export default User;