const Order = require('../model/Order')
const Package = require('../model/package')


class OrderController {

    getUserOrders = async (req, res) => {
        try {
            const orders = await Order.find({ userId: req.user })
            .populate({ path: "packages", model: Package })
            res.json({ status: true, orders })
        } catch (error) {
            res.json({ status: false, message: error.message })
        }
    }

    getOrder = async (req, res) => {
        try {
            const order = await Order.findOne({ _id: req.params.id })
            res.json({ status: true, order })
        } catch (error) {
            res.json({ status: false, message: error.message })
        }
    }

    createOrder = async (req, res) => {
        try {
            console.log(req.body)
            const order = await Order.create({
                userId: req.user,
                packages: req.body.packages,
                total: req.body.total,
                status: 'pending',
                paymentStatus: 'completed'
            })
            res.json({ status: true, order })
        } catch (error) {
            res.json({ status: false, message: error.message })
        }
    }
    updateOrder = async (req, res) => {
        try {
            const order = await Order.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
            res.json({ status: true, order })
        } catch (error) {
            res.json({ status: false, message: error.message })
        }
    }
    deleteOrder = async (req, res) => {
        try {
            const order = await Order.findOneAndDelete({ _id: req.params.id })
            res.json({ status: true, order })
        } catch (error) {
            res.json({ status: false, message: error.message })
        }
    }

}



module.exports = new OrderController();