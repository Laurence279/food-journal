const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
require('dotenv').config()
const bcrypt = require('bcrypt');
const saltRounds = 10;


app.use(express.urlencoded({
  extended: true
}));
app.use(express.json())
app.use(cors());
mongoose.connect(`mongodb+srv://Laur:${process.env.P}@cluster0.lsmiq.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const DietJournalSchema = new mongoose.Schema({
  user: String,
  password: String,
  days: [{
    date: String,
    morning: [],
    afternoon: [],
    evening: []
  }]
});

const JournalUser = new mongoose.model('JournalUser', DietJournalSchema);



// const user = new JournalUser({user:"Laur",days:[{Date: "Wed Nov 10 2021",Morning:[{name:"Apples", type: ["Fruit"]}],Afternoon:[],Evening:[]}]})
// user.save();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// User Auth.. 

app.post('/api/auth', async (req,res) => {
  const auth = await checkPassword(req.body.username, req.body.password)
  res.json({auth: auth})
})

async function checkPassword(user, password) {
  const username = await JournalUser.findOne({user:user})
  if(!username.password) return console.warn("User or password not found")
  const hash = username.password
  const passwordCheck = await bcrypt.compareSync(password, hash);
  return passwordCheck;
}

// Fetch all users...

app.get('/api/users', async (req, res) => {
  const results = await JournalUser.find({})
  res.json(
    results.filter((result)=>{
      return result.user
    }).map((result)=>{
      return result.user
    })
    
    )

});

// Fetch one user..
app.get('/api/:user', async (req, res) => {


  const userToFind = req.params.user;


  const response = await JournalUser.findOne({user:userToFind})
  const {id, user, days} = response
  res.json({id,user,days});
});





// Create new user..
app.post('/api/', async (req,res)=>{
      // Hash password
      const password = bcrypt.hashSync(req.body.password, saltRounds);
  const user = await new JournalUser(
    {
      user: req.body.user,
      password: password,
      days: []
    })
  user.save();
  res.json(user)

})


// Update an entry for a user..

app.post('/api/:user', async (req,res) => {
  console.log("Post request received")
  const user = req.params.user;
  const updatedDay = {
    date: req.body.date,
    morning: req.body.morning,
    afternoon: req.body.afternoon,
    evening: req.body.evening
  }

  // Does this day already exist in db?
  const found = await JournalUser.find({
    "user": user,
    "days.date": updatedDay.date
  })


  if(found.length === 0){

    //Push a new entry
    const result = await JournalUser.updateOne(
      {
        "user": user
      },
      {
        "$push": {
          "days": updatedDay
        }
      },{
        upsert: true,
        new: true
      })
      console.log(result)
    
      res.json(result);
      return
  }

  // Replace the entry
  const result = await JournalUser.updateOne(
    
    {
      "user": user,
      "days.date": updatedDay.date
    },
    {
      "$set": {
        "days.$": updatedDay
      }
    },{
      upsert: true,
      new: true
    })
    console.log(result)
  
    res.json(result);
  
})

app.delete('/api/:user', async (req,res) => {

  const userToDelete = req.params.user;
  const response = await JournalUser.deleteOne({"user": userToDelete})
  res.json(response)

})


// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port);

console.log(`Food journal listening on ${port}`);
