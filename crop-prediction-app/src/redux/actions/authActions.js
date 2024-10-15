import { ADMIN_LOGIN, STATE_ADMIN_LOGIN,    SUPPLIER_LOGIN ,FARMER_LOGIN, CONSUMER_LOGIN, VENDOR_LOGIN, LOGOUT } from "../reducers/authReducer";

export const adminLogin = (userData) => {
    return {
        type: ADMIN_LOGIN,
        payload: userData,
    }
}

export const stateadminLogin = (userData) => {
    return {
        type: STATE_ADMIN_LOGIN,
        payload: userData,
    }
}

export const farmerLogin = (userData) => {
    return {
        type: FARMER_LOGIN,
        payload: userData,
    }
}
export const supplierLogin = (userData) => {
    return {
        type: SUPPLIER_LOGIN,
        payload: userData,
    }
}

export const consumerLogin = (userData) => {
    return {
        type: CONSUMER_LOGIN,
        payload: userData,
    }
}

export const vendorLogin = (userData) => {
    return {
        type: VENDOR_LOGIN,
        payload: userData,
    }
}

export const logout = (userData) => {
    return {
        type: LOGOUT,
    }
}