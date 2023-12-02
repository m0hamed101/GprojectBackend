const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: { type: String, required: true },
    // UserCourses: { type: mongoose.Schema.Types.ObjectId, ref: 'Courses' }, // Store a single course reference
    id: { type: Number, unique: true, required: true }, // Made "id" unique and required
    year: { type: Number },
    email: { type: String, unique: true, required: true }, // Made "email" unique and required
    password: { type: String, required: true }, // Made "password" required
    permission: { type: String },
});

// static signup method
userSchema.statics.CreateUser = async function (name, id, year, email, password, permission) {
    // validation
    if (!name || !id || !year || !email || !password || !permission) {
        throw Error('All fields must be filled');
    }

    if (!validator.isEmail(email)) {
        throw Error('Email not valid');
    }

    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough');
    }

    const existEmail = await this.findOne({ email });
    const existID = await this.findOne({ id });

    if (existEmail) {
        throw Error('Email already in use');
    }

    if (existID) {
        throw Error('ID already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ name, id, year, email, password: hash, permission });

    return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled');
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw Error('Incorrect email');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error('Incorrect password');
    }

    return user;
};

module.exports = mongoose.model('User', userSchema);
