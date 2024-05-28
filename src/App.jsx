import { useState, useEffect } from 'react'
//import axios from 'axios'
import personService from './services/persons'
import Persons from './components/Persons'
import Person from './components/Person'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'

import './index.css'
import ErrorMessage from './components/ErrorMessage'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newFilter, setNewFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  
  const Notify = (message) => {
    setNotificationMessage(message)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const ShowError = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const personObject = {
      name: newName,
      number: newNumber
    }
    console.log(persons.filter((person) => person.name === newName).length)
    if (persons.filter((person) => person.name === newName).length > 0) {
      const selectedPerson = persons.filter((person) => person.name === newName)[0]
      console.log(`${newName} is already added to phonebook`)
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)) {{
        const changedPerson = { ...selectedPerson, number: newNumber}
        console.log(`Would change ${newName}´s number to ${newNumber}`)
        personService
          .update(selectedPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== selectedPerson.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            Notify(`Changed ${newName}´s number to ${newNumber}`)
          })
          .catch(Error => {
            console.log("Error caught ....");
            ShowError(`${newName} already removed from server`)
            setPersons(persons.filter(p => p.id !== selectedPerson.id))
          })
      }}
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        Notify(`Added ${newName} with number ${newNumber}`)
      })
      
    }  
  }

  const deletePersonWithId = (id) => {
    const selectedPerson = persons.filter((person) => person.id === id)[0]
    console.log(`Trying to delete person with id ${id}`)
    console.log(`Trying to delete person ${selectedPerson.name}`)
    if (window.confirm(`Delete ${selectedPerson.name} ?`)) {
      personService
        .del(id)
        .then(returnedPerson => {
        console.log(`Deleting ${returnedPerson}`)
        setPersons(persons.filter(person => person.id !== id))
        setNewName('')
        setNewNumber('')
        Notify(`Deleted ${selectedPerson.name} with number ${selectedPerson.number}`)
      })
    }
      
  }  
  

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
  }, [])

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notificationMessage} />
      <ErrorMessage message={errorMessage} />
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />

      <h2>add a new</h2>

      <PersonForm addPerson={addPerson} 
        newName={newName} handleNameChange={handleNameChange} 
        newNumber={newNumber} handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons persons={persons} filter={newFilter} deletePersonWithId={deletePersonWithId}/>

    </div>
  )
}

export default App
