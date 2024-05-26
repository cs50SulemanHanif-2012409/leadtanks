const UserModel = require('../model/User')
const FbUsersModel = require('../model/fbUsers')
const Package = require('../model/package')
const Leads = require('../model/Leads')
const AdminModel = require('../model/Admin')
const JamalModel = require('../model/JamalCompanies')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const sendMail = require('../utils/mail/mail')
const FbCountries = require('../model/fbCountries')



class AdminController {

  async login(req, res) {
    try {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
      const isExists = await AdminModel.findOne({
        $or: [
          { firstName: { $regex: req.body.username, $options: "i" } },
          { lastName: { $regex: req.body.username, $options: "i" } },
          { email: { $regex: req.body.username, $options: "i" } },
        ]
      })
      if (!isExists) {
        return res.json({ status: false, message: "Invalid Email Or Username" })
      }
      const auth = await bcrypt.compare(req.body.password, isExists.password)
      if (!auth) {
        return res.json({ message: 'Incorrect password or email' })
      }
      const token = jwt.sign({ id: isExists._id }, process.env.JWT_SECRET, { expiresIn: '60d' })
      res.cookie("adminToken", token, {
        withCredentials: true,
        httpOnly: false,
      });
      sendMail(isExists.email, 'Account Signin Success | LeadTanks', 'Your Account Was LoggedIn From Ip : ' + ip);
      res.status(201).json({ message: "User logged in successfully", success: true, });

    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  }

  async getUser(req, res) {
    try {
      const users = await UserModel.find({}, { password: 0 });
      return res.status(200).json({ status: true, message: 'Users Retreived Successfully', users })

    } catch (error) {
      return res.status(200).json({ status: false, message: error.message, users: [] })
    }
  }
  async putUser(req, res) {
    if (!req.params.id) res.json({ status: false, message: 'Invalid User Id or Id Not Passed' });
    try {
      const response = await UserModel.updateOne({ _id: req.params.id }, { $set: { ...req.body } })
      res.json({ status: true, response })
    } catch (error) {
      res.json({ status: false, message: error.message })
    }
  }
  async removeUser(req, res) {
    if (!req.params.id) res.json({ status: false, message: 'Invalid User Id or Id Not Passed' });
    try {
      const user = await UserModel.findById(req.params.id);
      const isDeleted = await UserModel.deleteOne({ _id: req.params.id });
      sendMail(user.email, 'Account DeActivated', 'Dear User, your Account has been deleted')
      res.json({ status: true, isDeleted })
    } catch (error) {
      res.json({ status: false, message: error.message })
    }
  }

  async getFbUsers(req, res) {
    try {
      console.log(req.query)
      const page = Number(req.query.page)
      const skip = (page - 1 || 0) * 100;
      let fbUsers;
      if (req.query.country && req.query.country !== 'all') {
        fbUsers = await FbUsersModel.find({ country: req.query.country }, { line: 0 }).limit(100).skip(skip);
      } else {
        fbUsers = await FbUsersModel.find({}, { line: 0 }).limit(100).skip(skip);
      }
      return res.json({
        users: fbUsers,
        currentPage: page ?? 1,
        nextPage: (page + 1) ?? 2
      })
    } catch (error) {

    }
  }
  async getJamalcompanies(req, res) {
    try {
      console.log(req.query)
      const page = Number(req.query.page)
      const skip = (page - 1 || 0) * 100;
      let Companies = await JamalModel.find({}, { line: 0 }).limit(100).skip(skip);;
      return res.json({
        companies: Companies,
        currentPage: page ?? 1,
        nextPage: (page + 1) ?? 2
      })
    } catch (error) {

    }
  }

  async getDashboardStatistic(req, res) {
    try {

      const users = await UserModel.countDocuments();
      const packages = await Package.countDocuments();
      const leads = await FbUsersModel.countDocuments();
      const jamalleads = await JamalModel.countDocuments();

      res.json({
        users,
        packages,
        leads,
        jamalleads,
        status: true,
      })

    } catch (error) {
      res.json({
        status: true,
        message: error.message
      })

    }
  }

  async getFbCountries(req, res) {
    try {
      const countries = await FbCountries.findOne();
      return res.json({
        countries
      })
    } catch (error) {

    }
  }


  // Old function With Paginations
  // async getPackages(req, res) {
  //   try {
  //     const page = Number(req.query.page)
  //     const skip = (page - 1 || 0) * 100;
  //     const packages = await Package.find({}).limit(100).skip(skip);
  //     let nextPage = (page + 1) ?? 2;
  //     if (packages.length !== 100) {
  //       nextPage = null;
  //     }

  //     return res.json({
  //       packages,
  //       nextPage,
  //       currentPage: page ?? 1,
  //     })
  //   } catch (error) {

  //   }
  // }
  // Now No Need Of Pagination
  async getPackages(req, res) {
    try {
      const packages = await Package.find({})
      return res.json({
        packages,
        status: true,
      })
    } catch (error) {
      return res.json({
        status: false,
        message: error.message
      })
    }
  }

  async createPackage(req, res) {
    try {
      const _package = await Package.create({ ...req.body });
      const { db } = req.body
      if (db == 'fb') {
        const leads = await FbUsersModel.find({ country: req.body.selectedCountry })
          .select({ _id: true }).limit(req.body.noleads);
        const documentsWithDynamicField = leads.map((doc) => {
          return { lead: doc._id, leadPackageId: _package._id };
        });
        const _lead = await Leads.insertMany(documentsWithDynamicField)
      }
      if (db == 'jp') {
        const leads = await JamalModel.find({})
          .select({ _id: true }).limit(req.body.noleads);
        const documentsWithDynamicField = leads.map((doc) => {
          return { lead: doc._id, leadPackageId: _package._id };
        });
        const _lead = await Leads.insertMany(documentsWithDynamicField)
      }
      res.json({
        status: true,
      })

    } catch (error) {
      res.json({
        status: false,
        message: error.message
      })
    }
  }

  async removePackage(req, res) {
    if (!req.params.id) res.json({ status: false, message: 'Invalid Package Id' });
    try {
      await Package.deleteOne({ _id: req.params.id });
      await Leads.deleteMany({ leadPackageId: req.params.id })
      res.json({ status: true, message: 'Package Removed' })
    } catch (error) {
      res.json({ status: false, message: error.message })
    }
  }
  async updatePackage(req, res) {
    if (!req.params.id) res.json({ status: false, message: 'Invalid Package Id' });
    try {
      console.log(req.params.id)
      console.log(req.body)

      const response = await Package.updateOne({ _id: req.params.id }, { $set: req.body }, { $new: true })

      res.json({ status: response.modifiedCount, message: response.modifiedCount ? 'Updated' : 'Failed' })
    } catch (error) {
      res.json({ status: false, message: error.message })
    }
  }
}


module.exports = new AdminController()