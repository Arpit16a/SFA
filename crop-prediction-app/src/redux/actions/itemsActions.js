import axios from 'axios';

export const getItems = () => async (dispatch) => {
  try {
    dispatch({ type: 'GET_ITEMS_REQUEST' });
    const { data } = await axios.get('/api/requests');
    dispatch({ type: 'GET_ITEMS_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'GET_ITEMS_FAIL' });
  }
};

export const addItem = (item) => async (dispatch) => {
  try {
    await axios.post('/api/requests', item);
    dispatch(getItems());
  } catch (error) {
    console.error(error);
  }
};

export const updateItem = (id, item) => async (dispatch) => {
  try {
    await axios.put(`/api/requests/${id}`, item);
    dispatch(getItems());
  } catch (error) {
    console.error(error);
  }
};

export const deleteItem = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/requests/${id}`);
    dispatch(getItems());
  } catch (error) {
    console.error(error);
  }
};