let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json()); // парсит тело только тех запросов, для которых 'Content-Type' равен 'application/json', Результат парсинга сохраняется в объекте req.body

var User = require('../collectionsMongo/User');
var Feedback = require('../collectionsMongo/Feedback');
var Problem = require('../collectionsMongo/Problem');

var VerifyToken = require('../auth/VerifyToken');

router.post('/agree_problem', function (req, res) {   //ПРЕДЛОЖЕНИЕ ХЕЛПЕРА ПОПАДАЕТ В OFFER-LIST

    Problem.findById(req.body.uidProblem, function (err, problem) {
        var offer;
        if (err) return res.status(500).send('Error on the server.');
        console.log(err);
        if (!problem) return res.status(404).send('No problem found.');

        offer = {answer:"",
            description:req.body.description,
            helper:req.body.uidHelper,
            price:req.body.price,
            problemName:req.body.uidProblem
        };

        problem.offerList.push(offer);
        problem.save(function (err,problemUpdated) {
            if(err) return "Error!";
            console.log(problemUpdated);
        });
        for(var i=0; i<problem.offerList.length;i++){
            if(problem.offerList[i].helper == req.body.uidHelper){
                offer = problem.offerList[i]._id;
            }
        }
        res.status(200).send({message:"Offer added",uidOffer:offer});
    })
});

router.post('/refuse_offer', function (req, res) { // ОТМЕНИТЬ ПРЕДЛОЖЕНИ HELPERA О ПОМОЩИ(ЕСЛИ ЕГО СОГЛАСИЕ ЕЩЕ НЕ ПОДТВЕРДИЛИ)


    Problem.findById(req.body.uidProblem, function (err, problem) {

        if (err) return res.status(500).send('Error on the server.');
        console.log(err);
        if (!problem) return res.status(404).send('No problem found.');

        var list = problem.offerList;

        for(let i=0;i<list.length;i++){
            let currOffer = list[i];
            console.log(currOffer + 'deded');
            if (currOffer['helper'] == req.body.uidHelper && currOffer._id ==req.body.uidOffer ){
                list.splice(currOffer,1)
            }
        }
        problem.save(function (err, updatedProblem) {
            if (err) return "Error!";
            res.status(200).send({message:'Offer refused'});
        })
    })

});

router.get('/get_offer_list',function (req,res) {
    Problem.findById(req.headers['uid'], function (err, problem) {
        if (err) return res.status(500).send('Error on the server.');
        if (!problem) return res.status(404).send('No problem found.');
        res.status(200).json({offerList:problem.offerList});
    })
});

router.post('/offer_accept',function (req,res) { //helper принимает чей то offer,offerList очищается,uid helpera в problem.helperUid
    Problem.findById(req.body.uidProblem, function (err, problem) {
        let helperUid;
        if (err) return res.status(500).send('Error on the server.');
        if (!problem) return res.status(404).send('No problem found.');

        let offersArr = problem.offerList ;
        for (let i=0;i<offersArr.length;i++){
            if(req.body.uidOffer == offersArr[i]._id){
     helperUid = offersArr[i].helper;
     break;
            }
        }
        problem.helpingUser=helperUid;
        problem.offerList = [];
        problem.save(function (err, updatedProblem) {
            if (err) return "Error!";
        });
        res.status(200).json({msg:'Offer_accepted'});
    })
})

router.post('/offer_reject',function (req,res) { //helper отменяет чей то offer, этот offer удаляется из offerList

    Problem.findById(req.body.uidProblem, function (err, problem) {

        if (err) return res.status(500).send('Error on the server.');
        if (!problem) return res.status(404).send('No problem found.');
console.log(problem)
        let offersArr = problem.offerList ;
        for (let i=0;i<offersArr.length;i++){
            if(req.body.uidOffer == offersArr[i]._id){
                console.log(req.body.uidOffer)
                 console.log(offersArr[i]._id);
                offersArr.splice(i,1);
                break;
            }
        }
        problem.save(function (err, updatedProblem) {
            if (err) return "Error!";
        });
        res.status(200).json({msg:'Offer_rejected'});
    })
});


module.exports = router;