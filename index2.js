let state = {
    breweries: [],
    cities: {},
    filters: {
      byState: "",
      byType: "",
      byCity: ""
    }
};

const mainEl = document.querySelector("main");
const stateInput = document.querySelector("#select-state-form");
var tempValue = "";
var cityListFormEl;

init();

function init() {

    //Apply the input field to stateValue
    stateInput.addEventListener('input', newValue => {
        tempValue = newValue.target.value;
    });

    //execute input using stateValue
    stateInput.addEventListener("submit", function(event) {
        event.preventDefault();

        if(mainEl.innerHTML === "") {
            createMainEl();
        }


        updateStateFilters("byState", "by_state=", tempValue);
        updateStateCities(tempValue);

    });

}

function updateStateFilters(property, parameter, value) {
    value = value.split(' ').join('_');
    state.filters[property] = parameter + value;

    updateApiFromState();
}

function updateStateCities(value) {
    value = value.split(' ').join('_');

    fetch("https://api.openbrewerydb.org/breweries?by_state=" + value)
        .then( res => res.json() )
        .then( data => data.forEach(brewery => state.cities[brewery.city] = false) );

    console.log(state)
    setTimeout(function() {renderCityLi() }, 10)
}

function updateApiFromState() {

    var apiString = "";

    for (const parameter in state.filters) {

        //if a filter isnt empty, add its api parameter to a string
        if (state.filters[parameter]) {
            apiString += state.filters[parameter] + "&";
        }
      }

    fetch("https://api.openbrewerydb.org/breweries?" + apiString) 
        .then( res => res.json() )
        .then( data => state.breweries = data )
        .then( data => renderResults(data) );
};

function createMainEl() {

    console.log("adding to main...");
  
    
    createListSectionEl();
    createFilterSectionEl();
  }
  
function createFilterSectionEl() {
  
    const asideEl = document.createElement("aside");
      const h2El = document.createElement("h2");
      const formEl = document.createElement("form");
        const labelEl = document.createElement("label");
          const h3El = document.createElement("h3");
        const selEl = document.createElement("select");
          const optEl1 = document.createElement("option");
          const optEl2 = document.createElement("option");
          const optEl3 = document.createElement("option");
          const optEl4 = document.createElement("option");
      const divEl = document.createElement("div");
        const h3El2 = document.createElement("h3");
        const butEl = document.createElement("button");
      cityListFormEl = document.createElement("form");
  
    asideEl.classList.add("filters-section");
      h2El.innerText = "Filter By:";
      formEl.setAttribute("id", "filter-by-type-form");
      formEl.setAttribute("autocomplete", "off");
        labelEl.setAttribute("for", "filter-by-type");
          h3El.innerText = "Type of Brewery";
        selEl.setAttribute("name", "filter-by-type");
        selEl.setAttribute("id", "filter-by-type");
          optEl1.setAttribute("value", "");
          optEl2.setAttribute("value", "micro");
          optEl3.setAttribute("value", "regional");
          optEl4.setAttribute("value", "brewpub");
          optEl1.innerText = "Select a type...";
          optEl2.innerText = "Micro";
          optEl3.innerText = "Regional";
          optEl4.innerText = "Brewpub";
      divEl.classList.add("filter-by-city-heading");
        h3El2.innerText = "Cities";
        butEl.classList.add("clear-all-btn");
        butEl.innerText = "clear all";
      cityListFormEl.setAttribute("id", "filter-by-city-form");
  
  
    mainEl.append(asideEl);
    asideEl.append(h2El, formEl, divEl, cityListFormEl);
    formEl.append(labelEl, selEl);
    labelEl.append(h3El);
    selEl.append(optEl1, optEl2, optEl3, optEl4);
    divEl.append(h3El2, butEl);

    console.log("filter section rendered");
  }
  
function createListSectionEl() {
  
    const h1El = document.createElement("h1");
    const headEl = document.createElement("header");
      const formEl = document.createElement("form");
        const labelEl = document.createElement("label");
          const h2El = document.createElement("h2");
        const inputEl = document.createElement("input");
    const artEl = document.createElement("article");
      const ulEl = document.createElement("ul");
  
    h1El.innerText = "List of Breweries"
    headEl.classList.add("search-bar");
      formEl.setAttribute("id", "search-breweries-form");
      formEl.setAttribute("autocomplete", "off");
        labelEl.setAttribute("for", "search-breweries");
          h2El.innerText = "Search breweries:";
        inputEl.setAttribute("id", "search-breweries");
        inputEl.setAttribute("name", "search-breweries");
        inputEl.setAttribute("type", "text");
      ulEl.classList.add("breweries-list");
  
    mainEl.append(h1El, headEl, artEl);
    headEl.append(formEl);
    formEl.append(labelEl, inputEl);
    labelEl.append(h2El);
    artEl.append(ulEl);

    console.log("list section rendered");
  }

function renderResults(data) {
    console.log(data);

    //reset list of breweries and possible cities
    const ulEl = document.querySelector(".breweries-list");
    while (ulEl.firstChild) ulEl.removeChild(ulEl.firstChild);
    state.cities = {};
    while (cityListFormEl.firstChild) cityListFormEl.removeChild(cityListFormEl.firstChild);

    //render the list of breweries
    data.forEach( brewery => renderBreweryLi(brewery) );
}

function renderBreweryLi(brewery) {

    const ulEl = document.querySelector(".breweries-list");
        const liEl = document.createElement("li");
        const h2El = document.createElement("h2");
        const typeEl = document.createElement("div");
        const addEl = document.createElement("section");
            const h3El = document.createElement("h3");
            const stEl = document.createElement("p");
            const postEl = document.createElement("p");
        const phoneEl = document.createElement("section");
            const h3El2 = document.createElement("h3");
            const pNoEl = document.createElement("p");
        const linkEl = document.createElement("section");
            const aEl = document.createElement("a");
  
  
    h2El.innerText = brewery.name;
    typeEl.classList.add("type");
    typeEl.innerText = brewery.brewery_type;
    addEl.classList.add("address");
    h3El.innerText = "Address:";
    stEl.innerText = brewery.street;
    postEl.innerHTML = "<strong>" + brewery.city + ", " + brewery.postal_code + "</strong>";
    h3El2.innerText = "Phone:"
    phoneEl.classList.add("phone");
    linkEl.classList.add("link");
    aEl.setAttribute("href", brewery.website_url);
    aEl.setAttribute("target", "_blank");
    aEl.innerText = "Visit Website";
  
    if (brewery.phone) {
      pNoEl.innerText = brewery.phone;
    } else {
      pNoEl.innerText = "N/A";
    }
  
    ulEl.append(liEl);
    liEl.append(h2El, typeEl, addEl, phoneEl, linkEl);
    addEl.append(h3El, stEl, postEl);
    phoneEl.append(h3El2, pNoEl);
    linkEl.append(aEl);
}

function renderCityLi() {

    for (const city in state.cities) {
        const inpEl = document.createElement("input");
        const labEl = document.createElement("label");

        inpEl.setAttribute("type", "checkbox");
        inpEl.setAttribute("name", city);
        inpEl.setAttribute("value", city);
        labEl.setAttribute("for", city);
        labEl.innerText = city;

        cityListFormEl.append(inpEl, labEl);

        inpEl.addEventListener('click', () => {
            console.log("clicked " + city.toLowerCase() )
        })
    }
}