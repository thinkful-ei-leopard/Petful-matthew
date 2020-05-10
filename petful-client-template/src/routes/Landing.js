import React from 'react'
import { Link } from 'react-router-dom'
import landingImage from '../images/landing-image.jpg'

function Landing() {
  return (
    <section className='Landing'>
      <h1 className='Landing__header'>Petful</h1>
      <img 
        className='Landing__image'
        src={landingImage}
        alt='A dog and a cat'
      />
      <p>
        We operate on a <span className='Landing__p-special'>first-come, first-served</span> basis. If
        you would like to adopt one of our adorable pets, click the button below and join the adoption queue!
        Cats and dogs who have been here the longest will be the first abailable for adoption.
      </p>
      <Link to='/adoption' className='Landing__button'>Join the Queue!</Link>
    </section>
  )
}

export default Landing;