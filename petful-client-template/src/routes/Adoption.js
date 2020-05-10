import React, { useState, useEffect } from 'react'
import config from '../config'

// Using a functional component to get used to React Hooks
function Adoption() {
  const [ value, setValue ] = useState('')
  const [ name, setName ] = useState('')
  const [ cats, setCats ] = useState([])
  const [ dogs, setDogs ] = useState([])
  const [ queue, setQueue ] = useState([])
  const [ loading, setLoading ] = useState(true)
  const [ error, setError ] = useState(null)
  const [ adopter, setAdopter ] = useState('')
  const [ recentAdoption, setRecentAdoption ] = useState('')

  useEffect(() => {
    setQueueAndPets()
  })

  const setQueueAndPets = async () => {
    setLoading(true)
    const [ queueRes, petsRes ] = await Promise.all([
      fetch(`${config.API_ENDPOINT}/people`),
      fetch(`${config.API_ENDPOINT}/pets`)
    ])
    if(!queueRes.ok) return queueRes.json().then(e => Promise.reject(e))
    if(!petsRes.ok) return petsRes.json().then(e => Promise.reject(e))

    try {
      const [ queue, pets ] = await Promise.all([
        queueRes.json(),
        petsRes.json()
      ])
      setQueue(queue)
      setCats(pets.cats)
      setDogs(pets.dogs)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setError(error)
    }
  }

  const handleAdoption = async (type) => {
    const adoption = await fetch(`${config.API_ENDPOINT}/pets${type === null ? '' : `?type=${type}`}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
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
      setRecentAdoption(
        `${person} just adopted ${catName}, a ${catAge} year old ${catGender} ${catBreed} cat, and ${dogName}, a ${dogAge} year old ${dogGender} ${dogBreed} dog!`
      )
    } else {
      const { person } = adoption
      const { age, breed, gender, name } = adoption[type]
      setRecentAdoption(
        `${person} just adopted ${name}, a ${age} year old ${gender} ${breed} ${type}!`
      )
    }
    await setQueueAndPets()
  }

  const startQueue = () => {
    let counter = 0
    while(adopter !== name) {
      setInterval(() => {
        setAdopter(queue[counter])
        if(adopter === name) {
          clearInterval()
        }
        let type = randomType()
        handleAdoption(type)
        counter++
      })
    }
  }

  const randomType = () => {
    let possibleTypes = ['cat', 'dog', null];
    return possibleTypes[Math.round(Math.random())]
  }

  const handleJoinQueue = async (event) => {
    event.preventDefault()

    setName(value)
    setValue('')

    const person = await fetch(`${config.API_ENDPOINT}/people`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name})
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
      setQueue(queue.concat(person))
      startQueue()
  }

  const renderButtons = (type) => {
    return (
      <button
        className='adopt-button'
        disabled={adopter !== name}
        onClick={() => {
          handleAdoption(type)
        }}
      >
        Adopt {type === null ? 'Both' : 'Me'}
      </button>
    )
  }

  const generateWaitList = () => {
    return queue.map(person => (
      <li>{person}</li>
    ))
  }

  if(error) {
    return (
      <div className='Adoption'>
        <p className='error'>{error}</p>
      </div>
    )
  }

  return (
    <div className='Adoption'>
      
      <section role='contentinfo' className='Adoption__info'>
        <p className='intro-text'>
          Welcome to the adoption page! Our furry little friends are eager to join you!
          As said before, we operate on a <span className='first-come'>first-come, first-server</span> basis,
          so please input your name below to be added to the queue. Once it is your turn,
          you may choose either the dog or the cat who is currently up for adoption to bring home.
          If you are feeling extra kind you could even bring both home!
        </p>

        <div className='Adoption__waiting'>
          <h2 className='Adoption__waiting-header'>Waitlist</h2>
          <ul className='Adoption__waiting-list'>
            {generateWaitList()}
          </ul>
          <div className='Adoption__waiting-form-container'>
            <form className='Adoption__waiting-form' autoComplete='off'>
              <label htmlFor='adopter-name'>Add your name: </label>
              <input 
                id='adopter-name'
                autoComplete='off'
                type='text'
                value={name}
                onChange={event => setValue(event.target.value)}
              />
              <button
                type='submit'
                onClick={handleJoinQueue}
              >
                Join Queue!
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className='Adoption__pets'>
        <div className='Adoption__pets-cats'>
          <h2 className='Adoption__pets-cats-header'>Next available cat</h2>
          {!cats.length ? (
            <h3>No cats left!</h3>
          ) : (
            <div className='Adoption__pets-cats-next'>
              <div className='Adoption__pets-cats-next-info'>
                <img
                  className='Adoption__pets-cats-next-info-image'
                  src={cats[0].imageURL}
                  alt={cats[0].description}
                />
                <p className='Adoption__pets-cats-next-info-name'>
                  Name: {cats[0].name}
                </p>
                <p className='Adoption__pets-cats-next-info-age'>
                  Age: {cats[0].age}
                </p>
                <p className='Adoption__pets-cats-next-info-gender'>
                  Gender: {cats[0].gender}
                </p>
                <p className='Adoption__pets-cats-next-info-breed'>
                  Breed: {cats[0].breed}
                </p>
                <p className='Adoption__pets-cats-next-info-story'>
                  Story: {cats[0].story}
                </p>
              </div>
              <div className='Adoption__pets-cats-next-buttons'>
                {renderButtons('cat')}
              </div>
            </div>
          )}
        </div>
        
        <div className='center-both'>
          {renderButtons(null)}
        </div>

        <div className='Adoption__pets-dogs'>
          <h2 className='Adoption__pets-dogs-header'>Next available dog</h2>
          {!dogs.length ? (
            <h3>No dogs left!</h3>
          ) : (
            <div className='Adoption__pets-dogs-next'>
              <div className='Adoption__pets-dogs-next-info'>
                <img
                  className='Adoption__pets-dogs-next-info-image'
                  src={dogs[0].imageURL}
                  alt={dogs[0].description}
                />
                <p className='Adoption__pets-dogs-next-info-name'>
                  Name: {dogs[0].name}
                </p>
                <p className='Adoption__pets-dogs-next-info-age'>
                  Age: {dogs[0].age}
                </p>
                <p className='Adoption__pets-dogs-next-info-gender'>
                  Gender: {dogs[0].gender}
                </p>
                <p className='Adoption__pets-dogs-next-info-breed'>
                  Breed: {dogs[0].breed}
                </p>
                <p className='Adoption__pets-dogs-next-info-story'>
                  Story: {dogs[0].story}
                </p>
              </div>
              <div className='Adoption__pets-dogs-next-buttons'>
                {renderButtons('dog')}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Adoption