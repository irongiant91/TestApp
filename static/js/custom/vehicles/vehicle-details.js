  (function (window) {

  var locations, map, mapOptions, infowindow, markers, mapIcon, swiper, markerUrl, bounds

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

  NOVA.fitBoundsToVisibleMarkers = function () {
    bounds = new google.maps.LatLngBounds();
    for (var i=0; i<markers.length; i++) {
      if(markers[i].getVisible()) {
        bounds.extend( markers[i].getPosition() );
      }
    }
    map.fitBounds(bounds);
  }

  NOVA.initMap = function(){
    // locations = []
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

    map = new google.maps.Map(document.getElementById("mapView"), mapOptions);

    infowindow =  new google.maps.InfoWindow({
      content: ''
    });

    markers = []

    for (i = 0; i < NOVA.locations().length; i++) {
      // size=63;
      size = 32
      
      mapIcon = new google.maps.MarkerImage('/static/images/marker1.png',           
        new google.maps.Size(size, size),
        new google.maps.Point(0,0),
        new google.maps.Point(size/4, size/4)
      )

      markers[i] = new google.maps.Marker({
        map: map,
        title: NOVA.locations()[i].title,
        position: new google.maps.LatLng(NOVA.locations()[i].lat, NOVA.locations()[i].lng),           
        icon: mapIcon
      });

      NOVA.bindInfoWindow(markers[i], map, infowindow, NOVA.locations()[i].title, NOVA.locations()[i].title);  
    }

    NOVA.fitBoundsToVisibleMarkers()
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

  NOVA.vehicle_id = ko.observable('');
  NOVA.vehicle_name = ko.observable('');
  NOVA.registration_id = ko.observable('');
  NOVA.device_id = ko.observable('');
  NOVA.date_of_purchase = ko.observable(''); 
  NOVA.vehicle_type_id = ko.observable('');
  NOVA.vehicle_image = ko.observable('');
  NOVA.is_active = ko.observable('');
  NOVA.status = ko.observable('');
  NOVA.vehicle_features = ko.observableArray([]);

  NOVA.deviceIdsList = ko.observableArray([]);
  NOVA.vehicleTypesList = ko.observableArray([]);
  NOVA.vehicleFeaturesList = ko.observableArray([]);
  

  NOVA.getCuteTrackdevices = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/vehicle/get/cutetrack/device/ids',
      data: {'type':'edit', 'vehicle_id': NOVA.vehicle_id()},
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.deviceIdsList([]);
      for (i = 0; i < d.length; i++) {
        NOVA.deviceIdsList.push(d[i]);
      }
      NOVA.vehicleTypeFeatureListGet();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.vehicleTypeFeatureListGet = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/vehicle/get/vehicle/types/list',
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.vehicleTypesList([]);     
      NOVA.vehicleFeaturesList([]);   
      for(i = 0; i < d.types.length; i++) {
        NOVA.vehicleTypesList.push(d.types[i]);
      }
      for(i = 0; i < d.features.length; i++) {
        NOVA.vehicleFeaturesList.push(d.features[i]);
      }
      // NOVA.init();
      NOVA.vehicleDetailsGet();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.vehicleDetailsGet = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/vehicle/get/vehicle/details',
      data: {'vehicle_id': NOVA.vehicle_id()},
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.vehicle_name(d.name);
      NOVA.registration_id(d.registration_id);
      NOVA.device_id(d.device_id);
      NOVA.vehicle_type_id(d.vehicle_type_id);
      NOVA.date_of_purchase(d.purchase_date);
      NOVA.vehicle_image(d.vehicle_image);
      NOVA.is_active(d.is_active);
      if(d.allow_vehicle_delete == false){
        $('#delete-btn').hide();
      }

      for(i = 0; i < d.vehicle_features.length; i++) {
        NOVA.vehicle_features.push(d.vehicle_features[i]);
      }
      $('#vehicleFeature').trigger('change');
      $('#deviceId').val(NOVA.device_id()).trigger('change');
      $('#vehicleType').val(NOVA.vehicle_type_id()).trigger('change');

      NOVA.locations = ko.observable([{
        title: "Vehicle Location",
        lat: d.lat,
        lng: d.lng,
        type: "Pickup Location"
      }])

      NOVA.initMap();

      NOVA.getVehicleBookingDetails();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.editBtnClick = function(){
    $('#vehicle-details').find('.form-control').removeAttr('disabled');
    $('#edit-btn').addClass('d-none');
    $('#save-btn').removeClass('d-none');
  }

  NOVA.init = function () {
    $('#deviceId').select2({
      width: '100%',
      placeholder: '',
      dropdownPosition: 'above'
    });

    $('#vehicleType').select2({
      width: '100%',
      placeholder: '',
      dropdownPosition: 'above'
    });

    jQuery.validator.addMethod("dollarsscents", function (value, element) {
      return this.optional(element) || /^\d{0,8}(\.\d{0,2})?$/i.test(value);
    }, "Maximum 8 digit and 2 decimal place ");

    jQuery.validator.addMethod("noSPace", function(value, element) {
        return this.optional(element) || /^[a-z0-9]/i.test(value);
    }, "First space is not allowed");

    createvehicleFormValidator = $("#createvehicleForm").validate({
      errorElement: 'span',
      errorClass: 'error text-danger',
      errorPlacement: function (error, element) {
        if (element.parent().hasClass("input-group")) {
          error.appendTo(element.parent().parent());
        } else {
          error.appendTo(element.parent());
        }
      },
      rules: {
        vehicleName: {
          required: true,
          noSPace: true
        },
        registrationId: {
          required: true,
        },
        deviceId: {
          required: true,
        },
        purchaseDate: {
          required: true,
        },
        vehicleType: {
          required: true,
        },
        vehicleFeature: {
          required: true,
        },  
      },
      messages: {
        vehicleName: {
          required: "Please enter vehicle name"
        },
        registrationId: {
          required: "Please enter registration Id"
        },
        deviceId: {
          required: "Please select device Id"
        },
        purchaseDate: {
          required: "Please select date of purhase"
        },
        vehicleType: {
          required: "Please select vehicle type"
        },
        vehicleFeature: {
          required: "Please select vehicle feature"
        },
      },
      submitHandler: function () {
        NOVA.editVehicleDetails();
      }
    });
  }

  NOVA.editVehicleDetails = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('vehicle_id', NOVA.vehicle_id());
    formdata.append('vehicle_name', NOVA.vehicle_name());
    formdata.append('registration_id', NOVA.registration_id());
    formdata.append('device_id', NOVA.device_id());
    formdata.append('date_of_purchase', NOVA.date_of_purchase());
    formdata.append('vehicle_type_id', NOVA.vehicle_type_id());
    formdata.append('vehicle_features', NOVA.vehicle_features());
    $.ajax({
      method: 'POST',
      url: '/api/vehicle/edit/vehicle/details',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.showToast(d)
      NOVA.vehicleDetailsGet();
      $('#vehicle-details').find('.form-control').attr('disabled','disabled');
      $('#edit-btn').removeClass('d-none');
      $('#save-btn').addClass('d-none');
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.deleteBtnClick = function(){
    $('#confirmModal').modal('show');
  }

  NOVA.deleteVehicle = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('vehicle_id', NOVA.vehicle_id());
    $.ajax({
      method: 'POST',
      url: '/api/vehicle/delete/vehicle',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.showToast(d)
      window.location = '/vehicles';
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.disableVehicle = function(){
    NOVA.status('false');
    NOVA.updateVehhicleStatus();
  }

  NOVA.enableVehicle = function(){
    NOVA.status('true');
    NOVA.updateVehhicleStatus();
  }

  NOVA.updateVehhicleStatus = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('vehicle_id', NOVA.vehicle_id());
    formdata.append('status', NOVA.status());
    $.ajax({
      method: 'POST',
      url: '/api/vehicle/update/vehicle/status',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.showToast(d)
      NOVA.vehicleDetailsGet();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.closeSidebarRight();
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.getVehicleBookingDetails = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/vehicle/get/vehicle/booking/details',
      data: {'vehicle_id': NOVA.vehicle_id()},
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.vehicleBooking(d.whole_list);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.vehicleBooking = function(data){
    var chart = c3.generate({
      bindto: "#totalInvoice",
      padding: {
        right: 20,
        left: 30,
      },
      data: {
        columns: data[1],
        type: 'spline',
        colors: {
          'Completed': '#4c9fe5',
          'InProgress': '#25396e',
        },
      },
      axis: {
        y: {
          show: true,
          label: 'No of Orders'
        },
        x: {
          type: 'category',
          categories: data[0],
          tick: {
            fit: true,
            format: "%b"
          },
          culling: {
            max: 4 // the number of tick texts will be adjusted to less than this value
          },
        },
      },
      point: {
        r: 7,
      },
      legend: {
        show: true
      }
    });
  }

})(this);
  
function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    $('#navItemVehicles').addClass('active');
    NOVA.init();
    var docUrlArr = document.URL.split('/');
    var vehicle_id = docUrlArr[docUrlArr.length - 2];
    NOVA.vehicle_id(vehicle_id);
    NOVA.getCuteTrackdevices();
    ko.applyBindings(NOVA);
  }
}

document.onreadystatechange = init;