import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import config from '../config';

import '../styles/Adoption.css';

export class Adoption extends Component {
  state = {
    people: [],
    dogs: [],
    cats: [],
    value: '',
    loading: true,
    name: '',
    recentAdoption: 'No Recent Adoptions :(',
    fakePeople: [
      'Laura Palmer',
      'Dale Cooper',
      'Donna Hayward',
      'Leland Palmer',
      'Audrey Horne',
      'Josie Packard',
      'Norma Jennings',
      'James Hurley',
      'Bobby Briggs',
      'Dr. Lawrence Jacoby',
      'Nadine Hurley',
      'Leo Johnson',
      'Catherine Martell',
      'Log Lady',
      'Gordon Cole',
    ],
  };

  componentDidMount() {
    this.getPeopleAndPets();
  }

  getPeopleAndPets = async () => {
    // get all people and pets on component
    const [peopleRes, petsRes] = await Promise.all([
      fetch(`${config.API_ENDPOINT}/people`),
      fetch(`${config.API_ENDPOINT}/pets`),
    ]);
    if (!peopleRes.ok) return peopleRes.json().then((e) => Promise.reject(e));
    if (!petsRes.ok) return petsRes.json().then((e_1) => Promise.reject(e_1));
    try {
      const [people, pets] = await Promise.all([
        peopleRes.json(),
        petsRes.json(),
      ]);
      this.setState({
        people,
        cats: pets.cats,
        dogs: pets.dogs,
        loading: false,
      });
    } catch (error) {}
  };

  handleSignUp = async (e, name) => {
    // e.preventDefault();
    const { fakePeople } = this.state;
    // * POST NEW PERSON
    await fetch(`${config.API_ENDPOINT}/people`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        name,
      }),
    }).then((res) =>
      !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
    );
    await this.getPeopleAndPets();
    if (!fakePeople.includes(name)) {
      this.setState({ name });
      await this.startQueue(e);
    }
  };

  randomPet = () => {
    const pets = ['dog', 'cat', null];
    let randomNum = Math.round(Math.random());
    return pets[randomNum];
  };

  startQueue = (e) => {
    const { fakePeople, name, people } = this.state;
    let counter = 0;
    if (name !== people[0]) {
      return setInterval(() => {
        const { name, people } = this.state;
        let randomPet = this.randomPet();
        let fakePerson = fakePeople[counter];
        if (name === people[0]) {
          clearInterval();
          return;
        }
        this.handleAdopt(randomPet, false);
        this.handleSignUp(e, fakePerson);
        counter < 10 ? counter++ : (counter = 0);
      }, 5000);
    } else {
      clearInterval();
    }
  };

  handleAdopt = async (type) => {
    const adoption = await fetch(`${config.API_ENDPOINT}/pets${type === null ? '' : `?type=${type}`}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      }
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )

    if(type === null) {
      const { person } = adoption
      const { catAge, catBreed, catGender, catName } = adoption.cat
      const { dogAge, dogBreed, dogGender, dogName } = adoption.dog
      this.setState({
        recentAdoption: `${person} just adopted ${catName}, a ${catAge} year old ${catGender} ${catBreed} cat, and ${dogName}, a ${dogAge} year old ${dogGender} ${dogBreed} dog!`
      })
    } else {
      const { person } = adoption
      const { age, breed, gender, name } = adoption[type]
      this.setState({
        recentAdoption: `${person} just adopted ${name}, a ${age} year old ${gender} ${breed} ${type}!`
      })
    }

    await this.getPeopleAndPets();
  };

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  notifySuccess = () => {
    alert('congrats! you have made a successful adoption!');
  };

  renderButtons = (type, both, who) => {
    const { name, people } = this.state;
    if (name === people[0]) {
      return (
        <button
          className="adopt-button"
          type="submit"
          onClick={() => {
            this.handleAdopt(type, both);
            this.notifySuccess();
          }}>
          Adopt {who}!
        </button>
      );
    }
  };

  generateWaitList = () => {
    const { people } = this.state;
    return people.map(person => (
      <li key={person}>{person}</li>
    ))
  }

  render() {
    const { cats, dogs, recentAdoption } = this.state;

    if (this.state.loading) {
      return <></>;
    }

    return (
      <div className="Adoption">
        <nav className="nav-bar">
          <Link className="home-link" to={'/'}>
            <h1 className="petful-header">
              Petful
            </h1>
          </Link>
        </nav>

        <section role="contentinfo" className="adoption-info">
          <p className="intro-text">
            Welcome to the adoption page! Cats and dogs are available for
            adoption based on how long they've been with us. Please input your
            name to be added to the list. Once it's your turn, you may choose to
            adopt the dog or cat who is currently up for adoption (or get them
            both!).
          </p>
        
        <div className="waitlist">
          <h2 className="waitlist-header">Waitlist</h2>
          <ul className="user-list">
            {this.generateWaitList()}
          </ul>
          <div className="waitlist-form-container">
            <form className="waitlist-form" autoComplete="off">
              <label htmlFor="adopter-name">Add your name: </label>
              <input
                id="adopter-name"
                autoComplete="off"
                type="text"
                value={this.state.value}
                onChange={this.handleChange}
              />
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  this.handleSignUp(e, this.state.value);
                  this.setState({ value: '' });
                }}>
                Enter
              </button>
            </form>
          </div>
        </div>

        <div className='Adoption__recent'>
          <h2 className='Adoption__recent-header'>Recent Adoption</h2>
          <p className='Adoption__recent-text'>{recentAdoption}</p>
        </div>
        </section>

        <main className="pets-container">
          <section className="cats-container">
            <h2 className="cats-header">Next available cat</h2>
            {!cats.length ? (
              <h3>No cats left!</h3>
            ) : (
              <div>
                <div className="cat-info">
                  <img
                    className="available-cat-image"
                    src={cats[0].imageURL}
                    alt={cats[0].description}
                  />
                  <p className="cat-name">
                    <span>name:</span> {cats[0].name}{' '}
                  </p>
                  <p className="cat-age">
                    <span>age:</span> {cats[0].age}{' '}
                  </p>
                  <p className="cat-gender">
                    <span>gender:</span> {cats[0].gender}{' '}
                  </p>
                  <p className="cat-breed">
                    <span>breed:</span> {cats[0].breed}{' '}
                  </p>
                  <p className="cat-story">
                    <span>story:</span> {cats[0].story}{' '}
                  </p>
                </div>
                <div className="center">
                  {this.renderButtons('cats', false, 'Me')}
                </div>
              </div>
            )}
          </section>

          <div className="center-both">
            {this.renderButtons('', true, 'Both')}
          </div>

          <section className="dogs-container">
            <h2 className="dogs-header">Next available dog</h2>
            {!dogs.length ? (
              <h3>No dogs left!</h3>
            ) : (
              <div>
                <div className="dog-info">
                  <img
                    className="available-dog-image"
                    src={dogs[0].imageURL}
                    alt={dogs[0].description}
                  />
                  <p className="dog-name">
                    <span>name:</span> {dogs[0].name}
                  </p>
                  <p className="dog-age">
                    <span>age:</span> {dogs[0].age}{' '}
                  </p>
                  <p className="dog-gender">
                    <span>gender:</span> {dogs[0].gender}
                  </p>
                  <p className="dog-breed">
                    <span>breed:</span> {dogs[0].breed}
                  </p>
                  <p className="dog-story">
                    <span>story:</span> {dogs[0].story}
                  </p>
                </div>
                <div className="center">
                  {this.renderButtons('dogs', false, 'Me')}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    );
  }
}

export default Adoption;