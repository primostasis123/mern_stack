import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    fullName: { type: String },
    email: { type: String },
    password: { type: String },
    createdOn: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

export default User;