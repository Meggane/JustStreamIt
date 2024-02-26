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
            if (categoryFilmImg.length < 7) {
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

/*
    Adding movies from next page.

    We check if there are less than 7 movies added. If this is the case we add the necessary number to reach 7 
    with the url of the following page.
*/
function filmRecoveryNextPage(url, categoryFilmId) {
    let categoryFilmNextPage = document.getElementById(categoryFilmId);
    let categoryFilmImgNextPage = categoryFilmNextPage.getElementsByTagName("img");
    if (categoryFilmImgNextPage.length < 6) {
        sendRequest(url, function (error, requestResponse) {
        filmRecovery(error, requestResponse, categoryFilmId);
        });
    };
};

/*
    We add the best rated movie. We create the different elements we need for the presentation: a div including 
    each element, the image of the film, a button to launch the film and the title of the film.
*/
sendRequest("http://localhost:8000/api/v1/titles/?actor=&actor_contains=&company=&company_contains=&country=" +
            "&country_contains=&director=&director_contains=&genre=&genre_contains=&imdb_score=&imdb_score_max=" +
            "&imdb_score_min=&lang=&lang_contains=&max_year=&min_year=&rating=&rating_contains=&sort_by=" +
            "-imdb_score&title=&title_contains=&writer=&writer_contains=&year=", function (error, requestResponse) {
            if (error) {
                console.error(error);
            } else {
                let divBestFilm = document.createElement("div");
                let imgDivBestFilm = document.createElement("img");
                let buttonBestFilm = document.createElement("button");
                let titleBestFilm = document.createElement("h2");
                divBestFilm.setAttribute("id", "best_film__title_and_button");
                buttonBestFilm.setAttribute("id", "best_film__play_button");
                buttonBestFilm.textContent = "Play";
                titleBestFilm.textContent = requestResponse.results[0].title;
                imgDivBestFilm.setAttribute("id", "best_film__image");
                imgDivBestFilm.src = requestResponse.results[0].image_url;
                divBestFilm.appendChild(titleBestFilm);
                divBestFilm.appendChild(buttonBestFilm);
                document.getElementById("best_film").append(divBestFilm);
                document.getElementById("best_film").append(imgDivBestFilm);
            };
});

/*
    We add films from the category "top rated films".
*/
sendRequest("http://localhost:8000/api/v1/titles/?actor=&actor_contains=&company=&company_contains=&country=" +
            "&country_contains=&director=&director_contains=&genre=&genre_contains=&imdb_score=&imdb_score_max=" +
            "&imdb_score_min=&lang=&lang_contains=&max_year=&min_year=&rating=&rating_contains=&sort_by=" +
            "-imdb_score&title=&title_contains=&writer=&writer_contains=&year=", function (error, requestResponse) {
            filmRecovery(error, requestResponse, "category__elements--better_grades");
            filmRecoveryNextPage("http://localhost:8000/api/v1/titles/?actor=&actor_contains=&company=" +
                                 "&company_contains=&country=&country_contains=&director=&director_contains=" +
                                 "&genre=&genre_contains=&imdb_score=&imdb_score_max=&imdb_score_min=&lang=" +
                                 "&lang_contains=&max_year=&min_year=&page=2&rating=&rating_contains=&sort_by=" +
                                 "-imdb_score&title=&title_contains=&writer=&writer_contains=&year=", 
                                 "category__elements--better_grades");
});

/*
    We are adding films from the "latest releases" category.
*/
sendRequest("http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=" +
            "&imdb_score_max=&title=&title_contains=&genre=&genre_contains=&sort_by=-year&director=" +
            "&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=" +
            "&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=", 
            function (error, requestResponse) {
            filmRecovery(error, requestResponse, "category__elements--latest_releases");
            filmRecoveryNextPage("http://localhost:8000/api/v1/titles/?actor=&actor_contains=&company=" +
                                 "&company_contains=&country=&country_contains=&director=&director_contains=" +
                                 "&genre=&genre_contains=&imdb_score=&imdb_score_max=&imdb_score_min=&lang=" +
                                 "&lang_contains=&max_year=&min_year=&page=2&rating=&rating_contains=" +
                                 "&sort_by=-year&title=&title_contains=&writer=&writer_contains=&year=", 
                                 "category__elements--latest_releases");
});

/*
    We add films from the category "dramatic films".
*/
sendRequest("http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=" +
            "&imdb_score_max=&title=&title_contains=&genre=drama&genre_contains=&sort_by=&director=" +
            "&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=" +
            "&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=", 
            function (error, requestResponse) {
            filmRecovery(error, requestResponse, "category__elements--dramatic_films");
            filmRecoveryNextPage("http://localhost:8000/api/v1/titles/?actor=&actor_contains=&company=" +
                                 "&company_contains=&country=&country_contains=&director=&director_contains=" +
                                 "&genre=drama&genre_contains=&imdb_score=&imdb_score_max=&imdb_score_min=&lang=" +
                                 "&lang_contains=&max_year=&min_year=&page=2&rating=&rating_contains=&sort_by=" +
                                 "&title=&title_contains=&writer=&writer_contains=&year=", 
                                 "category__elements--dramatic_films");
});

/*
    We add films from the category "action films".
*/
sendRequest("http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=" +
            "&imdb_score_max=&title=&title_contains=&genre=action&genre_contains=&sort_by=&director=" +
            "&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=" +
            "&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=", 
            function (error, requestResponse) {
            filmRecovery(error, requestResponse, "category__elements--action_films");
            filmRecoveryNextPage("http://localhost:8000/api/v1/titles/?actor=&actor_contains=&company=" +
                                 "&company_contains=&country=&country_contains=&director=&director_contains=" +
                                 "&genre=action&genre_contains=&imdb_score=&imdb_score_max=&imdb_score_min=&lang=" +
                                 "&lang_contains=&max_year=&min_year=&page=2&rating=&rating_contains=&sort_by=" +
                                 "&title=&title_contains=&writer=&writer_contains=&year=", 
                                 "category__elements--action_films");
});
