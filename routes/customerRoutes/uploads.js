var express = require("express");
var router = express.Router();
var path = require("path");
var Customer = require('../../models/customerModel/customer');
var mkdirp = require('mkdirp');
var multer = require('multer');
var mongodb = require("mongodb");
var fs = require("fs");
var MongoClient = mongodb.MongoClient;
var {isLoggedIn} = require('../../functionality/login');
var async = require('async');
var File=require('../../models/customerModel/file');

// SHOW ROUTE
router.route("/")
    .get(isLoggedIn, function (req, res) {
                        res.render("customer-uploads", {
                            user: req.user
                        });
    })
    .post(isLoggedIn, function (req, res) {
    });

router.route("/pdf")
    .post(isLoggedIn, function (req, res) {
        var folder = 'customersPdf/' + req.user._id;
        var dir = path.join(__dirname, "../../customersPdf", req.user._id + "");
        var storage;
        fs.readdir(dir, (err, files) => {
            var length;
            if (files === undefined) {
                length = 0;
            } else {
                length = files.length;
            }
            storage = multer.diskStorage({
                destination: folder,
                filename: function (req, file, cb) {
                    cb(null, file.originalname);
                }
            });
            var upload = multer({
                storage: storage
            }).any();
            mkdirp(folder, function (err) {
                upload(req, res, function (err) {
                    if (err) {
                        return res.end("Error uploading file.");
                    } else {
                        var user=req.user;
                        var newFile = new File({
                            name:req.files[0].originalname,
                            desc:req.body.description,
                            fileType:req.files[0].mimetype,
                            source:"pdf"
                        });
                        newFile.save(function (err) {
                            user.file.push(newFile);
                            user.save(function (err) {
                                res.redirect("/customer/" + req.user._id + "/uploads");
                            });
                        });
                            }
                    })
                });
            });
        })
    .get(isLoggedIn, function (req, res) {
        res.render("customer-upload-pdf.ejs", {
            user: req.user,
            jpg: req.jpg,
            pdf: req.pdf
        });
    });

router.route("/jpg")
    .post(isLoggedIn, function (req, res) {
        var folder = 'customersJpg/' + req.user._id;
        var dir = path.join(__dirname, "../../customersJpg", req.user._id + "");

        async.waterfall([
            before,
            first,
            second,
            third]
        );

        function before(callback) {
            fs.readdir(dir, (err, files) => {
                var length;
                if (files === undefined) {
                    length = 0;
                } else {
                    length = files.length;
                }
                callback(null, length);
            })
        }

        function first(length, callback) {

            var storage = multer.diskStorage({
                destination: folder,
                filename: function (req, file, cb) {

                    cb(null, file.originalname);
                }
            });

            callback(null, storage);
        }

        function second(storage, callback) {

            var upload = multer({
                storage: storage
            }).any();

            callback(null, upload);
        }

        function third(upload) {

            mkdirp(folder, function (err) {
                upload(req, res, function (err) {
                    if (err) {
                        return res.end("Error uploading file.");
                    } else {
                        var user = req.user;
    var newFile = new File({
        name:req.files[0].originalname,
        desc:req.body.description,
        fileType:req.files[0].mimetype,
        source:"jpg"
    });
    newFile.save(function (err) {
        user.file.push(newFile);
        user.save(function (err) {
            res.redirect("/customer/" + req.user._id + "/uploads");
        });
    });
        }
    })
});
        }
})
    .get(isLoggedIn, function (req, res) {
        res.render("customer-upload-jpg.ejs", {
            user: req.user,
            jpg: req.jpg,
            pdf: req.pdf
        });
    });

    router.get("/uploads.js", function (request, response) {
        response.sendFile(path.join(__dirname, "../../public/javascripts/customer", "uploads.js"));
    });
    router.get("/getUploads", function (req, res) {
        Customer.findById(req.user._id)
            .populate('file')
            .exec(function (err, data) {
                res.send(data);
            });
    });

    router.get("/uploads.js", function (request, response) {
        response.sendFile(path.join(__dirname, "../../public/javascripts/customer", "uploads.js"));
    });

    router.get("/showUploads/:fid", function (req, res) {
        var fid=req.params.fid;
        var id=req.user._id;
        var File = require("../../models/customerModel/file");
    File.find({"_id": fid})
        .exec(function (err, result) {
            var tempFile;
            if(result[0].source=="pdf"){
                tempFile=path.join(__dirname, "../../customersPdf/"+id, result[0].name);
                fs.readFile(tempFile, function (err,data){
                    res.contentType(result[0].fileType);
                    res.send(data);
                 });
            }else{
                tempFile=path.join(__dirname, "../../customersJpg/"+id, result[0].name);
                fs.readFile(tempFile, function (err,data){
                    res.contentType(result[0].fileType);
                    res.send(data);
                 });
            }
        });
    });

    router.get("/delete/:fid", function (req, res) {
        var fid=req.params.fid;
        File.remove({_id: fid}, function (err) {
            if (!err) {
                Customer.findByIdAndUpdate(
                    fid,
                    {
                        "$pull": {"vehicles": fid}
                    },
                    (err, result) => {
                        if (err) {
                            res.status(500)
                                .json({error: 'Unable to delete service.'});
                        } else {
                            res.send("success");
                        }
                    });
            }
        });
    });

module.exports = router;