//FUNCTION COUNTRY CHANGE
function handleCountryChange(lat, lng) {
  $.ajax({
    url: `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=f3d378ee02e1426d89edc3bae843d163`,
    method: "GET",
  }).then(function (response) {
    var countryCode =
      response.results[0].components["ISO_3166-1_alpha-2"];
    renderTopCharts(countryCode);
  });
  //YOUTUBE TOP CHARTS FUNCTION
  function renderTopCharts(countryCode) {
    $("iframe").css("display", "block");
    $("#map").css("height", "50%");
    $.ajax({
      url: `https://www.googleapis.com/youtube/v3/videos/?part=snippet&chart=mostPopular&regionCode=${countryCode}&key=AIzaSyCCEa_pI9HJijLBIAoVxtRplDO1DM0MrQk`,
      method: "GET",
    }).then(function (response) {
      $("#videoList").empty();
      for (var i = 0; i < response.items.length; i++) {
        var newDiv = $("<div>");
        newDiv.html(`
        <div class=videoListItem videoId=${response.items[i].id} videoDescription=${response.items[i].snippet.description}>
          <div>${response.items[i].snippet.title}</div>
          <img src=${response.items[i].snippet.thumbnails.default.url} />
        </div>
      `);
        $('#videoList').append(newDiv);
      };
      $('.videoListItem').click(function () {
        var selectedVideoId = $(this).attr('videoId');
        var selectedVideoDescription = $(this).attr('videoDescription');
        $('iframe').attr('src', `https://www.youtube.com/embed/${selectedVideoId}`);
        $("#videoDescription").text(selectedVideoDescription);
      });
    })
  };
};
//INIT MAP FUNCTION
function initMap() {
  //Sets initial coord
  var myLatlng = { lat: 0, lng: 0 };
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 3,
    center: myLatlng,
  });
  var marker = new google.maps.Marker({
    position: myLatlng,
    map: map,
  });
  map.addListener("click", function (event) {
    // event.latLng = {lat: 0, lng: 0}
    marker.setPosition(event.latLng);
    handleCountryChange(event.latLng.lat(), event.latLng.lng());
  });
}