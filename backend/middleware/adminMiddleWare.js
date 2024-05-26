const AdminModel = require("../model/Admin");
const jwt = require("jsonwebtoken");

 const adminMiddleWare = (req, res, next) => {
  const token = req.cookies.adminToken
  if (!token) {
    res.clearCookie('adminToken');
    return res.json({ status: false , message : 'UnAuthorized Request. User Not LoggedIn' })
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
     res.clearCookie('adminToken');
     return res.json({ status: false , message : 'Session Expired'})
    } else {
      try {
       const admin = await AdminModel.findById(data.id);
       req.admin =  admin;
       next()
      } catch (error) {
        res.json({ status: false , message : 'UnAuthorized Request, Invalid Token'})
      }  
    }
  })
}

module.exports = adminMiddleWare