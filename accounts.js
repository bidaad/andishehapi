const express = require('express');
const joi = require('joi');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
var cors = require('cors');
const tools = require('./tools')
var config = require('./config.js');
var schema = require('./schema.js');


const app = express();
const cacheDuration = 3600

app.use(express.json())


app.use(cors());

app.disable('etag');
var ObjectId = require('mongoose').Types.ObjectId;
var router = express.Router();
// Home page route.
router.get('/', function (req, res) {
  res.send('Accounts home page');
})


const accounts = mongoose.model('accounts', schema.accounts);

router.get('/list', (req, res) => {
  var takeCount = 20;
  if (req.query.pageNo) pageNo = parseInt(req.query.pageNo)
  const skipCount = (pageNo - 1) * takeCount

  run().catch(error => console.log(error.stack));


  async function run() {
    await mongoose.connect(config.dbConnection, { useNewUrlParser: true });

    const recordList = await accounts.find({}, function (err, doc) {
      if (err) {
        return res.status(404).send('The item with the given id was not found');
      }
    });

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(200).json(recordList).end();

  }
})

module.exports = router;