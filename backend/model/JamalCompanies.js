const { Schema } = require('mongoose')
const mongoose = require('mongoose')

const CompanySchema = new Schema({
    phoneNumber : String,
    address : String,
    title : String,
    company : String,
    city : String,
});

const myDB = mongoose.connection.useDb('jamal');
// JamalCompany
const JMComapany = myDB.model('companies', CompanySchema , 'companies');
module.exports = JMComapany;