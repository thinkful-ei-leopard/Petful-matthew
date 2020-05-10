const Queue = require('../queue/Queue');
const store = require('../../store');

// Set up initial data.
// --------------------

const pets = {
  cats: new Queue(),
  dogs: new Queue()
};

store.cats.forEach(cat => pets.cats.enqueue(cat));
store.dogs.forEach(dog => pets.dogs.enqueue(dog));

// --------------------

module.exports = {
  get() {
    // Return the pets next in line to be adopted.
    const cat = pets.cats.show();
    const dog = pets.dogs.show();
    return [cat, dog];
  },

  getAllPets() {
    // Return all pets up for adoption
    const cats = pets.cats.all();
    const dogs = pets.dogs.all();
    return {
      cats,
      dogs
    };
  },

  dequeue(type) {
    // Remove a pet from the queue.
    if(type === 'cat') {
      return pets.cats.dequeue();
    } else if(type === 'dog') {
      return pets.dogs.dequeue();
    } else {
      throw new Error('Invalid pet type');
    }
  }
};
