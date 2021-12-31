var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var fs = require('fs');
var axios = require('axios');
var feedbackData = require('../data/feedback.json');
var feedbackAddedCallbackData = require('../data/feedbackaddedcallback.json');

router.get('/api', function(req, res) {  
  res.json(feedbackData);
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.post('/api/hooks/feedbackaddedhook', function(req, res) {
  feedbackAddedCallbackData=req.body;
  fs.writeFile('app/data/feedbackaddedcallback.json', JSON.stringify(feedbackAddedCallbackData), 'utf8', function(err) {
    if (err) {
      console.log(err);
    }
  });

  var feedbackAddedHookDeleteUrl = req.protocol + "://" + req.hostname + "/api/hooks/deletefeedbackaddedhook";
  res.setHeader("Location",feedbackAddedHookDeleteUrl);
  res.json(req.body);
});

router.delete('/api/hooks/deletefeedbackaddedhook', function(req, res) {
var feedbackaddedjson={}
  fs.writeFile('app/data/feedbackaddedcallback.json', JSON.stringify(feedbackaddedjson), 'utf8', function(err) {
    if (err) {
      console.log(err);
    }
  });
  res.json("feddbackaddedwebhook deleted!!");

});

router.post('/api', function(req, res) {
  feedbackData.unshift(req.body);
  fs.writeFile('app/data/feedback.json', JSON.stringify(feedbackData), 'utf8', function(err) {
    if (err) {
      console.log(err);
    }
  });

   //invoking the flow trigger using callback url
  if(feedbackAddedCallbackData.targetUrl)
  {       
    var reqHeaders = {
      'Content-Type': 'application/json'
    }
    axios.post(feedbackAddedCallbackData.targetUrl,req.body,{
      headers: reqHeaders
    });

  }

  res.json(req.body);
});

router.put('/api/approve/:id', function(req, res) {

  if(feedbackData.find(t=>t.id === req.params.id))
  {    
    feedbackData.find(t=>t.id === req.params.id).status="Approved";
  }
  fs.writeFile('app/data/feedback.json', JSON.stringify(feedbackData), 'utf8', function(err) {
    if (err) {
      console.log(err);
    }
  });
  res.json(feedbackData);

});

router.put('/api/reject/:id', function(req, res) {
  if(feedbackData.find(t=>t.id === req.params.id))
  {    
    feedbackData.find(t=>t.id === req.params.id).status="Rejected";
  }
  fs.writeFile('app/data/feedback.json', JSON.stringify(feedbackData), 'utf8', function(err) {
    if (err) {
      console.log(err);
    }
  });
  res.json(feedbackData);
});

router.delete('/api/:id', function(req, res) {
  feedbackData.splice(req.params.id, 1);
  fs.writeFile('app/data/feedback.json', JSON.stringify(feedbackData), 'utf8', function(err) {
    if (err) {
      console.log(err);
    }
  });
  res.json(feedbackData);
});



module.exports = router;
