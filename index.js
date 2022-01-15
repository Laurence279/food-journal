const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config()

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json())

mongoose.connect(`mongodb+srv://Laur:${process.env.P}@cluster0.lsmiq.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const DietJournalSchema = new mongoose.Schema({
  user: String,
  days: [{
    Date: String,
    Morning: [],
    Afternoon: [],
    Evening: []
  }]
});

const arr = {
  Date: "Mon Nov 08 2021",
  Morning: [1,2,3],
  Afternoon: [2,3,4],
  Evening: [4,2,6]
}

const JournalUser = new mongoose.model('JournalUser', DietJournalSchema);

JournalUser.updateOne(
  {
    "user": "Laury",
    "days.Date": "Mon Nov 08 2021"

  },
  {
    "$set": {
      "days.$": arr

    }
  }, function (err, results) {
  if (err) {
      console.log(err);
  } 
    
    console.log(results)
  }
    )

// const user = new JournalUser({user:"Laur",days:[{Date: "Wed Nov 10 2021",Morning:[{name:"Apples", type: ["Fruit"]}],Afternoon:[],Evening:[]}]})
// user.save();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/api/find/:user', (req, res) => {
  console.log("hi");

  console.log(req.params.user)
  const userToFind = req.params.user;
  console.log(userToFind)

  JournalUser.findOne({user:userToFind}, function (err, results) {
    if (err) {
        console.log(err);
    } else {
      if(results == null){
        // const user = new JournalUser({user:userToFind,days:[{Date: "Wed Nov 10 2021",Morning:[{name:"Apples", type: ["Fruit"]}],Afternoon:[],Evening:[]}]})
        // user.save();
      }
        res.json(results)
    }

})
});

// Put all API endpoints under '/api'
app.get('/api', (req, res) => {

  JournalUser.findOne({user:"Tasha"}, function (err, results) {
    if (err) {
        console.log(err);
    } else {
        res.json(results)
    }

})

});

app.post('/api/post/:user', (req,res) => {

  const user = req.params.user;
  const days = req.body.object;
  const objectToAdd = req.body.objectToAdd;

  for(let i = 0; i < days.length; i++){
    if(days[i].Date === req.body.whenToAdd){

      const array = days[i][req.body.whereToAdd].filter(function(e){
        return e.id === objectToAdd.id;
      })
      if(array.length === 0){
        days[i][req.body.whereToAdd].push(objectToAdd);
      }
    }
  }

  console.log(req.body);

  JournalUser.updateOne({
    user: user
}, {
    $set: {
        'days': days,
    }
}, {
    upsert: true,
    new: true
}, function (err, res) {
    if (err) {
        console.log(err)
    }
})
  res.send("hello");
})

app.post('/api/delete/:user', (req,res) => {

  const user= req.params.user;
  const days = req.body.object;
  const objectToDelete = req.body.objectToDelete;

  for(let i = 0; i < days.length; i++){
    if(days[i].Date === objectToDelete.date){
      days[i][objectToDelete.time] = days[i][objectToDelete.time].filter(function(e){
        return e.id !== objectToDelete.id
      })
    }
  }
  
  
  console.log(req.body);
  JournalUser.updateOne({
    user: user
}, {
    $set: {
        'days': days,
    }
}, {
    upsert: true,
    new: true
}, function (err, res) {
    if (err) {
        console.log(err)
    }
})
  res.send("hello");
})


// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port);

console.log(`Food journal listening on ${port}`);
