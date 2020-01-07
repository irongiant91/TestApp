(function (window) {

  NOVA.geofenceListGet = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/geofence/list/get',
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
      .done(function (d, textStatus, jqXHR) {
        var locations = []
        for (let i = 0; i < d.data.length; i++) {
          locations.push(d.data[i]);
        }
            var infowindow;

          infowindow =  new google.maps.InfoWindow({
              content: ''
            });

          var mapCenter = new google.maps.LatLng(locations[0].lat, locations[0].lng);
          var map = new google.maps.Map(document.getElementById('map'), {
              'zoom': 18,
              'center': mapCenter,
              'mapTypeId': google.maps.MapTypeId.ROADMAP
          });


           var bindInfoWindow = function(marker, map, infowindow, html, title) {
            google.maps.event.addListener(marker, 'mouseover', function() {
              infowindow.setContent(html); 
              infowindow.open(map, marker);
            });
            google.maps.event.addListener(marker, 'mouseout', function() {
              infowindow.close();
            }); 
          }


          var bounds = new google.maps.LatLngBounds();

          for (var i = 0; i < locations.length; i++) {
            var geofence = locations[i];
            var myLatLng = new google.maps.LatLng(geofence.lat, geofence.lng);
            var marker = new google.maps.Marker({
              position: myLatLng,
              map: map
            });

            // Create marker 
            var marker = new google.maps.Marker({
              map: map,
              position: myLatLng,
              title: ''
            });

            // Add circle overlay and bind to marker
            var circle = new google.maps.Circle({
              map: map,
              radius: parseFloat(locations[i].radius),    // 10 miles in metres
              fillColor: 'blue'
            });
            circle.bindTo('center', marker, 'position');


            bounds.extend(myLatLng);

            bindInfoWindow(marker, map, infowindow, '<strong>'+locations[i].name+'</strong>');

          }

          if(locations.length > 1) {
            map.fitBounds(bounds);
          }

          var wHt = $(window).outerHeight();
          $('#map').height(wHt-50);

          $(window).resize(function() {
            wHt = $(window).outerHeight();
            $('#map').height(wHt-50);
          })

      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
      })
      .always(function () {
        NOVA.hideLoading();
      })
  };

})(this);

function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    NOVA.getAppLogo();
    NOVA.geofenceListGet();
    ko.applyBindings(NOVA);

  }
}
document.onreadystatechange = init;