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
    };
    xhr.open("GET", url, true);
    xhr.send();
};

/*
    Adding movies.

    In case of error, a message is displayed.
    Otherwise, we create the html tags we need to add the movies: div and img. The div tag includes the img tag.
    These tags allow the desired display in the web page.
    Check if a movie image is missing. If it is, a default image is displayed instead of the missing image.
*/
function filmRecovery(error, requestResponse, categoryFilmId, firstFilmIndex) {
    if (error) {
        console.error(error);
    } else {
        let categoryFilm = document.getElementById(categoryFilmId);
        let categoryFilmImg = categoryFilm.getElementsByTagName("img");
        for (let filmNumber = firstFilmIndex; filmNumber < requestResponse.results.length; filmNumber++) {
            if (categoryFilmImg.length < 7) {
                (function(currentFilmIndex) {
                    let categoryElementsFilmsDiv = document.createElement("div");
                    let categoryElementsFilmsImg = document.createElement("img");
                    let filmInfosButton = document.createElement("button");
                    categoryElementsFilmsDiv.setAttribute("class", "category__elements--films");
                    categoryElementsFilmsImg.setAttribute("id", "category__elements--films" + requestResponse.results[filmNumber].id);
                    categoryElementsFilmsImg.onerror = function() {
                        categoryFilmImg[currentFilmIndex].src = "images/image_not_found.jpg";
                        categoryFilmImg[currentFilmIndex].setAttribute("id", "category__elements--films" + requestResponse.results[filmNumber].id);
                        categoryFilmImg[currentFilmIndex].setAttribute("class", "image_error");
                    };
                    categoryElementsFilmsImg.src = requestResponse.results[filmNumber].image_url;
                    filmInfosButton.setAttribute("id", "film_infos_button" + requestResponse.results[filmNumber].id);
                    filmInfosButton.setAttribute("class", "category__elements--films__infos_button");
                    filmInfosButton.textContent = "+ d'infos";
                    categoryElementsFilmsDiv.appendChild(categoryElementsFilmsImg);
                    categoryElementsFilmsDiv.appendChild(filmInfosButton);
                    document.getElementById(categoryFilmId).append(categoryElementsFilmsDiv);
                })(filmNumber);
            };
        };
    };
};

/*
    Adding movies from next page if the requested number is not reached.
*/
function filmRecoveryNextPage(url, categoryFilmId) {
    sendRequest(url, function (error, requestResponse) {
        filmRecovery(error, requestResponse, categoryFilmId, 0);
    });
};

/*
    Scroll through the movies in each category.

    Use the click of the left and right arrows to create the scroll.
*/
function scrollFilms() {
    document.addEventListener("DOMContentLoaded", function () {
        const betterGradesFilmCategory = document.getElementById("category__elements--better_grades");
        const frenchFilmsCategory = document.getElementById("category__elements--french_films");
        const dramaticFilmsCategory = document.getElementById("category__elements--dramatic_films");
        const actionFilmsCategory = document.getElementById("category__elements--action_films");
        const categoryContainers = [
            betterGradesFilmCategory,
            frenchFilmsCategory,
            dramaticFilmsCategory,
            actionFilmsCategory,
        ];
        const scrollLeft = (container) => {
            container.scrollBy({
                left: -200,
                behavior: "smooth",
            });
        };
        const scrollRight = (container) => {
            container.scrollBy({
                left: 200,
                behavior: "smooth",
            });
        };
        document.querySelectorAll(".category__elements--left_arrow").forEach((button, index) => {
            button.addEventListener("click", () => {
                scrollLeft(categoryContainers[index]);
            });
        });
        document.querySelectorAll(".category__elements--right_arrow").forEach((button, index) => {
            button.addEventListener("click", () => {
                scrollRight(categoryContainers[index]);
            });
        });
    });
};

/*
    We check if an image is missing and we replace it in the modal.
*/
function modalImageError(filmImage) {
    filmImage.onerror = function() {
        filmImage.src = "images/image_not_found.jpg";
        filmImage.setAttribute("class", "image_error_modal");
    };
};

