const { Schema } = require('mongoose')
const mongoose = require('mongoose')

const OrderSchema = new Schema({
    userId: { type: String, required: true , ref : 'user@leadtanks' },
    packages: [{ type: String, required: true , ref : 'Package@leadtanks' }],
    total: { type: Number, required: true },
    status: { type: String, required: true, default: 'pending' },
    paymentStatus: { type: String, required: true, default: 'pending' },
   }, { timestamps: true })


const myDB = mongoose.connection.useDb('leadtanks');
const Order = myDB.model('order', OrderSchema);
module.exports = Order;