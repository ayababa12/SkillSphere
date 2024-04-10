export function saveUserToken(userToken) { 
    localStorage.setItem("TOKEN", userToken); 
  } 
  export function getUserToken() { 
    return localStorage.getItem("TOKEN"); 
  } 
  export function clearUserToken() { 
    return localStorage.removeItem("TOKEN"); 
  } 

  export function saveIsManager(isManager) { 
    return localStorage.setItem("isManager", isManager); 
  } 

  export function getIsManager() { 
    return localStorage.getItem("isManager"); 
  } 
  export function saveUserName(userName){
    return localStorage.setItem("userName", userName);
  }
  export function getUserName() {
    return localStorage.getItem("userName");
  }