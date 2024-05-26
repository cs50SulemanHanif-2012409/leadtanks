const { Schema } = require('mongoose')
const mongoose = require('mongoose')

const UserSchema = new Schema({
    phoneNumber : String,
    id : String,
    firstName : String,
    lastName : String,
    gender : String,
    residence : String,
    birthPlace : String,
    relationShip : String,
    workPlace : String,
    joined : String,
    line : String,
});

const myDB = mongoose.connection.useDb('facebook');

const FbUsers = myDB.model('users', UserSchema , 'users');
module.exports = FbUsers;