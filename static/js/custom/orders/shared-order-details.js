(function (window) {

  var locations, map, mapOptions, infowindow, markers = [], mapIcon, swiper, markerUrl, bounds, geocoder, directionsService, directionsRenderer, pickupLocation, deliveryLocation, waypoints = []

  NOVA.infoWindowIndex = ko.observable('');
  NOVA.ticketTime = ko.observable('');
  NOVA.vars = ko.observable('');

  NOVA.order_id = ko.observable('');
  NOVA.client = ko.observable('');
  NOVA.uid = ko.observable('');
  NOVA.contactPerson = ko.observable('');
  NOVA.contactNumber = ko.observable('');
  NOVA.contactEmail = ko.observable('');
  NOVA.status = ko.observable('');
  NOVA.timeRemaining = ko.observable('');

  NOVA.jobType = ko.observable('');
  NOVA.jobDescription = ko.observable('');
  NOVA.startDate = ko.observable('');
  NOVA.orginalstartDate = ko.observable('');
  NOVA.order_type = ko.observable('');

  NOVA.vehicleType = ko.observable('');
  NOVA.vehicleFeatures = ko.observable('');
  NOVA.vehicleCount = ko.observable('');
  NOVA.cargohandCount = ko.observable('');
  NOVA.paymentList = ko.observableArray([]);
  NOVA.ppeRequirements = ko.observableArray([]);
  NOVA.deliveryList = ko.observableArray([]);
  NOVA.locations = ko.observableArray([]);
  NOVA.assigned_vehicles = ko.observableArray([]);

  NOVA.cargoTon = ko.observable('');
  NOVA.cargoCC = ko.observable('');
  NOVA.cargoPallet = ko.observable('');
  NOVA.cargoCarton = ko.observable('');

  NOVA.picupLatitude = ko.observable('');
  NOVA.picupLongitude = ko.observable('');
  NOVA.allow_cancel = ko.observable('');
  NOVA.allow_complete = ko.observable('');
  NOVA.allow_notification = ko.observable('');

  NOVA.job_end_date = ko.observable('');
  NOVA.job_end_time = ko.observable('');

  NOVA.initSwiper = function(){
    swiper = new Swiper('.swiper-container', {
      navigation: {
        nextEl: '.next-vehicle-btn',
        prevEl: '.prev-vehicle-btn',
      },
    });
  }

  NOVA.mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    }
  ]

  // NOVA.locations = ko.observable('');

  // NOVA.locations = ko.observable([
  //   {
  //     title: ko.observable(''),
  //     latitude: 1.311245,
  //     longitude: 103.834565,
  //     type: "Pickup Location"
  //   },
  //   {
  //     title: ko.observable(''),
  //     latitude: 1.317036,
  //     longitude: 103.810270,
  //     type: "Vehicle Location"
  //   },
  //   {
  //     title: ko.observable(''),
  //     latitude: 1.310736,
  //     longitude: 103.850296,
  //     type: "Delivery Location"
  //   },
  //   {
  //     title: ko.observable(''),
  //     latitude: 1.315627,
  //     longitude: 103.830560,
  //     type: "Delivery Location"
  //   },
  //   {
  //     title: ko.observable(''),
  //     latitude: 1.318341,
  //     longitude: 103.828157,
  //     type: "Delivery Location"
  //   },
  //   {
  //     title: ko.observable(''),
  //     latitude: 1.320908,
  //     longitude: 103.833102,
  //     type: "Delivery Location"
  //   }
  // ])

  NOVA.fitBoundsToVisibleMarkers = function () {
    bounds = new google.maps.LatLngBounds();
    for (var i=0; i<markers.length; i++) {
      // console.log(markers[i]);
      if(markers[i].getVisible()) {
        bounds.extend( markers[i].getPosition() );
      }
    }
    map.fitBounds(bounds);
  }

  NOVA.initMap = function(){

    mapOptions = {
      zoom: 13,
      center: {lat:   1.290270, lng: 103.851959},
      styles: NOVA.mapStyle,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true
    };
    
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      preserveViewport: true,
      polylineOptions: {
        strokeColor: "rgba(245, 0, 87, 0.6)",
        strokeWeight: 5
      }
    });
    map = new google.maps.Map(document.getElementById("mapView"), mapOptions);
    directionsRenderer.setMap(map);
    geocoder = new google.maps.Geocoder;
    

    infowindow =  new google.maps.InfoWindow({
      content: ''
    });
    
    for (i = 0; i < NOVA.locations().length; i++) {
      size = 32
      
      if ( NOVA.locations()[i].type == "Delivery Location" ) {
        if ( i === NOVA.locations().length-1 ) {
          deliveryLocation = new google.maps.LatLng(NOVA.locations()[i].latitude, NOVA.locations()[i].longitude);
        } else {
          waypoints.push({
            location: new google.maps.LatLng(NOVA.locations()[i].latitude, NOVA.locations()[i].longitude),
            stopover: true
          })
        }
      } else if ( NOVA.locations()[i].type == "Vehicle Location" ) {
        markers[0] = new google.maps.Marker({
          map: map,
          title: NOVA.locations()[i].title,
          position: new google.maps.LatLng(NOVA.locations()[i].latitude, NOVA.locations()[i].longitude),
          icon: {
            url: '/static/images/marker2.png'
          }
        });
        NOVA.geocodeLatLng(geocoder, map, infowindow, markers[0], NOVA.locations()[i].title, NOVA.locations()[i].latitude, NOVA.locations()[i].longitude, i);
      } else if ( NOVA.locations()[i].type == "Pickup Location" ) {
        pickupLocation = new google.maps.LatLng(NOVA.locations()[i].latitude, NOVA.locations()[i].longitude);
      }

    }

    var request = {
      origin:pickupLocation,
      destination:deliveryLocation,
      waypoints: waypoints,
      travelMode: 'DRIVING'
    };

    directionsService.route(request, function(response, status) {
      if (status == 'OK') {
        directionsRenderer.setDirections(response);
        NOVA.setMarker(response)
      }
    });
  }

  NOVA.setMarker = function(directionsServiceResponse){
    console.log(directionsServiceResponse)
    for (i = 0; i < directionsServiceResponse.routes[0].legs.length; i++) {
      if ( i === 0 ) {
        markers[1] = new google.maps.Marker({
          map: map,
          position: directionsServiceResponse.routes[0].legs[i].start_location,
          icon: {
            url: '/static/images/marker3.png',
            labelOrigin: new google.maps.Point(17, 13)
          }
        });

        NOVA.bindInfoWindow(markers[1], map, infowindow, directionsServiceResponse.routes[0].legs[i].start_address, directionsServiceResponse.routes[0].legs[i].start_address);

        markers[2] = new google.maps.Marker({
          map: map,
          label: {text: (i+1).toString(), color: "white", fontSize: "12px", fontWeight: "bold"},
          position: directionsServiceResponse.routes[0].legs[i].end_location,
          icon: {
            url: '/static/images/marker1.png',
            labelOrigin: new google.maps.Point(17, 13)
          }
        });

        NOVA.bindInfoWindow(markers[2], map, infowindow, directionsServiceResponse.routes[0].legs[i].end_address, directionsServiceResponse.routes[0].legs[i+1].end_address);

      } else {

        markers[i+2] = new google.maps.Marker({
          map: map,
          label: {text: (i+1).toString(), color: "white", fontSize: "12px", fontWeight: "bold"},
          position: directionsServiceResponse.routes[0].legs[i].end_location,
          icon: {
            url: '/static/images/marker1.png',
            labelOrigin: new google.maps.Point(17, 13)
          }
        });

        NOVA.bindInfoWindow(markers[i+2], map, infowindow, directionsServiceResponse.routes[0].legs[i].end_address, directionsServiceResponse.routes[0].legs[i].end_address);
      }
    }
    console.log(markers)
    NOVA.fitBoundsToVisibleMarkers()

  }

  NOVA.geocodeLatLng = function(geocoder, map, infowindow, marker, title, lat, lng, i) {
    var latlng = {lat: parseFloat(lat), lng: parseFloat(lng)};
    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          NOVA.locations()[i].title=results[0].formatted_address;
          NOVA.bindInfoWindow(marker, map, infowindow, results[0].formatted_address, title);
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });
  }

  NOVA.bindInfoWindow = function(marker, map, infowindow, html, title) {
    google.maps.event.addListener(marker, 'mouseover', function() {
      infowindow.setContent(html); 
      infowindow.open(map, marker);
      var getDataId = $('.card').attr('data-id');
    });
    google.maps.event.addListener(marker, 'mouseout', function() {
      infowindow.close();
    });
  }
  
  // NOVA.showNextInfoWindow = function(){
  //   if ( (NOVA.locations().length > 0) ){
  //     if ( NOVA.infoWindowIndex() === '' ) {
  //       NOVA.infoWindowIndex(0)
  //       infowindow.setContent(NOVA.locations()[NOVA.infoWindowIndex()].title());
  //       infowindow.open(map, markers[NOVA.infoWindowIndex()]);
  //     } else {
  //       NOVA.infoWindowIndex(NOVA.infoWindowIndex()+1)
  //       infowindow.setContent(NOVA.locations()[NOVA.infoWindowIndex()].title());
  //       infowindow.open(map, markers[NOVA.infoWindowIndex()]);
  //     }
  //   }
  // }

  // NOVA.showPrevInfoWindow = function(){
  //   if ( (NOVA.locations().length > 0) && (NOVA.infoWindowIndex() > 0) ){
  //     infowindow.setContent(NOVA.locations()[NOVA.infoWindowIndex()-1].title());
  //     infowindow.open(map, markers[NOVA.infoWindowIndex()-1]);
  //     NOVA.infoWindowIndex(NOVA.infoWindowIndex()-1)
  //   }
  // }

  // NOVA.initMap()
  // NOVA.initSwiper()
  

  NOVA.getOrderDetails = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/details/get',
      data: {'order_id': NOVA.order_id()},
      dataType: 'json',
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      console.log(d);
      NOVA.client(d.client);
      NOVA.uid(d.uid);
      NOVA.contactPerson(d.contact_person);
      NOVA.contactNumber(d.contact_number);
      NOVA.contactEmail(d.contact_email);
      NOVA.status(d.status);
      // NOVA.timeRemaining(d.time_remaining);

      var timeString = d.timer_date_time;
      var time = moment(timeString).toDate();
      // var d1 = new Date();
      // var utc = d1.getTime() + (d1.getTimezoneOffset() * 60000);
      // var now = new Date(utc + (3600000*(5.30)));
      var now = new Date();
      var countDownDate = time.getTime();
      var distance = countDownDate - now;

      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (days > 0) {
        str = "+"+days+"d, "+moment(hours, "h").format("HH")+":"+moment(minutes, "m").format("mm")+":"+moment(seconds, "m").format("mm");
      } else {
        str = moment(hours, "h").format("HH")+":"+moment(minutes, "m").format("mm")+":"+moment(seconds, "m").format("mm");
      }

      if (distance < 0) {
        distance = now - countDownDate;
        days = Math.floor(distance / (1000 * 60 * 60 * 24));
        hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (days > 0) {
          str = "- "+days+"d, "+moment(hours, "h").format("HH")+":"+moment(minutes, "m").format("mm")+":"+moment(seconds, "m").format("mm");
        } else {
          str = "- "+moment(hours, "h").format("HH")+":"+moment(minutes, "m").format("mm")+":"+moment(seconds, "m").format("mm");
        }
      }

      NOVA.timeRemaining(str);

      NOVA.jobType(d.job_type);
      NOVA.jobDescription(d.job_description);
      NOVA.startDate(d.start_date);
      NOVA.orginalstartDate(d.orginal_start_date);

      NOVA.vehicleType(d.vehicletype);
      NOVA.vehicleFeatures(d.vehicle_features);
      NOVA.vehicleCount(d.vehicle_count);
      NOVA.cargohandCount(d.cargohand_count);
      NOVA.ppeRequirements(d.ppe_requirements);

      NOVA.cargoTon(d.cargo_ton);
      NOVA.cargoCC(d.cargo_cc);
      NOVA.cargoPallet(d.cargo_pallet);
      NOVA.cargoCarton(d.cargo_carton);
      NOVA.paymentList(d.payment_list);
      NOVA.deliveryList([]);
      NOVA.picupLatitude(d.picup_latitude);
      NOVA.picupLongitude(d.picup_longitude);    
      NOVA.locations(d.delivery_list);      
      NOVA.initMap()

      NOVA.order_type(d.order_type);
      NOVA.allow_cancel(d.allow_cancel);
      NOVA.allow_complete(d.allow_complete);
      NOVA.allow_notification(d.allow_notification);
      
      NOVA.job_end_date(d.job_end_date);
      NOVA.job_end_time(d.job_end_time);

      NOVA.assigned_vehicles([]);
      for(var i=0; i<d.order_vehicles_list.length; i++){
        NOVA.assigned_vehicles.push(d.order_vehicles_list[i]);
      }
      NOVA.initSwiper()

      if(NOVA.order_type() == 'Charter'){
        $('#location-info').addClass('d-none');
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseText);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.cancelOrder = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('order_id',NOVA.order_id());
    $.ajax({
      method: 'POST',
      url: '/api/order/cancel/order',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.getOrderDetails();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.completeOrder = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('order_id',NOVA.order_id());
    $.ajax({
      method: 'POST',
      url: '/api/order/complete/order',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.getOrderDetails();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.confirmOrderBtnClick = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('order_id',NOVA.order_id());
    $.ajax({
      method: 'POST',
      url: '/api/order/confirm/order',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.getOrderDetails();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

})(this);