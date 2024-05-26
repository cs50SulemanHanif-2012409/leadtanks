const Leads = require('../model/Leads');
const Package = require('../model/package')
const FbUsers = require('../model/fbUsers')



class PackageController {

    async getPackages(req, res) {
        try {
            const pkgs = await Package.find({});
            res.json({ status: true, packages: pkgs })
        } catch (error) {
            res.json({ status: false, message: error.message })
        }
    }
    async getPackageData(req, res) {
        try {
            const page = Number(req.params.page ??  1)
            const skip = (page - 1 || 0) * 100;
            const Lead = await Leads
            .find({ leadPackageId: req.params.id })
            .populate({ path: "lead", select : "phoneNumber firstName lastName gender country", model: FbUsers })
            .limit(100)
            .skip(skip)
            let nextPage = (page + 1) ?? 2;
            if (Lead.length != 100) {
              nextPage = null;
            }
            return res.json({
              lead : Lead,
              nextPage,
              currentPage: page ?? 1,
              totalRecordsRetreived : Lead.length
            })
        } catch (error) {
            console.log(error)
            res.json({ error: error.message })
        }
    }
    async getPackage(req , res){
        try {
            console.log(req.params.id)
            const pkg = await Package
            .findOne({ _id : req.params.id });
            res.json({  status : true , pkg})
        } catch (error) {
            res.json({ status: false, message: error.message })
        }
    }
}

module.exports = new PackageController();