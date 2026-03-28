const BASE_URL = 'https://fashionframe.in/vendor-hub';
export const IMAGE_BASE_URL = "https://fashionframe.in";
export const IMAGE_BANNER_URL = "https://fashionframe.in/";

// local ip
// const BASE_URL = 'http://127.0.0.1:8000/vendor-hub';
// export const IMAGE_BASE_URL = "http://127.0.0.1:8000/";
// export const IMAGE_BANNER_URL = "http://127.0.0.1:8000/";

export const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/user/login/`,
  REGISTRATION: `${BASE_URL}/user/registration/`,
  PRODUCTS: `${BASE_URL}/user/products/`,
  RANDOM_PRODUCTS: `${BASE_URL}/user/random-products/`,
  PRODUCTSBYPAGE: `${BASE_URL}/user/products/page/`,
  WISHLISTPRODUCTS: `${BASE_URL}/user/wishlist-products/`,
  USER_PROFILE: `${BASE_URL}/user/user-profile/`,
  GET_BANNER: `${BASE_URL}/user/getBanner/`,
  GET_STATES: `${BASE_URL}/user/get-states/`,
  GET_CITY: `${BASE_URL}/user/get-city`,
  CATEGORY: `${BASE_URL}/user/category/`,
  SUBCATEGORY: `${BASE_URL}/user/subcategory/`,
  CREATE_USER_ADDRESS: `${BASE_URL}/user/createUserAddress/`,
  GET_USER_ADDRESS: `${BASE_URL}/user/getUserAddress/`,
  CREATE_USER_ORDER: `${BASE_URL}/user/create-user-order/`,
  GET_USER_ORDER: `${BASE_URL}/user/get-user-order/`,
  GET_USER_ORDER_PAGINATION: `${BASE_URL}/user/get-user-order-pagination/`,
  GET_CATEGORY_SUBCATEGORY: `${BASE_URL}/user/category-subcategory/`,
  CREATE_ORDER_RZP: `${BASE_URL}/user/create-order-pay/`, 
  VERIFY_ORDER_RZP: `${BASE_URL}/user/verify-payment/`,
  GET_PAGES: `${BASE_URL}/user/getPages/`,
  WISHLISTTOGGLE: `${BASE_URL}/user/wishlist/`,
  TRACKBYAWB: `${BASE_URL}/user/track-shipment/`,
  INVOICEDOWNLOAD: `${BASE_URL}/order/`,
  UPDATE_USER_PROFILE: `${BASE_URL}/user/update-profile/`,
  UPLOAD_PROFILE_IMAGE: `${BASE_URL}/user/upload-profile-image/`,
  SUBMIT_PRODUCT_REVIEW: `${BASE_URL}/user/submit-product-review/`,
  GET_PRODUCT_REVIEWS: `${BASE_URL}/user/get-product-reviews/`,
  FORGOT_PASSWORD_SEND: `${BASE_URL}/auth/user/forgot-password/send/`,
};

export default API_ENDPOINTS;