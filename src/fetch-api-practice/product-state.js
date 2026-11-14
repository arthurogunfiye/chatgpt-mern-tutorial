export const initialState = {
  products: [],

  filters: {
    searchTerm: '',
    category: 'all',
    inStockOnly: false,
    onSaleOnly: false,
    sortBy: 'default'
  },

  status: {
    isLoading: false,
    error: null
  }
};

export function productReducer(state, action) {
  switch (action.type) {
    case 'SET_FILTER': {
      const { key, value } = action.payload;
      return {
        ...state,
        filters: {
          ...state.filters,
          [key]: value
        }
      };
    }
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: {
          ...initialState.filters
        }
      };
    case 'LOAD_START':
      return {
        ...state,
        status: {
          isLoading: true,
          error: null
        }
      };
    case 'LOAD_SUCCESS':
      return {
        ...state,
        products: action.payload,
        status: {
          isLoading: false,
          error: null
        }
      };
    case 'LOAD_FAILURE':
      return {
        ...state,
        status: {
          isLoading: false,
          error: action.payload
        }
      };
    default:
      return state;
  }
}
