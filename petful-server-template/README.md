# Petful Server 

Live: 

## Consuming API endpoints
### /people
 GET 
 * returns a JSON array: ['person name', 'person2 name', 'etc']

POST
* requires a string "name" to be sent in the POST request
returns back with the name of that you sent in.

### /pets
GET
  * Returns a JSON list of all pets. There are two keys "dogs" and "cats". The key's value is an array of objects - each object has all of the details of one pet.

DELETE 
  * 'type' - the type of animal to delete. Valid types are 'cat' or 'dog', both are strings. We will dequeue the first dog or cat and dequeue the person who adopted the animal, if no type is sent then
  we will dequeue both animals.

## Technology Used
* React
* Node
* Express

## Authors
[Matthew Wagaman](https://github.com/AveraqeDev)