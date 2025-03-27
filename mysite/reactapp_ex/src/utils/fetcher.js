
export async function getFetcher(url){
    let response = {ok:false}
    try{
    const response = await fetch(url);
        const data = await response.json();
        return {"success":response.ok,...data}
    } catch (e){
        console.log(e)
        return {"success":response?.ok||false,message:"Connection failed"}
    }
    
}

export async function postFetcher(url,body) {
    let response = {ok:false}
    try{
    const response = await fetch(url,{
        method:"POST",
        headers:{"X-CSRFToken":cookieCutter("csrftoken")},
        body:JSON.stringify(body)});
    
        const data = await response.json()
        return {"success":response.ok,...data}
    } catch (e){
        console.log(e)
        return {"success":response?.ok||false,message:"Connection failed"}
    }
}


function cookieCutter(cookieName){
    const cookies = document.cookie.split(";");
    const findCookie = cookies.find(each=>each.includes(cookieName));
    return findCookie?decodeURIComponent(findCookie.split("=")[1]):"";
}