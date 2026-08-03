const CSRFTOKEN = document.cookie.split("; ").find(each=>each.split('=')[0]=='csrftoken').split("=")[1];
export default CSRFTOKEN;