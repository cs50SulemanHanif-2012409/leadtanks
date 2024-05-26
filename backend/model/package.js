const { Schema } = require('mongoose')
const mongoose = require('mongoose')

const PackageSchema = new Schema({
    leadTitle: { type: String, required: true },
    leadDescription: { type: String, required: true },
    leadPrice: { type: Number, required: true },
    leadTags: [String],
    noleads: { type: Number, required: true },
    db : { type : String , required : true }
}, { timestamps: true })


const myDB = mongoose.connection.useDb('leadtanks');
const Package = myDB.model('Package', PackageSchema);
module.exports = Package;