const express = require('express');
const json = require('body-parser').json();

const Pets = require('./pets.service');
const People = require('../people/people.service');

const router = express.Router();

router.get('/', (req, res) => {
  // Return all pets currently up for adoption.
  return res.json(Pets.getAllPets());
});

router.delete('/', json, (req, res) => {
  // Remove a pet from adoption.
  const { type } = req.query;

  const person = People.dequeue();

  if(person === null) {
    return res.status(400).json({
      error: 'There is no one in the queue'    
    });
  }

  // check if type is specified, if not then dequeue both types of pets
  if(!type) {
    const cat = Pets.dequeue('cat');
    const dog = Pets.dequeue('dog');
    return res.json({ cat, dog, person });
  }

  // make sure type is a string
  if(typeof type !== 'string') {
    return res.status(400).json({
      error: '`type` must be a string'
    });
  }

  // make sure type is either cats or dogs
  if(type.toLowerCase() !== 'cat' && type.toLowerCase() !== 'dog') {
    return res.status(400).json({
      error: '`type` must be either `cat` or `dog`'
    });
  }

  // all checks have passed
  const pet = Pets.dequeue(type);
  return res.json({ [type]: pet, person });
});

module.exports = router;
