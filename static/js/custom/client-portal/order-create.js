(function (window) {

  var locations, map, mapOptions, infowindow, markers, mapIcon, markerUrl, tempPlace, bounds, geocoder, description

  NOVA.infoWindowIndex = ko.observable('')



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


  NOVA.locations = ko.observableArray([
    /*{
      label: "0",
      lat: 1.290270,
      lng: 103.851959,
      type: "pickup"
    },
    {
      label: "1",
      lat: 1.311245,
      lng: 103.834565,
      type: "delivery"
    },
    {
      label: "2",
      lat: 1.317036,
      lng: 103.810270,
      type: "delivery"
    },
    {
      label: "3",
      lat: 1.310736,
      lng: 103.850296,
      type: "delivery"
    }*/
  ])


  NOVA.fitBoundsToVisibleMarkers = function () {
    bounds = new google.maps.LatLngBounds();
    for (var i=0; i<markers.length; i++) {
      if(markers[i].getVisible()) {
        bounds.extend( markers[i].getPosition() );
      }
    }
    map.fitBounds(bounds);
  }



  var mapOptions = {
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

  function setMarker(place, type, latlng) {
      
      if(markers) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
      }
      markers = [];

      if(!latlng) {
        if(type == 'pickup') {          

          if(NOVA.locations().some(e => e.type == 'pickup')) {
            NOVA.locations.shift();
          }
          // console.log($('#pickupLocation').val())
          description = $('#pickupLocation').val()
          /*geocoder = new google.maps.Geocoder();
          var latlngL = {lat: parseFloat(place.geometry.location.lat()), lng: parseFloat(place.geometry.location.lng())};
          geocoder.geocode({'location': latlngL}, function(results, status) {
            if (status === 'OK') {
              if (results[0]) {
                description = results[0].formatted_address
              } else {
                description = '';
              }
            } else {
              description = '';
            }
          });*/

          var newDlLoc = {
            label: "0",
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            type: "pickup",
            loc_type: "google",
            pluscode: OpenLocationCode.encode(place.geometry.location.lat(), place.geometry.location.lng(), 10),
            description: description, 
          }
          NOVA.locations.unshift(newDlLoc);

          for(var i=1; i<NOVA.locations.length; i++){
            NOVA.locations[i].label(JSON.stringify(i));
          }

          // NOVA.locations()[0].lat = place.geometry.location.lat()
          // NOVA.locations()[0].lng = place.geometry.location.lng()
        } else {
          if(NOVA.locations().some(e => e.type == 'pickup')) {
            var setLbl = JSON.stringify(NOVA.locations().length)
          }else{
            var setLbl = JSON.stringify(NOVA.locations().length + 1)
          }
          description = $('#deliveryLocation').val()
          /*geocoder = new google.maps.Geocoder();
          var latlngL = {lat: parseFloat(place.geometry.location.lat()), lng: parseFloat(place.geometry.location.lng())};
          geocoder.geocode({'location': latlngL}, function(results, status) {
            if (status === 'OK') {
              if (results[0]) {
                description = results[0].formatted_address
              } else {
                description = '';
              }
            } else {
              description = '';
            }
          });*/

          flag = true
          if(NOVA.locations().some(e => (e.lat == place.geometry.location.lat() && e.lng == place.geometry.location.lng() ))) {
            flag = false;
          }

          if(flag == true){
            var newDlLoc = {
              label: setLbl,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              type: "delivery",
              loc_type: "google",
              pluscode: OpenLocationCode.encode(place.geometry.location.lat(), place.geometry.location.lng(), 10),
              description: description,
            }
            NOVA.locations.push(newDlLoc)
            $('[name="deliveryLocationH"]').val(true);
          }
        }
      }

      for (i = 0; i < NOVA.locations().length; i++) {
        markerText = ' '
        if(NOVA.locations()[i].type == "delivery") {
          markerUrl = '/static/images/round-marker.png';
          markerText = NOVA.locations()[i].label
        } else {
          markerUrl = '/static/images/round-marker-green.png';
        }
        size = 32;
        mapIcon = new google.maps.MarkerImage(markerUrl,           
          new google.maps.Size(size, size),
          new google.maps.Point(0,0),
          new google.maps.Point(size/4, size/4)
          )
        markers[i] = new google.maps.Marker({
          map: map,
          label: {
           text: markerText,
           color: "white",
           fontWeight: '700'
         },
         position: new google.maps.LatLng(NOVA.locations()[i].lat, NOVA.locations()[i].lng),           
         icon: mapIcon
       });

        var latStr = JSON.stringify(NOVA.locations()[i].lat)
        var lngStr = JSON.stringify(NOVA.locations()[i].lng)

        NOVA.bindInfoWindow(markers[i], map, infowindow, '<strong>'+latStr+','+lngStr+'</strong>');
      }

      if(!latlng) {
        if (!place.geometry) {
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }
      }

      if(NOVA.locations().length > 1) {
        NOVA.fitBoundsToVisibleMarkers()
      } else {

        if(!latlng) {
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
          }
          markers[0].setPosition(place.geometry.location);
          markers[0].setVisible(true);
        } else {
          NOVA.fitBoundsToVisibleMarkers()
        }
      }
    }



  NOVA.initMap = function(){
    var center = {lat: 1.290270, lng: 103.851959};

    infowindow =  new google.maps.InfoWindow({
      content: ''
    });

    map = new google.maps.Map(document.getElementById('mapView'), mapOptions);

    var pickupLocationInput = document.getElementById("pickupLocation");
    var autocompletePick = new google.maps.places.Autocomplete(pickupLocationInput);

    var deviveryLocationInput = document.getElementById("deliveryLocation");
    var autocompleteDeli = new google.maps.places.Autocomplete(deviveryLocationInput);

    autocompletePick.bindTo('bounds', map);
    autocompleteDeli.bindTo('bounds', map);

    autocompletePick.setFields(['address_components', 'geometry', 'icon', 'name']);
    autocompletePick.setComponentRestrictions({'country': ['sg']});

    autocompleteDeli.setFields(['address_components', 'geometry', 'icon', 'name']);
    autocompleteDeli.setComponentRestrictions({'country': ['sg']});

    autocompleteDeli.addListener('place_changed', function(place) {
      var place = autocompleteDeli.getPlace();
      tempPlace = place;
    })

    autocompletePick.addListener('place_changed', function(place) {
      var place = autocompletePick.getPlace();

      if(place){
        $('[name="pickupLocationH"]').val(true);
      }

      // var lat = place.geometry.location.lat()
      // var lng = place.geometry.location.lng()     
      
      // console.log(OpenLocationCode.encode(lat, lng, 10))


      // console.log(place)
      setMarker(place, 'pickup');
    });
    
    $('#deliveryLocationAdd').on('click', function() {
      setMarker(tempPlace, 'delivery');
      $('#deliveryLocation').val('');
    })

    $('#pickupLocationLatLngAdd').on('click', function() {
      var validLatLng = $('#deliveryLocationLatLng input').val().match(/^-?([0-8]?[0-9]|90)\.[0-9]{1,20},-?((1?[0-7]?|[0-9]?)[0-9]|180)\.[0-9]{1,20}$/i);
      if($('#pickupLocationLatLng input').val() != '' && !validLatLng ){
        var getLatLng = $('#pickupLocationLatLng input').val().split(',');

        if(NOVA.locations().some(e => e.type == 'pickup')) {
          NOVA.locations.shift();
        }
        description = ''
        geocoder = new google.maps.Geocoder();
        var latlngL = {lat: parseFloat(getLatLng[0]), lng: parseFloat(getLatLng[1])};
        geocoder.geocode({'location': latlngL}, function(results, status) {
          if (status === 'OK') {
            if (results[0]) {
              description = results[0].formatted_address
            } else {
              description = '';
            }
          } else {
            description = '';
          }
        });

        var newDlLoc = {
          label: "0",
          lat: parseFloat(getLatLng[0]),
          lng: parseFloat(getLatLng[1]),
          type: "pickup",
          loc_type: "latLong",
          pluscode: OpenLocationCode.encode(parseFloat(getLatLng[0]), parseFloat(getLatLng[1]), 10),
          description: description,
        }
        NOVA.locations.unshift(newDlLoc)

        for(var i=1; i<NOVA.locations.length; i++){
          NOVA.locations[i].label(JSON.stringify(i));
        }
        // NOVA.locations()[0].lat = getLatLng[0];
        // NOVA.locations()[0].lng = getLatLng[1];
        setMarker('', 'pickup', true);
      }
    })

    $('#deliveryLocationLatLngAdd').on('click', function() {
      var validLatLng = $('#deliveryLocationLatLng input').val().match(/^-?([0-8]?[0-9]|90)\.[0-9]{1,20},-?((1?[0-7]?|[0-9]?)[0-9]|180)\.[0-9]{1,20}$/i);
      if($('#deliveryLocationLatLng input').val() != '' && validLatLng ){
        var getLatLng = $('#deliveryLocationLatLng input').val().split(',');
        
        if(NOVA.locations().some(e => e.type == 'pickup')) {
          var setLbl = JSON.stringify(NOVA.locations().length)
        }else{
          var setLbl = JSON.stringify(NOVA.locations().length + 1)
        }
        description = ''
        geocoder = new google.maps.Geocoder();
        var latlngL = {lat: parseFloat(getLatLng[0]), lng: parseFloat(getLatLng[1])};
        geocoder.geocode({'location': latlngL}, function(results, status) {
          if (status === 'OK') {
            if (results[0]) {
              description = results[0].formatted_address
            } else {
              description = '';
            }
          } else {
            description = ''
          }
        });

        flag = true
        if(NOVA.locations().some(e => (e.lat == parseFloat(getLatLng[0]) && e.lng == parseFloat(getLatLng[1]) ))) {
          flag = false;
        }

        if(flag == true){
          var newDlLoc = {
              label: setLbl,
              lat: parseFloat(getLatLng[0]),
              lng: parseFloat(getLatLng[1]),
              type: "delivery",
              loc_type: "latLong",
              pluscode: OpenLocationCode.encode(parseFloat(getLatLng[0]), parseFloat(getLatLng[1]), 10),
              description: description,
            }
          NOVA.locations.push(newDlLoc);
          $('[name="deliveryLocationH"]').val(true);
          setMarker('', 'delivery', true);
          $('#deliveryLocationLatLng').val('');
        }
      
      $('#deliveryLocationLatLng input').val('');
      }
    })
  }

  $('[name="locationPickup"]').on('change', function() {
    $('#pickupLocation').val('');
    // #pickupLocationLatLng input
    if($(this).val() == 'google') {
      $('#pickupLocation').removeClass('d-none');
      $('#pickupLocationLatLng').addClass('d-none');
    } else {
      $('#pickupLocation').addClass('d-none');
      $('#pickupLocationLatLng').removeClass('d-none');
    }
    $('[name="pickupLocationH"]').val('');
  })

  $('[name="locationDelivery"]').on('change', function() {
    $('#deliveryLocationWrp input').val('');
    // #deliveryLocationLatLng input
    if($(this).val() == 'google') {
      $('#deliveryLocationWrp').removeClass('d-none');
      $('#deliveryLocationLatLng').addClass('d-none');
    } else {
      $('#deliveryLocationWrp').addClass('d-none');
      $('#deliveryLocationLatLng').removeClass('d-none');
    }
  })


  $('[name="pickupLocationLatLng"]').on('keyup', function(){
    if($(this).val() != ''){
      $('[name="pickupLocationH"]').val(true);
    }else{
      $('[name="pickupLocationH"]').val('');
    }
  })

  $('[name="pickupLocation"]').on('keyup', function(){
    if($(this).val() == ''){
      $('[name="pickupLocationH"]').val('');
    }
  })

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
  
  NOVA.showNextInfoWindow = function(){
    if ( (NOVA.locations().length > 0) ){
      if ( NOVA.infoWindowIndex() === '' ) {
        NOVA.infoWindowIndex(0)
        infowindow.setContent(NOVA.locations()[NOVA.infoWindowIndex()].title);
        infowindow.open(map, markers[NOVA.infoWindowIndex()]);
      } else {
        NOVA.infoWindowIndex(NOVA.infoWindowIndex()+1)
        infowindow.setContent(NOVA.locations()[NOVA.infoWindowIndex()].title);
        infowindow.open(map, markers[NOVA.infoWindowIndex()]);
      }
    }
  }

  NOVA.showPrevInfoWindow = function(){
    if ( (NOVA.locations().length > 0) && (NOVA.infoWindowIndex() > 0) ){
      infowindow.setContent(NOVA.locations()[NOVA.infoWindowIndex()-1].title);
      infowindow.open(map, markers[NOVA.infoWindowIndex()-1]);
      NOVA.infoWindowIndex(NOVA.infoWindowIndex()-1)
    }
  }


  $.validator.addMethod("mandatoryRequired", $.validator.methods.required, "Please add document");
  $.validator.addClassRules("mandatoryDoc", {
    mandatoryRequired: true     
  });

  jQuery.validator.addMethod("latlngVal", function(value, element) {
    return this.optional(element) || /^-?([0-8]?[0-9]|90)\.[0-9]{1,20},-?((1?[0-7]?|[0-9]?)[0-9]|180)\.[0-9]{1,20}$/g.test(value);
  }, "Please enter valid latitude");

  // jQuery.validator.addMethod("lngRegex", function(value, element) {
  //   return this.optional(element) || /^-?(([-+]?)([\d]{1,3})((\.)(\d+))?)/g.test(value);
  // }, "Please enter valid longitude");

  jQuery.validator.addMethod("noSPace", function(value, element) {
        return this.optional(element) || /^[a-z,0-9]/i.test(value);
    }, "First space is not allowed");
  

  var recurrenceModalFormValidator = $("#recurrenceModalForm").validate({
    errorElement: 'span',
    errorClass: 'error text-danger',
    errorPlacement: function(error, element) {
      if (element.parent().hasClass("input-group")) {
        error.appendTo( element.parent().parent());
      } else if (element.parent().hasClass("custom-radio")) {
        error.appendTo( element.parent().parent().parent());
      } else {
        error.appendTo( element.parent());
      }
    },
    rules: {
      recurrenceName: {
        required: true,
        noSPace: true
      },
      period : {
        required: true
      },
      recurrence_month: {
        required: true
      },
      recurrence_week: {
        required: true
      },
      recurrence_day: {
        required: true
      },
      endDateModal: {
        required: true
      }
    },
    messages: {
      recurrenceName: {
        required: "Please enter name"
      },
      period : {
        required: "Please select period"
      },
      recurrence_month: {
        required: "Please select month"
      },
      recurrence_week: {
        required: "Please select week"
      },
      recurrence_day: {
        required: "Please select day"
      },
      endDateModal: {
        required: "Please enter end date"
      }
    },
    submitHandler: function() {
      NOVA.saveRecurrenceClick();
    }
  });


  var createOrderFormValidator = $("#createOrderForm").validate({
    ignore: "input[type='text']:hidden",
    errorElement: 'span',
    errorClass: 'error text-danger',
    errorPlacement: function(error, element) {
      if (element.parent().hasClass("input-group")) {
        error.appendTo( element.parent().parent());
      } else if (element.parent().parent().hasClass("checkbox-custom")) {
        error.appendTo( element.parent().parent().parent());
      } else if (element.parent().hasClass("custom-file")) {
        error.appendTo( element.parent().parent().parent());
      } else if(element.parent().parent().hasClass('input-group-append')) {
        error.appendTo( element.parent().parent().parent().parent());
      } else if(element.parent().hasClass('custom-radio')) {
        error.appendTo( element.parent().parent().parent());
      } else {
        error.appendTo( element.parent());
      }
    },
    rules: {
      orderId: {
        required: true
      },
      clientName: {
        required: true
      },
      contactPerson: {
        required: true
      },
      jobDateTime : {
        required: true
      },
      typeofService : {
        required: true
      },
      typeofVehicle : {
        required: true
      },
      pickupLocationH: {
        required: true
      },
      deliveryLocationH: {
        required: true
      },
      vehicleFeature: {
        required: true
      },
      // documentInput: {
      //   required: true
      // },
      pickupLocationLatLng: {
        latlngVal: true
      },
      deliveryLocationLatLng: {
        latlngVal: true
      },
      noOfVehicle: {
        number: true
      },
      noOfCargo: {
        number: true
      },
      jobEndDateTime: {
        required: true
      }
    },
    messages: {
      orderId: {
        required: "Please enter order id"
      },
      clientName: {
        required: "Please select client name"
      },
      contactPerson: {
        required: "Please enter contact person"
      },
      jobDateTime : {
        required: "Please enter job date and time"
      },
      typeofService : {
        required: "Please select job type"
      },
      typeofVehicle : {
        required: "Please select vehicle type"
      },
      pickupLocationH: {
        required: "Please enter pickup location"
      },
      deliveryLocationH: {
        required: "Please enter delivery location"
      },
      vehicleFeature: {
        required: "Please select at least one"
      },
      // documentInput: {
      //   required: "Please add a document"
      // },
      jobEndDateTime: {
        required: "Please enter job end date and time"
      }
    },
    submitHandler: function() {      
      NOVA.saveOrderConfig();
    }
  });

  NOVA.initMap()





  NOVA.order_name = ko.observable('');
  NOVA.job_start_date = ko.observable('');
  NOVA.jobtype_description = ko.observable('');
  NOVA.service_type = ko.observable('');
  NOVA.job_end_date = ko.observable('');
  NOVA.jobtype_value = ko.observable('');
  NOVA.no_of_vehicles = ko.observable(1);
  NOVA.no_of_cargohads = ko.observable(1);
  NOVA.tonnage = ko.observable('');
  NOVA.cubic_meter = ko.observable('');
  NOVA.pallet = ko.observable('');
  NOVA.cartons = ko.observable('');  
  NOVA.job_end_time = ko.observable('');

  NOVA.vehicle_features_list = ko.observableArray([]);
  NOVA.ppe_requirements_list = ko.observableArray([]);
  NOVA.jobtypes_list = ko.observableArray([]);
  NOVA.vehicles_list = ko.observableArray([]); 

    
  NOVA.getPPERequirements = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/get/ppe/requirements',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.ppe_requirements_list([]);
      for(var i=0; i<d.length; i++){
        NOVA.ppe_requirements_list.push(d[i]);
      }
      NOVA.getOrderUid();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.getOrderUid = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/get/order/uid',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.order_name(d.uid);
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }  

  NOVA.jobDateChangeEvent = function(){
    if(NOVA.job_start_date() != '' && NOVA.job_start_date() != undefined){
      NOVA.getJobTypesList();
    }
  }

  NOVA.getJobTypesList = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/clientportal/get/jobtypes/list',
      data: {'job_start_date': NOVA.job_start_date()},
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.jobtypes_list([]);
      NOVA.vehicles_list([]);
      NOVA.vehicle_features_list([]);
      NOVA.jobtype_value('');
      $('#order-save-btn').attr('disabled', 'disabled');
      for(i=0; i< d.jobtypes_list.length; i++){
        NOVA.jobtypes_list.push(d.jobtypes_list[i]);
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.jobtypes_list([]);
      NOVA.vehicles_list([]);
      NOVA.vehicle_features_list([]);
      NOVA.jobtype_value('');
      $('#order-save-btn').attr('disabled', 'disabled');
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.jobtypeChangeEvent = function(data, e){
    NOVA.vehicles_list([]);
    NOVA.vehicle_features_list([]);
    NOVA.jobtypes_list().forEach(function(entry) {
      if(entry.jobtype_id == data.jobtype_id){
        NOVA.jobtype_value(entry.value);
        NOVA.service_type(entry.service_type);
        for(var i=0; i<entry.vehicles.length; i++){
          NOVA.vehicles_list.push(entry.vehicles[i]);
        }        

        for(var i=0; i<entry.features_list.length; i++){
          NOVA.vehicle_features_list.push(entry.features_list[i]);
        }

        if(entry.service_type == 'Charter'){
          $('#job-end-time').addClass('d-none');
          $('#job-end-date').removeClass('d-none');
          $('#location-section').addClass('d-none');
          $('[name="pickupLocationH"]').val(true);
          $('[name="deliveryLocationH"]').val(true);
        }else{
          $('#job-end-date').addClass('d-none');
          $('#location-section').removeClass('d-none');
          $('[name="pickupLocationH"]').val('');
          $('[name="deliveryLocationH"]').val('');
          $('#job-end-time').removeClass('d-none');
        }

        $('input[name="jobEndDateTime"]').daterangepicker({
          singleDatePicker: true,
          showDropdowns: true,
          autoUpdateInput: false,
          timePicker: true,
          minDate: new Date(),
          maxDate: entry.end_date,
          locale: {
            format: 'DD MMM YYYY hh:mm A'
          }
        }).on('apply.daterangepicker', function (ev, picker) {
          $(this).val(picker.startDate.format('DD MMM YYYY hh:mm A')).trigger("change");
        });

        $('input[name="endDateModal"]').daterangepicker({
          singleDatePicker: true,
          showDropdowns: true,
          autoUpdateInput: false,
          minDate: new Date(),
          maxDate: entry.end_date1,
          locale: {
            format: 'DD MMM YYYY'
          }
        }).on('apply.daterangepicker', function (ev, picker) {
          $(this).val(picker.startDate.format('DD MMM YYYY')).trigger("change");
        });
      }
    })
    $('#order-save-btn').removeAttr('disabled');
  }

  NOVA.vehicleChangeEvent = function(data, e){
    NOVA.vehicles_list().forEach(function(entry) {
      if(entry.vehicle_type_id == data.vehicle_type_id){
        NOVA.tonnage(entry.limit_tonnage);
        NOVA.cubic_meter(entry.limit_cc);
        NOVA.pallet(entry.limit_pellet);
        NOVA.cartons(entry.limit_carton);
      }
    })
  }

  NOVA.deleteLocationEvent = function(data, e){
    var locations_temp = [];
    locations_temp = $.grep(NOVA.locations(), function(e){ 
      return e.label != data.label; 
    });
    NOVA.locations([]);
    for(var i=0; i<locations_temp.length; i++){
      NOVA.locations.push(locations_temp[i]);
    }

    // NOVA.locations.remove(data);

    $('.location-list li').each(function(index, e) {
      $(this).find('.count-number').text(index+1);
    })

    NOVA.locations().forEach(function(entry, index) {
      if(NOVA.locations().some(e => e.type == 'pickup')) {
        entry.label = JSON.stringify(index);
      }else{
        entry.label = JSON.stringify(index+1);
      }
    })
    setMarker('', 'delivery', true);

    if(NOVA.locations().length > 0){
      $('[name="deliveryLocationH"]').val(true);
    }else{
      $('[name="deliveryLocationH"]').val('');
    }
  }

  NOVA.incrementVehicles = function(){
    NOVA.no_of_vehicles(NOVA.no_of_vehicles()+1);
  }

  NOVA.decrementVehicles = function(){
    if(NOVA.no_of_vehicles() > 1){
      NOVA.no_of_vehicles(NOVA.no_of_vehicles()-1);
    }
  }

  NOVA.incrementCargohads = function(){
    NOVA.no_of_cargohads(NOVA.no_of_cargohads()+1);
  }

  NOVA.decrementCargohads = function(){
    if(NOVA.no_of_cargohads() > 1){
      NOVA.no_of_cargohads(NOVA.no_of_cargohads()-1);
    }
  }

  NOVA.saveOrderConfig = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('order_name', NOVA.order_name());
    formdata.append('job_start_date', NOVA.job_start_date());
    var jobtype_id = $("input[name='typeofService']:checked").val();
    formdata.append('jobtype_id', jobtype_id);
    formdata.append('service_type', NOVA.service_type());
    formdata.append('job_end_date', NOVA.job_end_date());
    formdata.append('jobtype_description', NOVA.jobtype_description());
    var vehicle_type_id = $("input[name='typeofVehicle']:checked").val();
    formdata.append('vehicle_type_id', vehicle_type_id);
    var features_selected = [];
    $.each($("input[name='vehicleFeature']:checked"), function(){
      features_selected.push($(this).val());
    });
    formdata.append('features_selected', ko.toJSON(features_selected));
    formdata.append('no_of_vehicles', NOVA.no_of_vehicles());
    formdata.append('no_of_cargohads', NOVA.no_of_cargohads());
    formdata.append('tonnage', NOVA.tonnage());
    formdata.append('cubic_meter', NOVA.cubic_meter());
    formdata.append('pallet', NOVA.pallet());
    formdata.append('cartons', NOVA.cartons());
    var ppe_selected = [];
    $.each($("input[name='ppeRequirement']:checked"), function(){
      ppe_selected.push($(this).val());
    });
    formdata.append('ppe_selected', ko.toJSON(ppe_selected));
    formdata.append('locations', ko.toJSON(NOVA.locations()));
    formdata.append('job_end_time', $('#job_end_time').val());
    $.ajax({
      method: 'POST',
      url: '/api/clientportal/order/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.showToast(d.msg);
      setTimeout(function() {
        window.location = '/client-portal/order/'+d.order_id+'/detail';
      }, 1000);

    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  $('input[name="jobDateTime"]').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    autoUpdateInput: false,
    timePicker: true,
    minDate: new Date(),
    locale: {
      format: 'DD MMM YYYY hh:mm A'
    }
  }).on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD MMM YYYY hh:mm A')).trigger("change");
  });

})(this);
  
function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    NOVA.getPPERequirements();
    ko.applyBindings(NOVA);
  }
}

document.onreadystatechange = init;