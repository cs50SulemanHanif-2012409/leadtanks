const bcrypt = require('bcrypt')
const { Schema } = require('mongoose')
const mongoose = require('mongoose')


const UserSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is Required'],
        min: 4
    },
    lastName: {
        type: String,
        required: [true, 'Last Name is Required'],
        min: 4
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email Address is Required'],
        min: 8
    },
    password: {
        type: String,
        required: [true, 'Password is Required'],
        min: 6
    },
    phoneNumber: {
        type: String || Number,
        required: [true, 'Number is Required'],
    },
    isBanned : {
        type: Boolean,
        default : false
    },
    ip : { 
        type : String,
    }
}, { timestamps: true })

UserSchema.pre("save", async function (req , res) {
    this.password = await bcrypt.hash(this.password, 12);
});

const myDB = mongoose.connection.useDb('leadtanks');
const User = myDB.model('user', UserSchema);
module.exports = User