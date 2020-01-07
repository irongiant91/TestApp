(function (window) {

  var locations, map, mapOptions, infowindow, markers = [], mapIcon, swiper, markerUrl, bounds, geocoder, directionsService, directionsRenderer, pickupLocation, deliveryLocation, waypoints = []

  NOVA.infoWindowIndex = ko.observable('');

  NOVA.order_id = ko.observable('');
  NOVA.name = ko.observable('');
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

  NOVA.vehicleType = ko.observable('');
  NOVA.vehicleFeatures = ko.observable('');
  NOVA.vehicleCount = ko.observable('');
  NOVA.cargohandCount = ko.observable('');
  NOVA.paymentList = ko.observableArray([]);
  NOVA.ppeRequirements = ko.observableArray([]);
  NOVA.deliveryList = ko.observableArray([]);
  NOVA.locations = ko.observableArray([]);

  NOVA.cargoTon = ko.observable('');
  NOVA.cargoCC = ko.observable('');
  NOVA.cargoPallet = ko.observable('');
  NOVA.cargoCarton = ko.observable('');

  NOVA.order_type = ko.observable('');
  NOVA.job_end_date = ko.observable('');
  NOVA.job_end_time = ko.observable('');

  NOVA.pickupLatitude = ko.observable('');
  NOVA.pickupLongitude = ko.observable('');

  NOVA.config_frequency_id = ko.observable('');
  NOVA.user_timezone = ko.observable('');
  NOVA.allow_generate_order = ko.observable('');

  NOVA.recurrence_name = ko.observable('');
  NOVA.recurrence_enddate = ko.observable('');
  NOVA.has_recurrence = ko.observable('false');
  NOVA.periodicity_list = ko.observableArray([]);

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
      url: '/api/order/recurring/details/get',
      data: {'order_id': NOVA.order_id()},
      dataType: 'json',
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.name(d.name);
      NOVA.client(d.client);
      // NOVA.uid(d.uid);
      NOVA.contactPerson(d.contact_person);
      NOVA.contactNumber(d.contact_number);
      NOVA.contactEmail(d.contact_email);
      NOVA.status(d.status);
      NOVA.timeRemaining(d.time_remaining);

      NOVA.jobType(d.job_type);
      NOVA.jobDescription(d.config_description);
      var offset = moment().utcOffset();
      // var start_date = moment.utc(d.start_date, "DD MMM YYYY hh:mmA").utcOffset(offset).format("DD MMM YYYY HH:mm:ss");
      NOVA.startDate(d.start_date);

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
      NOVA.pickupLatitude(d.pickup_latitude);
      NOVA.pickupLongitude(d.pickup_longitude);
    
      NOVA.locations(d.delivery_list);
      NOVA.periodicityCheckEvent(d.periodicity);

      $('#recurrence_month').val(d.month).trigger('change');
      $('#recurrence_week').val(d.week).trigger('change');
      $('#recurrence_day').val(d.day).trigger('change');
      NOVA.recurrence_enddate(d.end_date);

      NOVA.config_frequency_id(d.orderconfigfrequency_id);
      NOVA.recurrence_name(d.recurrance_name);
      
      NOVA.order_type(d.order_type);
      NOVA.job_end_date(d.job_end_date);
      NOVA.job_end_time(d.job_end_time);
      NOVA.allow_generate_order(d.allow_generate_order);
      
      NOVA.initMap()
      NOVA.initSwiper()
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseText);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.editRecurringOrderBtnClick = function(){
    window.location = '/order/recurring/edit/'+NOVA.order_id();
  }

  NOVA.getPeriodicity = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/get/periodicity/list',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.periodicity_list([]);
      for(var i=0; i<d.length; i++){
        NOVA.periodicity_list.push(d[i]);
      }
      NOVA.getOrderDetails();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.periodicityCheckEvent = function(periodicity){
    if(periodicity == 'Daily'){
      $('#month-list').addClass('d-none');
      $('#week-list').addClass('d-none');
      $('#day-list').addClass('d-none');
      $('#end-date').removeClass('d-none');
    }else if(periodicity == 'Weekly'){
      $('#month-list').addClass('d-none');
      $('#week-list').addClass('d-none');
      $('#day-list').removeClass('d-none');
      $('#end-date').removeClass('d-none');
    }else if(periodicity == 'Monthly'){
      $('#month-list').addClass('d-none');
      $('#week-list').removeClass('d-none');
      $('#day-list').removeClass('d-none');
      $('#end-date').removeClass('d-none');
    }else if(periodicity == 'Yearly'){
      $('#month-list').removeClass('d-none');
      $('#week-list').removeClass('d-none');
      $('#day-list').removeClass('d-none');
      $('#end-date').removeClass('d-none');
    }
    $('#'+periodicity).prop('checked',true);
  }

  NOVA.generateOrder = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();

    formdata.append('config_frequency_id', NOVA.config_frequency_id());
    formdata.append('user_timezone', NOVA.user_timezone());

    $.ajax({
      method: 'POST',
      url: '/api/order/orderconfig/generate/order',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.showToast(d)
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      // console.log(jqXHR.responseText)
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.redirectToDocuments = function(){
    window.location = '/orders/recurring/'+NOVA.order_id()+'/documents';
  }

  NOVA.redirectToFinances = function(){
    window.location = '/order/recurring/'+NOVA.order_id()+'/finance';
  }

})(this);