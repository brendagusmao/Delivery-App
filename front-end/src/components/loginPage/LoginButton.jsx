import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import AppContext from '../../context/Context';
import useLocalStorage from '../../Utils/useLocalStorage';

export default function LoginButton() {
  const { getAPI, email, password, setMessageHidden, resetForm } = useContext(AppContext);
  const navigate = useNavigate();
  const [userStorage, setUserStorage] = useLocalStorage('user');

  const emailValid = /\S+@\S+\.\S+/.test(email);
  const minNumber = 6;
  const customerDefaultPath = 'customer/products';
  const sellerDefaultPath = 'seller/orders';
  const adminDefaultPath = 'admin/manage';

  useEffect(() => {
    const setLoginStorage = userStorage || {};
    if (setLoginStorage.role === 'customer') {
      navigate(`/${customerDefaultPath}`);
    }
    if (setLoginStorage.role === 'seller') {
      navigate(`/${sellerDefaultPath}`);
    }
    if (setLoginStorage.role === 'administrador') {
      navigate(`/${adminDefaultPath}`);
    }
  }, [navigate]);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    resetForm();

    const payload = {
      email,
      password,
    };

    try {
      const response = await getAPI('post', 'login', payload);
      setUserStorage(response.data);
      if (response.data.role === 'customer') {
        navigate('/customer/products');
      }
      if (response.data.role === 'seller') {
        navigate('/seller/orders');
      }
      if (response.data.role === 'administrator') {
        navigate('/admin/manage');
      }
    } catch (error) {
      setMessageHidden(false);
      throw new Error();
    }
  };

  useEffect(() => {
    const setLoginStorage = JSON.parse(localStorage.getItem('user')) || {};
    if (setLoginStorage.role === 'customer') {
      navigate('/customer/products');
    }
    if (setLoginStorage.role === 'seller') {
      navigate('/seller/orders');
    }
    if (setLoginStorage.role === 'administrador') {
      navigate('/admin/manage');
    }
  }, [navigate]);

  return (
    <button
      data-testid="common_login__button-login"
      type="submit"
      id="button-login"
      disabled={ !(password.length >= minNumber && emailValid) }
      onClick={ handleLoginSubmit }
      className="button"
    >
      Login
    </button>
  );
}
