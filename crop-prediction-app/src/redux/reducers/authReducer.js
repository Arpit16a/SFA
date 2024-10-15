export const ADMIN_LOGIN ='ADMIN_LOGIN'
export const FARMER_LOGIN ='FARMER_LOGIN'
export const SUPPLIER_LOGIN ='SUPPLIER_LOGIN'
export const STATE_ADMIN_LOGIN ='STATE_ADMIN_LOGIN'
export const CONSUMER_LOGIN ='CONSUMER_LOGIN'
export const VENDOR_LOGIN ='VENDOR_LOGIN'
export const LOGOUT = 'LOGOUT'

const initialState = {
    adminAuthStatus: false,
    farmerAuthStatus: false,
    supplierAuthStatus: false,
    stateadminAuthStatus:false,
    consumerAuthStatus: false,
    vendorAuthStatus: false,
    userInfo: {}
  };
  
  const authReducer = (state = initialState, action) => {
   switch(action.type){
    case ADMIN_LOGIN:
        return{
            ...state,
            adminAuthStatus: true,
            userInfo: action.payload,

            farmerAuthStatus: false,
            supplierAuthStatus: false,
            stateadminAuthStatus:false,
            consumerAuthStatus: false,
            vendorAuthStatus: false,
        };
        case FARMER_LOGIN:
            return{
                ...state,
                farmerAuthStatus: true,
                userInfo: action.payload,

                adminAuthStatus: false,
                supplierAuthStatus: false,
                stateadminAuthStatus:false,
                consumerAuthStatus: false,
                vendorAuthStatus: false,

            };
        case SUPPLIER_LOGIN:
            return{
                ...state,
                supplierAuthStatus: true,
                userInfo: action.payload,
                adminAuthStatus: false,
                farmerAuthStatus: false,
                stateadminAuthStatus:false,
                consumerAuthStatus: false,
                vendorAuthStatus: false,
            };
        case STATE_ADMIN_LOGIN:
            return{
                ...state,
                stateadminAuthStatus: true,
                userInfo: action.payload,

                adminAuthStatus: false,
                farmerAuthStatus: false,
                supplierAuthStatus: false,
                consumerAuthStatus: false,
                vendorAuthStatus: false,

            };
        case CONSUMER_LOGIN:
            return{
                ...state,
                consumerAuthStatus: true,
                userInfo: action.payload,

                adminAuthStatus: false,
                farmerAuthStatus: false,
                supplierAuthStatus: false,
                stateadminAuthStatus:false,
                vendorAuthStatus: false,

            };
        case VENDOR_LOGIN:
            return{
                ...state,
                vendorAuthStatus: true,
                userInfo: action.payload,

                adminAuthStatus: false,
                farmerAuthStatus: false,
                supplierAuthStatus: false,
                stateadminAuthStatus:false,
                consumerAuthStatus: false,
            };
        case LOGOUT:
            return{
                adminAuthStatus: false,
                farmerAuthStatus: false,
                supplierAuthStatus: false,
                stateadminAuthStatus:false,
                consumerAuthStatus: false,
                vendorAuthStatus: false
            };
        default:
            return state;
   };
   
  };
  
  export default authReducer;