import {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';

import PropTypes from 'prop-types';
import AppContext from './Context';
import APIFetch from '../Utils/API';

function Provider({ children }) {
  const [email, setEmailText] = useState(''); // R2, 36 e 37
  const [password, setPasswordText] = useState(''); // R2, 36 e 37
  const [fullname, setFullnameText] = useState(''); // R36 e 37
  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const [isMessageHidden, setMessageHidden] = useState(true);
  const [roleSelected, setRoleSelection] = useState('seller'); // R36 e 37
  const [sumTotal, setSumTotal] = useState(0);

  const resetForm = () => {
    setFullnameText('');
    setEmailText('');
    setPasswordText('');
    setRoleSelection('seller');
    setMessageHidden(true);
  };

  // Requisitos product
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState([]);

  const altQuantidade = useCallback((altProd) => {
    const getId = cart.some(({ id }) => altProd.id === id);
    if (!getId && altProd.counter > 0) return setCart([...cart, altProd]);
    const additionProduct = cart.filter(({ id }) => id !== altProd.id);
    if (altProd.counter === 0) return setCart([...additionProduct]);
    return setCart([...additionProduct, altProd]);
    // const updatedCart = altProd.quantity === 0
    //   ? cart.filter((filterProd) => filterProd.id !== altProd.id)
    //   : cart.map((prod) => {
    //     if (prod.id === altProd.id) {
    //       prod.quantity = altProd.quantity;
    //     }
    //     return prod;
    //   });
    // setCart(updatedCart);
  }, [cart]);

  const totalValues = useCallback(() => {
    const totalValue = cart.reduce((acc, cur) => {
      const price = Number(cur.price);
      const value = cur.quantity * price;
      return acc + value;
    }, 0);
    console.log('total', totalValue);
    return totalValue.toFixed(2);
  }, [cart]);

  useEffect(() => {
    setSumTotal(totalValues());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  // Fim requisitos products

  const getAPI = async (method, endpoint, payload) => {
    try {
      const response = await APIFetch(method, endpoint, payload);
      return response;
    } catch (err) {
      throw new Error();
    }
  };

  const addEmail = (event) => {
    setEmailText(event.target.value);
  };

  const addPassword = (event) => {
    setPasswordText(event.target.value);
  };

  const handleInput = ({ target: { value } }, func) => {
    func(value); // R2, 36 e 37
  };

  const handleButtonClick = useCallback((event) => {
    event.preventDefault(); // R2, 36
    resetForm();
  }, []);

  const hideErrorMessage = async () => { // R2
    const response = await fetch('/login');
    const notFoundHttpStatus = 404;

    if (response.ok) return false;
    if (response.status === notFoundHttpStatus) return true;
  };

  const context = useMemo(() => ({
    order,
    setOrder,
    totalValues,
    email,
    setEmailText,
    addEmail,
    handleInput,
    isButtonDisabled,
    setButtonDisabled,
    password,
    setPasswordText,
    addPassword,
    isMessageHidden,
    setMessageHidden,
    fullname,
    setFullnameText,
    hideErrorMessage,
    getAPI,
    roleSelected,
    setRoleSelection,
    resetForm,
    handleButtonClick,
    sumTotal,
    setSumTotal,
    altQuantidade,
  }), [
    order,
    email,
    isButtonDisabled,
    setButtonDisabled,
    setEmailText,
    password,
    setPasswordText,
    fullname,
    isMessageHidden,
    roleSelected,
    setRoleSelection,
    handleButtonClick,
    sumTotal,
    setSumTotal,
    totalValues,
    altQuantidade,
  ]);

  // children são os elementos/o <App>
  return (
    <AppContext.Provider value={ context }>
      {children}
    </AppContext.Provider>
  );
}

Provider.propTypes = {
  children: PropTypes.shape(),
}.isRequired;

export default Provider;

/*
A função handleRegister foi movida para Register pois, estava dando conflito,
la ela entrou sem problemas
*/
