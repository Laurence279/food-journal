const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
require('dotenv').config()
const bcrypt = require('bcrypt');
const saltRounds = 10;
const URL_VALIDATION = ["localhost:48752", "whatdidieat.herokuapp.com"]
const usersRouter = require('./users/users-router.js');

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json())
app.use(cors());


mongoose.connect(`mongodb+srv://Laur:${process.env.P}@cluster0.lsmiq.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
    useUnifiedTopology: true,
});



// const user = new JournalUser({user:"Laur",days:[{Date: "Wed Nov 10 2021",Morning:[{name:"Apples", type: ["Fruit"]}],Afternoon:[],Evening:[]}]})
// user.save();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(validate);

app.use("/users", usersRouter);


async function validate(req, res, next){
  const referer = req.headers.referer;
  if(!referer)
  {
      res.status(401).send("Unauthorised")
      return;
  }
  if(!isRefererValid(referer))
  {
      res.status(401).send("Unauthorised")
      return;
  }
  next();
}

function isRefererValid(referer)
{
    let validated = false;
    
    URL_VALIDATION.forEach((string)=>{
        if(referer.includes(string)) validated = true;
    })
    if(validated) console.log("User made a successful request from:", referer);
    return validated
}
    



// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port);

console.log(`Food journal listening on ${port}`);
