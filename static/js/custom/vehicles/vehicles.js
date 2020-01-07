(function (window) {

  NOVA.vehicle_name = ko.observable('');
  NOVA.registration_id = ko.observable('');
  NOVA.device_id = ko.observable('');
  NOVA.date_of_purchase = ko.observable('');
  NOVA.vehicle_type_id = ko.observable('');
  NOVA.vehicle_features = ko.observableArray([]);
  NOVA.current_page = ko.observable(1);
  NOVA.page_count = ko.observable('');
  NOVA.search_term = ko.observable('');
  NOVA.pageSearch = ko.observable('');
  NOVA.status = ko.observable('');
  NOVA.selected_vehicle_id = ko.observable('');

  NOVA.deviceIdsList = ko.observableArray([]);
  NOVA.vehicleTypesList = ko.observableArray([]);
  NOVA.vehicleFeaturesList = ko.observableArray([]);
  NOVA.vehiclesList = ko.observableArray([]);
  NOVA.pages_list = ko.observableArray([]);

  NOVA.getCuteTrackdevices = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/vehicle/get/cutetrack/device/ids',
      data: {'type':'create'},
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
      for(i = 0; i < d.types.length; i++) {
        NOVA.vehicleTypesList.push(d.types[i]);
      }
      NOVA.vehicleFeaturesList([]);      
      for(i = 0; i < d.features.length; i++) {
        NOVA.vehicleFeaturesList.push(d.features[i]);
      }
      NOVA.init();
      $('.sidebar-right-overlay .card').scrollTop(0);
      // createvehiclePropertyForm.resetForm()
      $("body").addClass("sidebar-right-open") 
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.openSidebarRight = function () {       
    NOVA.getCuteTrackdevices();
  }

  NOVA.closeSidebarRight = function () {
    createvehiclePropertyFormValidator.resetForm()
    NOVA.vehicle_name('');
    NOVA.registration_id('');
    NOVA.device_id('');
    NOVA.date_of_purchase('');
    NOVA.vehicle_type_id('');
    $('.upload-label').text('');
    $('#uploadPicture').val('');
    $('#deviceId').val('').trigger('change');
    $('#vehicleType').val('').trigger('change');
    $("body").removeClass("sidebar-right-open")
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

    createvehiclePropertyFormValidator = $("#createvehiclePropertyForm").validate({
      ignore: "",
      errorElement: 'span',
      errorClass: 'error text-danger',
      errorPlacement: function (error, element) {
        if (element.parent().parent().parent().hasClass("vehicle-type")) {
          error.appendTo(element.parent().parent().parent());
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
          noSPace: true
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
        uploadFile: {
          required: true,
        }
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
        uploadFile: {
          required: "Please upload vehicle image"
        }
      },
      submitHandler: function () {
        NOVA.createVehicle();
      }
    });
  }

  NOVA.createVehicle = function () {
    if($("#uploadPicture")[0].files[0] != undefined){
      document1 = $("#uploadPicture")[0].files[0];
      var csrftoken = NOVA.getCookie('csrftoken');
      var formdata = new FormData();
      formdata.append('vehicle_name', NOVA.vehicle_name());
      formdata.append('registration_id', NOVA.registration_id());
      formdata.append('device_id', NOVA.device_id());
      formdata.append('date_of_purchase', NOVA.date_of_purchase());
      formdata.append('vehicle_type_id', NOVA.vehicle_type_id());
      formdata.append('vehicle_image', document1);
      formdata.append('vehicle_features', NOVA.vehicle_features());
      $.ajax({
        method: 'POST',
        url: '/api/vehicle/vehicle/create',
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
        NOVA.closeSidebarRight();
        NOVA.vehiclesListGet();
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        // NOVA.closeSidebarRight();
        $('.sidebar-right-overlay').css('z-index', 1049);
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
      })
      .always(function () {
        NOVA.hideLoading();
      })
    }
  }

  NOVA.vehiclesListGet = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/vehicle/get/vehicles/list',
      data:{'search_term':$('#search-input').val(),'page_number': NOVA.current_page()},
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.vehiclesList([]);      
      for(i = 0; i < d.vehicles_list.length; i++) {
        NOVA.vehiclesList.push(d.vehicles_list[i]);
      }
      NOVA.page_count(d.page_count);
      NOVA.refreshPagination();
      NOVA.pageSearch('');
      if(NOVA.vehiclesList().length) {
        $('.card-data-empty').addClass('d-none');
      }
      else{
        $('.card-data-empty').removeClass('d-none');
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.refreshPagination = function(){
    var max = NOVA.current_page() + 2;
    if(max > NOVA.page_count())
        max = NOVA.page_count();
    var min = max - 4;
    if(min < 1)
        min = 1;
    NOVA.pages_list([]);
    for(i=min;i<=max;i++){
      NOVA.pages_list.push(i);
    }
  };

  NOVA.getPrevPage = function(){
    if(NOVA.current_page() != 1){
      NOVA.current_page(NOVA.current_page() - 1);
      NOVA.vehiclesListGet();
    }
  };

  NOVA.getNextPage = function(){
    if(NOVA.current_page() != NOVA.page_count()){
      NOVA.current_page(NOVA.current_page() + 1);
      NOVA.vehiclesListGet();
    }
  };

  NOVA.onPageClick = function(pageno){
    NOVA.current_page(pageno);
    NOVA.vehiclesListGet();
  };

  NOVA.getFirstPage= function(){
    NOVA.current_page(1);
    NOVA.vehiclesListGet();
  };

  NOVA.getLastPage= function(){
    NOVA.current_page(NOVA.page_count());
    NOVA.vehiclesListGet();
  };

  NOVA.pageSearchGo = function(data, e){
    if (NOVA.pageSearch() > NOVA.page_count()){
      NOVA.current_page(NOVA.page_count());
      NOVA.pageSearch(NOVA.page_count());
    }else{
      if (NOVA.pageSearch() != ''){
        NOVA.current_page(NOVA.pageSearch());
      }
    }
    NOVA.vehiclesListGet();
  }

  NOVA.searchKey = function(){
    NOVA.current_page(1);
    NOVA.search_term($('#search-input').val());
    NOVA.vehiclesListGet();
  }

  NOVA.disableVehicle = function(data, e){
    NOVA.status('false');
    NOVA.selected_vehicle_id(data.id);
    NOVA.updateVehhicleStatus();
  }

  NOVA.enableVehicle = function(data, e){
    NOVA.status('true');
    NOVA.selected_vehicle_id(data.id);
    NOVA.updateVehhicleStatus();
  }

  NOVA.updateVehhicleStatus = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('vehicle_id', NOVA.selected_vehicle_id());
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
      NOVA.vehiclesListGet();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.closeSidebarRight();
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.redirectToDetails = function(data, e){
    window.open('/vehicle/'+data.id+'/details');
  }

  $(document).on('mouseover', '.overflow-fix', function(event) {
    event.preventDefault();
    var _this = $(this);
    $('.overflow-data').remove();
    _this.css('text-overflow', 'initial');
    if(_this[0].scrollWidth > _this.outerWidth()) {
      if(_this.parent().find('.overflow-data').length == 0) {
        var getPos = _this.offset()
        var tableOffset =_this.parent().css('position', 'relative').offset()
        var finalTop = getPos.top - tableOffset.top-1
        var finalLeft = getPos.left - tableOffset.left
        if(_this.hasClass('elm-overflow')) {
          var getObj = _this.clone(false).removeClass('overflow-fix').addClass('overflow-data').removeAttr('style');
          getObj.css({'left': (finalLeft), 'top':(finalTop)});
          _this.parent().append(getObj)
        } else {
          var getVal = _this.html()
          _this.parent().append(`<span class="overflow-data" style="left:`+(finalLeft-4)+`px; top: `+(finalTop-1)+`px;">`+getVal+`</span>`)
        }
      }
      setTimeout(function() {
        _this.parent().find('.overflow-data').css('opacity', 1);
      }, 0);
      _this.css('text-overflow', 'ellipsis');
    }
  });

  $(document).on('mouseout', '.overflow-data', function(event) {
    var _this = $(this);
    _this.parent().find('.overflow-fix').css('text-overflow', 'ellipsis');
    _this.css('opacity', 0);
    setTimeout(function() {
     _this.remove();
   }, 300);
  });  

})(this);

function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    $('#navItemVehicles').addClass('active');
    NOVA.getAppLogo();
    NOVA.vehiclesListGet();
    ko.applyBindings(NOVA);

  }
}
document.onreadystatechange = init;