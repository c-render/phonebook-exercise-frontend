const Person = ({person, deletePerson}) => {
    console.log(person)
    return (   
        <li>{person.name} {person.number} <button onClick={deletePerson}>delete</button>
        </li>
    )
}

export default Person