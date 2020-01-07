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
            loc_id: '',
            label: "0",
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            type: "pickup",
            loc_type: "google",
            pluscode: OpenLocationCode.encode(place.geometry.location.lat(), place.geometry.location.lng(), 10),
            description: description,
            allow_delete: '', 
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
              loc_id: '',
              label: setLbl,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              type: "delivery",
              loc_type: "google",
              pluscode: OpenLocationCode.encode(place.geometry.location.lat(), place.geometry.location.lng(), 10),
              description: description,
              allow_delete: 'true'
            }
            NOVA.locations.push(newDlLoc)
            $('[name="deliveryLocationH"]').val(true);
            $('#deliveryLocationH-error').hide();
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
        $('#pickupLocationH-error').hide();
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
          loc_id: '',
          label: "0",
          lat: parseFloat(getLatLng[0]),
          lng: parseFloat(getLatLng[1]),
          type: "pickup",
          loc_type: "latLong",
          pluscode: OpenLocationCode.encode(parseFloat(getLatLng[0]), parseFloat(getLatLng[1]), 10),
          description: description,
          allow_delete: ''
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
            loc_id: '',
            label: setLbl,
            lat: parseFloat(getLatLng[0]),
            lng: parseFloat(getLatLng[1]),
            type: "delivery",
            loc_type: "latLong",
            pluscode: OpenLocationCode.encode(parseFloat(getLatLng[0]), parseFloat(getLatLng[1]), 10),
            description: description,
            allow_delete: 'true'
          }
          NOVA.locations.push(newDlLoc);
          $('[name="deliveryLocationH"]').val(true);
          $('#deliveryLocationH-error').hide();
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
      $('#pickupLocationH-error').hide();
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
        required: true
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
      }  else {
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
      documentInput: {
        required: true
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
      documentInput: {
        required: "Please add a document"
      },
      jobEndDateTime: {
        required: "Please select job end date and time"
      }
    },
    submitHandler: function() {
      NOVA.updateOrderConfig();
    }
  });

  NOVA.initMap()





  NOVA.order_id = ko.observable('');
  NOVA.order_type = ko.observable('');
  NOVA.order_name = ko.observable('');
  NOVA.client_id = ko.observable('');
  NOVA.contact_person_id = ko.observable('');
  NOVA.contact_number = ko.observable('');
  NOVA.contact_email = ko.observable('');
  NOVA.job_start_date = ko.observable('');
  NOVA.selected_job_type = ko.observable('');
  NOVA.service_type = ko.observable('');
  NOVA.job_end_date = ko.observable('');
  NOVA.jobtype_description = ko.observable('');
  NOVA.jobtype_value = ko.observable('');
  NOVA.selected_vehicle_type = ko.observable('');
  NOVA.no_of_vehicles = ko.observable('');
  NOVA.no_of_cargohads = ko.observable('');
  NOVA.tonnage = ko.observable('');
  NOVA.cubic_meter = ko.observable('');
  NOVA.pallet = ko.observable('');
  NOVA.cartons = ko.observable('');
  NOVA.recurrence_name = ko.observable('');
  NOVA.recurrence_enddate = ko.observable('');
  NOVA.has_recurrence = ko.observable('false');
  NOVA.selected_tonnage = ko.observable('');
  NOVA.selected_cubic_meter = ko.observable('');
  NOVA.selected_pallet = ko.observable('');
  NOVA.selected_cartons = ko.observable('');
  NOVA.order_status = ko.observable('');
  NOVA.job_end_time = ko.observable('');

  NOVA.vehicle_features_list = ko.observableArray([]);
  NOVA.ppe_requirements_list = ko.observableArray([]);
  NOVA.periodicity_list = ko.observableArray([]);
  NOVA.clients_list = ko.observableArray([]);
  NOVA.contacts_list = ko.observableArray([]);
  NOVA.jobtypes_list = ko.observableArray([]);
  NOVA.vehicles_list = ko.observableArray([]);
  NOVA.documents_list = ko.observableArray([]);
  NOVA.selected_documents_list = ko.observableArray([]);
  NOVA.document_files = ko.observableArray([]);
  NOVA.finance_list = ko.observableArray([]);
  NOVA.selected_finance_list = ko.observableArray([]);
  NOVA.features_selected = ko.observableArray([]);

  var documentInput = function(){
    this.order_doc_id = ko.observable('');
    this.document_id = ko.observable('');
    this.doc_name = ko.observable('');
    this.doc_file = ko.observable('');
    this.is_mandatory = ko.observable('');
    this.type = ko.observable('');
    this.fill = function (d) {
      this.order_doc_id('' || d.order_doc_id);
      this.document_id('' || d.document_id);
      this.doc_name('' || d.doc_name);
      this.doc_file('' || d.doc_file);
      this.is_mandatory('' || d.is_mandatory);
      this.type('' || d.type);
    }
  }

  var financeInput = function(){
    this.order_finance_id = ko.observable('');
    this.finance_id = ko.observable('');
    this.finance_name = ko.observable('');
    this.finance_amount = ko.observable('');
    this.is_selected = ko.observable('');
    this.is_mandatory = ko.observable('');
    this.fill = function (d) {
      this.order_finance_id('' || d.order_finance_id);
      this.finance_id('' || d.finance_id);
      this.finance_name('' || d.finance_name);
      this.finance_amount('' || d.finance_amount);
      this.is_selected('' || d.is_selected);
      this.is_mandatory('' || d.is_mandatory);
    }
  }

  /*NOVA.getVehicleFeatures = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/get/vehicle/features',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.vehicle_features_list([]);
      for(var i=0; i<d.length; i++){
        NOVA.vehicle_features_list.push(d[i]);
      }
      NOVA.getPPERequirements();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }*/

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
      NOVA.getPeriodicity();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
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
      NOVA.getClientsList();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  /*NOVA.getOrderUid = function(){
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
      NOVA.getClientsList();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }*/

  NOVA.getClientsList = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/get/clients/list',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.clients_list([]);
      for(var i=0; i<d.length; i++){
        NOVA.clients_list.push(d[i]);
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

  NOVA.getOrderDetails = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/get/order/details',
      data: {'order_id': NOVA.order_id(), 'order_type': NOVA.order_type()},
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.order_name(d.order_name);
      NOVA.client_id(d.client_id);
      $('#clientName').val(NOVA.client_id()).trigger('change');
      NOVA.job_start_date(d.job_start_date);
      NOVA.selected_job_type(d.jobtype_id);
      NOVA.getJobTypesList();
      NOVA.job_end_date(d.job_end_date);
      NOVA.jobtype_description(d.jobtype_description);
      NOVA.selected_vehicle_type(d.vehicle_type_id);
      NOVA.features_selected([]);
      for(var i=0; i<d.features_selected.length; i++){
        NOVA.features_selected.push(parseInt(d.features_selected[i]));
      }      
      NOVA.no_of_vehicles(d.no_of_vehicles);
      NOVA.no_of_cargohads(d.no_of_cargohads);
      NOVA.selected_tonnage(d.tonnage);
      NOVA.selected_cubic_meter(d.cubic_meter);
      NOVA.selected_pallet(d.pallet);
      NOVA.selected_cartons(d.cartons);
      NOVA.job_end_time(d.job_end_time);
      var ppe_selected = []
      for(var i=0; i<d.ppe_selected.length; i++){
        ppe_selected.push(d.ppe_selected[i]);
      }
      $.each($("input[name='ppeRequirement']"), function(){
        if($.inArray(parseInt($(this).val()), ppe_selected) != -1) {
          $(this).prop('checked', true);
        }
      });
      for(var i=0; i<d.locations.length; i++){
        NOVA.locations.push(d.locations[i]);
      }
      
      if(NOVA.locations().length > 0){
        if(NOVA.locations()[0].loc_type == 'google'){
          $('#google1').prop('checked', true);
          $('#pickupLocation').removeClass('d-none');
          $('#pickupLocationLatLng').addClass('d-none');
          $('#pickupLocation').val(NOVA.locations()[0].description);
        }else{
          $('#latlog1').prop('checked', true);
          $('#pickupLocationLatLng').removeClass('d-none');
          $('#pickupLocation').addClass('d-none');
          $('#latlog1-input').val(NOVA.locations()[0].lat+","+NOVA.locations()[0].lng)
        }
      }

      setMarker('', 'delivery', true);
      for(var i=0; i<d.documents.length; i++){
        var document1 = new documentInput();
        document1.fill(d.documents[i]);
        NOVA.documents_list.push(document1);
        NOVA.selected_documents_list.push(document1);
      }
      for(var i=0; i<d.finances.length; i++){
        var finance1 = new financeInput();
        finance1.fill(d.finances[i]);
        NOVA.finance_list.push(finance1);
        NOVA.selected_finance_list.push(finance1);
      }
      NOVA.has_recurrence(d.has_recurrence);
      if(d.has_recurrence == 'true'){
        NOVA.recurrence_name(d.recurrence_name);
        $('#'+d.recurrence_period_name).prop("checked", true);
        $('#'+d.recurrence_period_name).val(d.recurrence_period).trigger('change');
        NOVA.recurrence_enddate(d.recurrence_enddate);
        $('#recurrence_month').val(d.recurrence_month);
        $('#recurrence_week').val(d.recurrence_week);
        $('#recurrence_day').val(d.recurrence_day);
      }

      if(d.allow_vehicle_edit == false){
        $('#no-of-vehicles').attr('disabled','disabled');
        $('#vehicles-increment').attr('disabled','disabled');
        $('#vehicles-decrement').attr('disabled','disabled');
      }

      NOVA.order_status(d.order_status);
      if(d.order_status=='Delivery Completed'||d.order_status=='Completed'||d.order_status=='Payment Pending'||d.order_status=='Payment Complete'||d.order_status=='Cancelled'){
        $('#pickup-section :input').attr('disabled', true);
        $('#delivery-section :input').attr('disabled', true);
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.clientChangeEvent = function(){
    NOVA.contacts_list([]);
    NOVA.clients_list().forEach(function(entry) {
      if(entry.client_id == NOVA.client_id()){
        for(i=0;i<entry.contacts.length; i++){
          NOVA.contacts_list.push(entry.contacts[i]);
        }
        NOVA.contact_person_id(entry.contacts[0].contact_id);
        NOVA.contact_number(entry.contacts[0].contact_number);
        NOVA.contact_email(entry.contacts[0].contact_email);        
      }
    })

    if(NOVA.job_start_date() != '' && NOVA.job_start_date() != undefined && NOVA.client_id() != '' && NOVA.client_id() != undefined){
      NOVA.getJobTypesList();
    }
  }

  NOVA.contactChangeEvent = function(){
    NOVA.contacts_list().forEach(function(entry) {
      if(entry.contact_id == NOVA.contact_person_id()){
        NOVA.contact_number(entry.contact_number);
        NOVA.contact_email(entry.contact_email);
      }
    })
  }

  NOVA.jobDateChangeEvent = function(){
    if(NOVA.job_start_date() != '' && NOVA.job_start_date() != undefined && NOVA.client_id() != '' && NOVA.client_id() != undefined){
      NOVA.getJobTypesList();
    }
  }

  NOVA.getJobTypesList = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/get/jobtypes/list',
      data: {'client_id': NOVA.client_id(), 'job_start_date': NOVA.job_start_date(), 'order_id':NOVA.order_id(), 'order_type': NOVA.order_type()},
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      console.log(d)
      NOVA.jobtypes_list([]);
      NOVA.vehicles_list([]);
      NOVA.documents_list([]);
      NOVA.finance_list([]);
      NOVA.vehicle_features_list([]);
      NOVA.jobtype_value('');
      for(i=0; i< d.jobtypes_list.length; i++){
        if(NOVA.order_type() == 'config'){
          if(d.jobtypes_list[i].service_type != 'Charter'){
            NOVA.jobtypes_list.push(d.jobtypes_list[i]);
          }
        }else{
          NOVA.jobtypes_list.push(d.jobtypes_list[i]);
        }
      }
      $('#typeofService-'+NOVA.selected_job_type()).prop("checked", true);
      $('#typeofService-'+NOVA.selected_job_type()).val(NOVA.selected_job_type()).trigger('change');
      $('#order-save-btn').removeAttr('disabled');
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#order-save-btn').attr('disabled', 'disabled');
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.jobtypeChangeEvent = function(data, e){
    NOVA.vehicles_list([]);
    NOVA.documents_list([]);
    NOVA.finance_list([]);    
    NOVA.vehicle_features_list([]);
    NOVA.tonnage('');
    NOVA.cubic_meter('');
    NOVA.pallet('');
    NOVA.cartons('');
    NOVA.jobtypes_list().forEach(function(entry) {
      if(entry.jobtype_id == data.jobtype_id){
        NOVA.jobtype_value(entry.value);
        NOVA.service_type(entry.service_type);
        for(var i=0; i<entry.vehicles.length; i++){
          NOVA.vehicles_list.push(entry.vehicles[i]);
        }
        $('#typeofVehicle-'+NOVA.selected_vehicle_type()).prop("checked", true);
        $('#typeofVehicle-'+NOVA.selected_vehicle_type()).val(NOVA.selected_vehicle_type()).trigger('change');
        if(NOVA.selected_job_type() == data.category_id){
          NOVA.documents_list(NOVA.selected_documents_list())
          NOVA.finance_list(NOVA.selected_finance_list())
        }else{
          for(var i=0; i<entry.documents_list_edit.length; i++){
            var document1 = new documentInput();
            document1.fill(entry.documents_list_edit[i]);
            NOVA.documents_list.push(document1);
          }
          for(var i=0; i<entry.finance_list.length; i++){
            var finance1 = new financeInput();
            finance1.fill(entry.finance_list[i]);
            NOVA.finance_list.push(finance1);
          }
        }

        for(var i=0; i<entry.features_list.length; i++){
          NOVA.vehicle_features_list.push(entry.features_list[i]);
        }
        $.each($("input[name='vehicleFeature']"), function(){
          if($.inArray(parseInt($(this).val()), NOVA.features_selected()) != -1) {
            $(this).prop('checked', true);
          }
        });

        if(entry.service_type == 'Charter'){
          $('#job-end-date').removeClass('d-none');
          $('#recurrence_modal').addClass('d-none');
          $('#location-section').addClass('d-none');
          $('[name="pickupLocationH"]').val(true);
          $('[name="deliveryLocationH"]').val(true);
          NOVA.has_recurrence('false');
        }else{
          $('#job-end-date').addClass('d-none');
          $('#location-section').removeClass('d-none');          
          $('#job-end-time').removeClass('d-none');
          if(NOVA.locations().length > 0){
            $('[name="pickupLocationH"]').val(true);
            $('[name="deliveryLocationH"]').val(true);
          }else{
            $('[name="pickupLocationH"]').val('');
            $('[name="deliveryLocationH"]').val('');
          }
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
  }

  NOVA.vehicleChangeEvent = function(data, e){
    if(NOVA.selected_vehicle_type() == data.vehicle_type_id){
      NOVA.tonnage(NOVA.selected_tonnage());
      NOVA.cubic_meter(NOVA.selected_cubic_meter());
      NOVA.pallet(NOVA.selected_pallet());
      NOVA.cartons(NOVA.selected_cartons());
    }else{
      NOVA.vehicles_list().forEach(function(entry) {
        if(entry.vehicle_type_id == data.vehicle_type_id){
          NOVA.tonnage(entry.limit_tonnage);
          NOVA.cubic_meter(entry.limit_cc);
          NOVA.pallet(entry.limit_pellet);
          NOVA.cartons(entry.limit_carton);
        }
      })
    }    
  }

  NOVA.uploadDocumentEvent = function(data, e){
    $(e.target).closest('.input-group').find('input[type="text"].form-control').val(e.target.files[0].name)
    document1 = e.target.files[0];
    data.doc_file(e.target.files[0].name);
    if(data.document_id() == ''){
      data.doc_name(e.target.files[0].name);
      $(e.target).closest('.document-name').text(e.target.files[0].name)
    }
    data.type('new');
    NOVA.document_files.push(document1);

    if(data.is_mandatory() == 'false'){
      $(e.target).parent().addClass('d-none');
      $(e.target).parent().next('.delete-btn').removeClass('d-none');
    }
  }

  NOVA.addDocumentEvent = function(){
    var document1 = new documentInput();
    d = {
      order_doc_id : '',
      document_id : '',
      doc_name : '',
      doc_file : '',
      is_mandatory : 'false',
      type : 'new',
    }
    document1.fill(d);
    NOVA.documents_list.push(document1);
  }

  NOVA.deleteDocumentEvent = function(data, e){
    if(NOVA.document_files().indexOf(data.doc_file) > -1){
      NOVA.document_files().splice(NOVA.document_files().indexOf(data.doc_file), 1);
    }    
    NOVA.documents_list.remove(data);
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
  }

  NOVA.financeCheckEvent = function(data, e){
    if($(e.target).is(":checked")){
      data.is_selected = 'true';
    }else{
      data.is_selected = 'false';
    }
  }

  NOVA.periodicityCheckEvent = function(data, e){
    if(data.name == 'Daily'){
      $('#month-list').addClass('d-none');
      $('#week-list').addClass('d-none');
      $('#day-list').addClass('d-none');
      $('#end-date').removeClass('d-none');
    }else if(data.name == 'Weekly'){
      $('#month-list').addClass('d-none');
      $('#week-list').addClass('d-none');
      $('#day-list').removeClass('d-none');
      $('#end-date').removeClass('d-none');
    }else if(data.name == 'Monthly'){
      $('#month-list').addClass('d-none');
      $('#week-list').removeClass('d-none');
      $('#day-list').removeClass('d-none');
      $('#end-date').removeClass('d-none');
    }else if(data.name == 'Yearly'){
      $('#month-list').removeClass('d-none');
      $('#week-list').removeClass('d-none');
      $('#day-list').removeClass('d-none');
      $('#end-date').removeClass('d-none');
    }
  }

  NOVA.saveRecurrenceClick = function(){
    NOVA.has_recurrence('true');
    $('#recurrenceModal').modal('hide');
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

  NOVA.updateOrderConfig = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('order_name', NOVA.order_name());
    formdata.append('order_id', NOVA.order_id());
    formdata.append('order_type', NOVA.order_type());
    formdata.append('client_id', NOVA.client_id());
    formdata.append('contact_person_id', NOVA.contact_person_id());
    formdata.append('contact_number', NOVA.contact_number());
    formdata.append('contact_email', NOVA.contact_email());
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
    formdata.append('documents', ko.toJSON(NOVA.documents_list()));
    if (NOVA.document_files().length){
      $.each(NOVA.document_files(), function(i, file) {
        formdata.append('document_files', file);
      });
    }
    formdata.append('finance_selected', ko.toJSON(NOVA.finance_list()));
    formdata.append('has_recurrence', NOVA.has_recurrence());
    formdata.append('recurrence_name', NOVA.recurrence_name());
    var recurrence_period = $("input[name='period']:checked").val();
    formdata.append('recurrence_period', recurrence_period);
    formdata.append('recurrence_month', $('#recurrence_month').val());
    formdata.append('recurrence_week', $('#recurrence_week').val());
    formdata.append('recurrence_day', $('#recurrence_day').val());
    formdata.append('recurrence_enddate', NOVA.recurrence_enddate());
    formdata.append('job_end_time', $('#job_end_time').val());
    $.ajax({
      method: 'POST',
      url: '/api/order/order/config/update',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.showToast(d);
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

  $('input[name="jobEndTime"]').datetimepicker({
    format: 'LT'
  });

})(this);