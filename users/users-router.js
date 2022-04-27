const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const DietJournalSchema = new mongoose.Schema({
    user: String,
    days: [{
      date: String,
      morning: [],
      afternoon: [],
      evening: []
    }]
  });
  
  const JournalUser = new mongoose.model('JournalUser', DietJournalSchema);
  


// Fetch all users...

router.get('/', async (req, res) => {
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
  router.get('/:user', async (req, res) => {
  
  
    const userToFind = req.params.user;
  
  
    const response = await JournalUser.findOne({user:userToFind})
    if(response === null){
       const newUser = await createUser(userToFind)
       const {id, user, days} = newUser;
       res.json({id,user,days})
       return
    }
    const {id, user, days} = response
    res.json({id,user,days});
  });
  
  
  
  async function createUser(name){
    const user = await new JournalUser(
      {
        user: name,
        days: []
      })
    user.save();
    return user;
  }
  
  // Create new user..
  router.post('/', async (req,res)=>{
    const user = await new JournalUser(
      {
        user: req.body.user,
        days: []
      })
    user.save();
    res.json(user)
  
  })
  
  
  // Update an entry for a user..
  
  router.post('/:user', async (req,res) => {
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
  
  router.delete('/:user', async (req,res) => {
  
    const userToDelete = req.params.user;
    const response = await JournalUser.deleteOne({"user": userToDelete})
    res.json(response)
  
  })

module.exports = router;