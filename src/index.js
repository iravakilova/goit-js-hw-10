import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from "lodash.debounce";
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector("#search-box");
const countryList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");

searchBox.addEventListener("input", debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
    event.preventDefault();
    const inputValue = searchBox.value.trim();
    resetResult();
    if (inputValue === '') {
        // resetResult();
        return Notiflix.Notify.info("Field is empty");
    }
    fetchCountries(inputValue)
        .then(country => {
            if (country.length > 10) {
                resetResult();
                Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
            } else if (country.length >= 2 && country.length <= 10) {
                resetResult();
                countryList.innerHTML = listOfCountry(country);
            } else if (country.length === 1) {
                resetResult();
                countryInfo.innerHTML = cardOfCountry(country);
            } 
        })
        .catch(() => {
            Notiflix.Notify.failure("Oops, there is no country with that name.");
        });
}
function resetResult() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}
function listOfCountry(list) {
    resetResult();
    return list
        .map(country => {
            return `<li class="country-info__item">
                        <img src = ${country.flags.svg}>
                        <span class="country-list__name">${country.name.official}</span>
                    </li>`
        })
        .join("");
}
function cardOfCountry(card) {
    resetResult();
    return card.map(country => {
        return `<ul>
                    <li class="country-info__item">
                    <img
                    src = ${country.flags.svg}>
                    <span class="country-info__item country-info__name">${country.name.official}</span>
                    </li>
                    <li class="country-info__item"><b>Capital:  </b>${country.capital}</li>
                    <li class="country-info__item"><b>Population:  </b>${country.population}</li>
                    <li class="country-info__item"><b>Languages:  </b>${Object.values(country.languages)}</li>
                </ul>`;
                })
};


