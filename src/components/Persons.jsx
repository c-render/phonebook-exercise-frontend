import Person from './Person'

const Persons = ({persons, filter, deletePersonWithId}) => {

    const personsToShow =
    persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()) )

    return (
        <ul>
            {personsToShow.map((person) =>
                <Person key={person.id} person={person} deletePerson={() => deletePersonWithId(person.id)} />
            )}
        </ul>
    )
}

export default Persons