/*
    Making an ajax request.

    An event management function is performed to process the response. If the request is good, we get the answer 
    otherwise we display an error message.
*/
function sendRequest(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                callback(null, JSON.parse(xhr.responseText));
            } else {
                callback("Erreur de requête: " + xhr.status, null);
            };
        };
    }
    xhr.open("GET", url, true);
    xhr.send();
};

/*
    Adding movies.

    In case of error, a message is displayed.
    Otherwise, we create the html tags we need to add the movies: div and img. The div tag includes the img tag.
    These tags allow the desired display in the web page.
*/
function filmRecovery(error, requestResponse, categoryFilmId) {
    if (error) {
        console.error(error);
    } else {
        let categoryFilm = document.getElementById(categoryFilmId);
        let categoryFilmImg = categoryFilm.getElementsByTagName("img");
        for (let filmNumber = 0; filmNumber < requestResponse.results.length; filmNumber++) {
            if (categoryFilmImg < 7) {
                let categoryElementsFilmsDiv = document.createElement("div");
                let categoryElementsFilmsImg = document.createElement("img");
                categoryElementsFilmsDiv.setAttribute("class", "category__elements-films");
                categoryElementsFilmsImg.src = requestResponse.results[filmNumber].image_url;
                categoryElementsFilmsDiv.appendChild(categoryElementsFilmsImg);
                document.getElementById(categoryFilmId).append(categoryElementsFilmsDiv);
            };
        };
    };
};
