const cleWeather = "7ee9b5f8b1616f1e273286c2435486db";

const weatherIcons = {
  Rain: "wi wi-day-rain",
  Clouds: "wi wi-day-cloudy",
  Clear: "wi wi-day-sunny",
  Snow: "wi wi-day-snow",
  mist: "wi wi-day-fog",
  Drizzle: "wi wi-day-sleet",
};

let searchCity = document.querySelector("#search-city");

const city = document.querySelector("#city");
const temperature = document.querySelector("#temperature");
const conditions = document.querySelector("#conditions");
const icons = document.querySelectorAll("i.wi");
const icons1 = document.querySelector("i.wi");
const btn = document.querySelector("button");

let conditionsClass = document.querySelectorAll(".conditionsClass");
let hourName = document.querySelectorAll(".hour-name-prev");
let hourValue = document.querySelectorAll(".hour-value-prev");

// Fonction pour retourner la première des mots en majuscule
function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

/* 
** Pour afficher une ville par défaut car api adresse ip bloquée avec les adBlock
city.textContent = "La Roche-Sur-Yon";
main(false);
**
*/

// la fonction main fonctionne avec l'adresse ip par défaut
async function main(withIP = true) {
  let city;

  if (withIP) {
    // Obtenir l'adresse IP du PC qui ouvre la page
    const ip = await fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => data.ip);

    city = await fetch(
      `https://geo.ipify.org/api/v1?apiKey=at_UXDEW2rbL9g88MiLIlzft59rxoCfT&ipAddress=${ip}` // gratuit et https mais imprécis
    )
      .then((res) => res.json())
      .then((data) => data.location.city);
  } else {
    city = document.querySelector("#city").textContent;
  }

  // Weather
  const weather = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${cleWeather}&units=metric&lang=fr`
    //`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude={part}&appid=${cleWeather}`
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        console.log("Saisissez un nom de ville correct");
        throw Error(`Requête rejetée avec le statut ${res.status}`);
      }
    })
    .then((data) => data);

  displayWeatherInfo(weather);
  console.log(weather);
}

function displayWeatherInfo(data) {
  const nameCity = data.city.name;
  const temperatureWeather = data.list[0].main.temp;
  const conditionsWeather = data.list[0].weather[0].main;
  const descriptionWeather = data.list[0].weather[0].description;

  city.textContent = nameCity;
  temperature.textContent = temperatureWeather;
  conditions.textContent = capitalize(descriptionWeather);
  icons.className = weatherIcons[conditionsWeather];
  icons1.className = weatherIcons[conditionsWeather];

  // Boucle for pour afficher les éléments toutes les 3h / 5 jours
  let actualHour = new Date().getHours();

  for (let i = 0; i < hourName.length; i++) {
    let hourIncr = actualHour + i * 3;

    if (hourIncr > 24) {
      hourName[i].textContent = `${hourIncr - 24} h`;
    } else if (hourIncr === 24) {
      hourName[i].textContent = "00 h ";
    } else if (hourIncr < 10) {
      hourName[i].textContent = `0${hourIncr} h`;
    } else {
      hourName[i].textContent = `${hourIncr} h`;
    }
  }

  // Température par tranche de 3h
  for (let j = 0; j < hourValue.length; j++) {
    hourValue[j].textContent = `${Math.trunc(data.list[j].main.temp)}C°`;
  }

  for (let k = 0; k < conditionsClass.length; k++) {
    // Afficher les icônes
    let conditionsWeather5days = data.list[k].weather[0].main;
    icons[k + 1].className = weatherIcons[conditionsWeather5days]; // k + 1 pour résoudre le problème de décalage des icônes

    // Afficher les descriptions
    conditionsClass[k].textContent = `${capitalize(
      data.list[k].weather[0].description
    )}`;
  }
}

// contentEditable => permet d'éditer du contenu HTML
city.addEventListener("click", () => {
  city.contentEditable = true; // pour éditer le h1
});

city.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    e.preventDefault(); // évite d'ajouter une ligne lors de l'appui sur la touche entrée
    city.contentEditable = false;

    main(false); // on ne travaille plus avec l'adresse IP
  }
});

// keycode === 13 (touche entrée)
searchCity.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    e.preventDefault(); // évite d'ajouter une ligne lors de l'appui sur la touche entrée

    main(false); // on ne travaille plus avec l'adresse IP
  }
});

// RECHERCHE AU CLIC DU BOUTON
btn.addEventListener("click", () => {
  // Le h1 "city" reprend les valeurs de l'input
  city.textContent = searchCity.value;

  // Avce l'api google maps, le pays (après une virgule) est affiché, split permet de supprimer ces éléments
  if (searchCity.value.includes(",")) {
    city.textContent = searchCity.value.split(",")[0];
  }

  // Placer main(false) (=> false != utilisation de l'ip) à la fin de cette fonction pour changer le nom avant de lancement de la fonction
  main(false);
});

// INPUT SEARCH
searchCity.addEventListener("input", (e) => {
  city.textContent = e.target.value;
  // city.textContent = searchCity.value;
});

main();

/*if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      let long = position.coords.longitude;
      let lat = position.coords.latitude;
      appelApi(long, lat);
    },
    () => {
      console.log("non activé");
    }
  );
}

function appelApi(long, lat) {
  console.log(long, lat);
}*/
