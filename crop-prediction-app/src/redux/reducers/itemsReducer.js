const initialState = {
    items: [],
    loading: false,
  };
  
  const itemsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'GET_ITEMS_REQUEST':
        return { ...state, loading: true };
      case 'GET_ITEMS_SUCCESS':
        return { ...state, loading: false, items: action.payload };
      case 'GET_ITEMS_FAIL':
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default itemsReducer;