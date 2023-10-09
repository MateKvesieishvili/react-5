import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [formValues, setFormValues] = useState({
    id: '',
    username: '',
    secondName: '',
    email: '',
    age: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get('http://localhost:3001/users')
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  };

  const validate = () => {
    const errors = {};

    if (!formValues.username || formValues.username.length < 4) {
      errors.username = 'Username should have at least 4 characters';
    }

    if (!formValues.secondName || formValues.secondName.length < 4) {
      errors.secondName = 'Second Name should have at least 4 characters';
    }

    if (!formValues.email || !formValues.email.includes('gmail.com')) {
      errors.email = 'Email should have @gmail.com';
    }

    if (!formValues.age || formValues.age < 18) {
      errors.age = 'You should be at least 18 to register';
    }

    return errors;
  };

  const onFormValuesChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevFormValues) => ({ ...prevFormValues, [name]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const errors = validate();

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      axios
        .post('http://localhost:3001/users', formValues)
        .then(() => {
          fetchUsers();
          setFormValues({
            id: '',
            username: '',
            secondName: '',
            email: '',
            age: '',
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error adding user:', error);
          setLoading(false);
        });
    } else {
      setFormErrors(errors);
    }
  };

  const onDelete = (id) => {
    setLoading(true);
    axios
      .delete(`http://localhost:3001/users/${id}`)
      .then(() => {
        fetchUsers();
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
        setLoading(false);
      });
  };

  const onEdit = (user) => {
    setFormValues(user);
  };

  const onSaveEdit = () => {
    const errors = validate();

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      axios
        .put(`http://localhost:3001/users/${formValues.id}`, formValues)
        .then(() => {
          fetchUsers();
          setFormValues({
            id: '',
            username: '',
            secondName: '',
            email: '',
            age: '',
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error updating user:', error);
          setLoading(false);
        });
    } else {
      setFormErrors(errors);
    }
  };

  return (
    <div className="container">
      <form className="registerForm">
        <h2 className="registerText">Register</h2>
        <div className="inputDiv">
          <input
            name="username"
            className="input"
            placeholder="Username"
            value={formValues.username}
            onChange={onFormValuesChange}
          />

          {formErrors.username && <ErrorMessage text={formErrors.username} />}

          <input
            name="secondName"
            className="input"
            placeholder="Second Name"
            value={formValues.secondName}
            onChange={onFormValuesChange}
          />

          {formErrors.secondName && <ErrorMessage text={formErrors.secondName} />}

          <input
            name="email"
            className="input"
            placeholder="Email"
            value={formValues.email}
            onChange={onFormValuesChange}
          />

          {formErrors.email && <ErrorMessage text={formErrors.email} />}

          <input
            name="age"
            className="input"
            placeholder="Age"
            type="number"
            value={formValues.age}
            onChange={onFormValuesChange}
          />

          {formErrors.age && <ErrorMessage text={formErrors.age} />}
        </div>
        <div className="buttonsDiv">
          <button className="btn submit" onClick={onSubmit}>
            Add User
          </button>
          {formValues.id ? (
            <button className="btn edit" onClick={onSaveEdit}>
              Save Edit
            </button>
          ) : null}
        </div>
      </form>
      <div className="userList">
        <h2 style={{ color: 'white' }}>User List</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul>
            {users.map((user) => (
              <li key={user.id} style={{ color: 'white' }}>
                Username: {user.username}, <br />
                Second Name: {user.secondName}, <br />
                Email: {user.email}, <br />
                Age: {user.age} <br />
                <button className="btn" onClick={() => onEdit(user)}>
                  Edit
                </button>{' '}
                <br />
                <button className="btn" onClick={() => onDelete(user.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const ErrorMessage = ({ text }) => {
  return <p style={{ color: 'red' }}>{text}</p>;
};

export default App;
