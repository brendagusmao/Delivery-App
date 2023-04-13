/* eslint-disable react/jsx-max-depth */
import React, { useState, useContext, useCallback } from 'react';
import { BsArrowLeftShort } from 'react-icons/bs';
import { useNavigate } from 'react-router';
import AppContext from '../context/Context';
import APIFetch from '../Utils/API';
import useLocalStorage from '../Utils/useLocalStorage';

const n4 = 4;
const n12 = 12;

function Register() {
  const setUserStorage = useLocalStorage('user')[1];
  const [user, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formValid, setFormValid] = useState(false);
  const { isMessageHidden, setMessageHidden } = useContext(AppContext);
  const navigate = useNavigate();

  const isFormValid = () => user.length >= n12
    && email.includes('@')
    && email.includes('.')
    && password.length > n4;

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
  };

  const addName = (event) => {
    setName(event.target.value);
    setFormValid(isFormValid());
  };

  const addEmail = (event) => {
    setEmail(event.target.value);
    setFormValid(isFormValid());
  };

  const addPassword = (event) => {
    setPassword(event.target.value);
    setFormValid(isFormValid());
  };

  const handleRegister = useCallback(
    async (username, mail, pass) => {
      try {
        const response = await APIFetch('post', 'register', {
          name: username,
          email: mail,
          password: pass,
          role: 'customer',
        });
        setUserStorage(response.data);
      } catch (err) {
        setMessageHidden(false);
        throw new Error();
      }
    },
    [setMessageHidden, setUserStorage],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      user.length < n12
      || !email.includes('@')
      || !email.includes('.')
      || password.length <= n4
    ) {
      resetForm();
      setError('Dados inválidos');
    } else {
      resetForm();
      try {
        await handleRegister(user, email, password);
        navigate('/customer/products');
        setMessageHidden(true);
      } catch (err) {
        setError('Email já cadastrado');
      }
    }
  };
  const routeChange = () => {
    navigate('/login');
  };
  return (
    <main className="login">
      <h1 style={ { marginTop: '50px' } }> Register</h1>
      <form onSubmit={ handleSubmit } className="form formRegister">
        <section className="boxregister">
          <label htmlFor="common_register__input-name">
            Nome
            <input
              type="text"
              data-testid="common_register__input-name"
              value={ user }
              onChange={ addName }
            />
          </label>

          <label htmlFor="common_register__input-email">
            Email
            <input
              type="email"
              data-testid="common_register__input-email"
              value={ email }
              onChange={ addEmail }
            />
          </label>

          <label htmlFor="common_register__input-password">
            Senha:
            <input
              type="password"
              data-testid="common_register__input-password"
              value={ password }
              onChange={ addPassword }
            />
          </label>
        </section>
        <button
          type="submit"
          data-testid="common_register__button-register"
          disabled={ !formValid }
          onClick={ handleSubmit }
          className="button buttonregistertwo"
        >
          Cadastrar
        </button>

        <div
          data-testid="common_register__element-invalid_register"
          style={ { display: !isMessageHidden ? 'block' : 'none' } }
        >
          {error}
        </div>

        <button
          type="button"
          onClick={ routeChange }
          className="button-register"
        >
          <BsArrowLeftShort />
          Sign in
        </button>
      </form>
    </main>
  );
}

export default Register;
