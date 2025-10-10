export default function lowerCaseNoAccent(text){
    return text.toLowerCase().replace("á","a").replace("é","e").replace("í","i").replace("ó",'o').replace("ú","u");
};