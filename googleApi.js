// API Google maps Places pour les suggestions de villes
function activatePlacesSearch() {
  var input = document.getElementById("search-city");
  var options = {
    types: ["(cities)"],
    componentRestrictions: {
      country: "fr",
    },
  };
  var autocomplete = new google.maps.places.Autocomplete(input, options);
}