/*
    Creation of the modal with all the information about each film.

    The modal is hidden by default. It appears at the click of the "+ d'infos" button. We get the id of the 
    selected movie to get its information.
*/
function modalCreation(filmClassNameWithItsId) {
    let modal = document.getElementById("modal");
    closeModal();
    if (filmClassNameWithItsId !== null) {
        let filmIdRetrieval = filmClassNameWithItsId.match(/\d+/g);
        if (filmIdRetrieval !== null) {
            let filmId = parseFloat(filmIdRetrieval.join(""));
            let filmUrl = "http://localhost:8000/api/v1/titles/" + filmId;
            sendRequest(filmUrl, function (error, requestResponse) {
                if (error) {
                    console.error(error);
                } else {
                    modal.style.display = "block";
                    let filmImage = document.getElementById("modal__image");
                    let filmTitle = document.getElementById("modal__title");
                    let filmGenre = document.getElementById("modal__genre");
                    let filmReleaseDate = document.getElementById("modal__date_published");
                    let filmRated = document.getElementById("modal__rated");
                    let filmImdbScore = document.getElementById("modal__imdb_score");
                    let filmDirector = document.getElementById("modal__directors");
                    let filmActors = document.getElementById("modal__actors");
                    let filmDuration = document.getElementById("modal__duration");
                    let filmOriginCountry = document.getElementById("modal__origin_country");
                    let filmSynopsis = document.getElementById("modal__synopsis");
                    filmImage.src = requestResponse.image_url;
                    modalImageError(filmImage);
                    filmTitle.textContent = "Titre: " + requestResponse.title;
                    filmGenre.textContent = "Genre: " + requestResponse.genres.join(", ");
                    filmReleaseDate.textContent = "Date de sortie: " + requestResponse.date_published;
                    filmRated.textContent = "Rated: " + requestResponse.rated;
                    filmImdbScore.textContent = "Score Imdb: " + requestResponse.imdb_score;
                    filmDirector.textContent = "Réalisateur(s): " + requestResponse.directors.join(", ");
                    filmActors.textContent = "Acteurs: " + requestResponse.actors.join(", ");
                    filmDuration.textContent = "Durée: " + requestResponse.duration + " minutes";
                    filmOriginCountry.textContent = "Pays d'origine: " + requestResponse.countries;
                    filmSynopsis.textContent = "Résumé: " + requestResponse.long_description;
                };
            });
        };
    } else {
        console.log("Aucun film trouvé.");
    };
};

/*
    Closure of the modal. The modal closes when the cross is clicked.
*/
function closeModal() {
    let modal = document.getElementById("modal");
    let modalClosure = document.getElementById("modal__closure");
    modalClosure.addEventListener("click", function() {
        modal.style.display = "none";
    });
};

/*
    Recovery of the id of the movie clicked to create the dedicated modal.
*/
function clickedFilm(event) {
    let clickedFilmId = event.target.id;
    modalCreation(clickedFilmId);
};

/*
    We add the best rated movie.

    We get the movie information we need and add the "+ d'infos" button that allows us to get all the information 
    about the movie. For this, we get the url of the dedicated movie.
*/
sendRequest("http://localhost:8000/api/v1/titles/?actor=&actor_contains=&company=&company_contains=&country=" +
            "&country_contains=&director=&director_contains=&genre=&genre_contains=&imdb_score=&imdb_score_max=" +
            "&imdb_score_min=&lang=&lang_contains=&max_year=&min_year=&rating=&rating_contains=&sort_by=" +
            "-imdb_score&title=&title_contains=&writer=&writer_contains=&year=", function (error, requestResponse) {
            if (error) {
                console.error(error);
            } else {
                let imgDivBestFilm = document.getElementById("best_film__image");
                let titleBestFilm = document.getElementById("best_film__title");
                let infosButtonBestFilm = document.getElementById("best_film__infos_button");
                let synopsisBestFilm = document.getElementById("best_film__synopsis");
                titleBestFilm.textContent = requestResponse.results[0].title;
                imgDivBestFilm.src = requestResponse.results[0].image_url;
                infosButtonBestFilm.setAttribute("id", "film_infos_button" + requestResponse.results[0].id);
                infosButtonBestFilm.addEventListener("click", clickedFilm);
                urlBestFilm = "http://localhost:8000/api/v1/titles/" + requestResponse.results[0].id;
                sendRequest(urlBestFilm, function(error, requestResponse) {
                    if (error) {
                        console.log(error);
                    } else {
                        synopsisBestFilm.textContent = requestResponse.long_description;
                    };
                });
            };
});

