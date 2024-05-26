const { Schema } = require('mongoose')
const mongoose = require('mongoose')

const LeadsSchema = new Schema({
    leadPackageId : { type: Schema.Types.ObjectId, ref: 'users'  },
    lead: { type: Schema.Types.ObjectId, ref: 'users@facebook' }
})


const myDB = mongoose.connection.useDb('leadtanks');
const Leads = myDB.model('Lead', LeadsSchema);
module.exports = Leads;