const { Schema } = require('mongoose')
const mongoose = require('mongoose')

const CountriesSchema = new Schema({
    countries : [String]
});

const myDB = mongoose.connection.useDb('facebook');

const FbCountries = myDB.model('countries', CountriesSchema, 'countries');
module.exports = FbCountries;