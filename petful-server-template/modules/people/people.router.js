const express = require('express');
const json = require('body-parser').json();

const People = require('./people.service');

const router = express.Router();

router.get('/', (req, res) => {
  // Return all the people currently in the queue.
  return res.json(People.get());
});

router.post('/', json, (req, res) => {
  // Add a new person to the queue.
  const { person } = req.body;

  if(!person) {
    return res.status(400).json({
      error: 'Invalid `name`'
    });
  }
  if(typeof person !== 'string') {
    return res.status(400).json({
      error: '`name` must be a string'
    });
  }

  People.enqueue(person);

  return res.status(201).json({ person });
});

module.exports = router;
