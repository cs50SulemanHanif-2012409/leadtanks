const UserModel = require('../model/User')

class UserController {
    async getMe(req, res) {
        try {
            const user = await UserModel.findById(req.user).select({
               password: false, __v: false, createdAt: false, updatedAt: false 
              });
            if(!user){
                res.clearCookie("token")
            } 
            res.json({ status: true , user }) 
        } catch (error) {
            res.json({ status: false, message: error.message })
        }
    }
    async putUser(req, res) {
        try {
          const response = await UserModel.findByIdAndUpdate(req.user, { $set: { ...req.body } })
          res.json({ status: true, response })
        } catch (error) {
          res.json({ status: false, message: error.message })
        }
      }
}

module.exports = new UserController();