/*
    We add films from the category "top rated films".

    We start from the second best rated film because the first is already in the headline.
*/
sendRequest("http://localhost:8000/api/v1/titles/?actor=&actor_contains=&company=&company_contains=&country=" +
            "&country_contains=&director=&director_contains=&genre=&genre_contains=&imdb_score=&imdb_score_max=" +
            "&imdb_score_min=&lang=&lang_contains=&max_year=&min_year=&rating=&rating_contains=&sort_by=" +
            "-imdb_score&title=&title_contains=&writer=&writer_contains=&year=", function (error, requestResponse) {
            filmRecovery(error, requestResponse, "category__elements--better_grades", 1);
            filmRecoveryNextPage("http://localhost:8000/api/v1/titles/?actor=&actor_contains=&company=" +
                                 "&company_contains=&country=&country_contains=&director=&director_contains=" +
                                 "&genre=&genre_contains=&imdb_score=&imdb_score_max=&imdb_score_min=&lang=" +
                                 "&lang_contains=&max_year=&min_year=&page=2&rating=&rating_contains=&sort_by=" +
                                 "-imdb_score&title=&title_contains=&writer=&writer_contains=&year=", 
                                 "category__elements--better_grades");
});

/*
    We are adding films from the "french films" category.
*/
sendRequest("http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=" +
            "&imdb_score_max=&title=&title_contains=&genre=&genre_contains=&sort_by=-imdb_score&director=" +
            "&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=France&country_contains=" +
            "&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=", 
            function (error, requestResponse) {
            filmRecovery(error, requestResponse, "category__elements--french_films", 0);
            filmRecoveryNextPage("http://localhost:8000/api/v1/titles/?actor=&actor_contains=&company=" +
                                 "&company_contains=&country=France&country_contains=&director=&director_contains=" +
                                 "&genre=&genre_contains=&imdb_score=&imdb_score_max=&imdb_score_min=&lang=" +
                                 "&lang_contains=&max_year=&min_year=&page=2&rating=&rating_contains=&sort_by=" +
                                 "-imdb_score&title=&title_contains=&writer=&writer_contains=&year=", 
                                 "category__elements--french_films");
});

/*
    We add films from the category "dramatic films".
*/
sendRequest("http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=" +
            "&imdb_score_max=&title=&title_contains=&genre=drama&genre_contains=&sort_by=-imdb_score&director=" +
            "&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=" +
            "&lang_contains=&company=&company_contains=&rating=&rating_contains=", 
            function (error, requestResponse) {
            filmRecovery(error, requestResponse, "category__elements--dramatic_films", 0);
            filmRecoveryNextPage("http://localhost:8000/api/v1/titles/?actor=&actor_contains=&company=" +
                                 "&company_contains=&country=&country_contains=&director=&director_contains=" +
                                 "&genre=drama&genre_contains=&imdb_score=&imdb_score_max=&imdb_score_min=&lang=" +
                                 "&lang_contains=&max_year=&min_year=&page=2&rating=&rating_contains=&sort_by=" +
                                 "-imdb_score&title=&title_contains=&writer=&writer_contains=&year=", 
                                 "category__elements--dramatic_films");
});

/*
    We add films from the category "action films".
*/
sendRequest("http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=" +
            "&imdb_score_max=&title=&title_contains=&genre=action&genre_contains=&sort_by=-imdb_score&director=" +
            "&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=" +
            "&lang_contains=&company=&company_contains=&rating=&rating_contains=", 
            function (error, requestResponse) {
            filmRecovery(error, requestResponse, "category__elements--action_films", 0);
            filmRecoveryNextPage("http://localhost:8000/api/v1/titles/?actor=&actor_contains=&company=" +
                                 "&company_contains=&country=&country_contains=&director=&director_contains=" +
                                 "&genre=action&genre_contains=&imdb_score=&imdb_score_max=&imdb_score_min=&lang=" +
                                 "&lang_contains=&max_year=&min_year=&page=2&rating=&rating_contains=&sort_by=" +
                                 "-imdb_score&title=&title_contains=&writer=&writer_contains=&year=", 
                                 "category__elements--action_films");
});

/*
    Scroll through the movie lists.
*/
scrollFilms();

/*
    We recover all the movies of the site to get their id when clicking.
*/
let allFilmsOnTheSite = document.querySelectorAll("div");
allFilmsOnTheSite.forEach(function(film) {
    film.addEventListener("click", clickedFilm);
});
