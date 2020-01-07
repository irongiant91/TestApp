(function (window) {

  NOVA.vehicleType = ko.observable('');
  NOVA.vehicleDescription = ko.observable('');
  NOVA.tonnage = ko.observable('');
  NOVA.cubicMeter = ko.observable('');
  NOVA.pallets = ko.observable('');
  NOVA.carton = ko.observable('');
  NOVA.driverAttributesList = ko.observableArray([]);
  NOVA.selectedDriverAttributes = ko.observableArray([]);
  NOVA.vehicleTypesList = ko.observableArray([]);
  NOVA.editMode = ko.observable(0);
  NOVA.vehicletype_id = ko.observable('');
  NOVA.permissions_list = ko.observable('');
  NOVA.current_page = ko.observable(1);
  NOVA.page_count = ko.observable('');
  NOVA.pages_list = ko.observableArray([]);
  NOVA.search_term = ko.observable('');
  NOVA.pageSearch = ko.observable('');


  NOVA.driverAttributes = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/vehicle/attributes/get',
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
      .done(function (d, textStatus, jqXHR) {
        NOVA.driverAttributesList([]);
        for (let i = 0; i < d.length; i++) {
          NOVA.driverAttributesList.push(d[i]);
        }
        NOVA.vehicleTypeListGet();
        console.log(NOVA.driverAttributesList())
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
      })
      .always(function () {
        NOVA.hideLoading();
      })
  }

  NOVA.createVehicleType = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('vehicle_type', NOVA.vehicleType());
    formdata.append('vehicle_description', NOVA.vehicleDescription());
    formdata.append('tonnage', NOVA.tonnage());
    formdata.append('cubic_meter', NOVA.cubicMeter());
    formdata.append('pallets', NOVA.pallets());
    formdata.append('carton', NOVA.carton());
    formdata.append('attributes', NOVA.selectedDriverAttributes());
    $.ajax({
      method: 'POST',
      url: '/api/admin/vehicle/type/create',
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
        NOVA.vehicleTypeListGet();
        NOVA.closeSidebarRight();
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        NOVA.closeSidebarRight();
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
      })
      .always(function () {
        NOVA.hideLoading();
      })
  }

  NOVA.editVehicleType = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('vehicle_type_id', NOVA.vehicletype_id());
    formdata.append('vehicle_type', NOVA.vehicleType());
    formdata.append('vehicle_description', NOVA.vehicleDescription());
    formdata.append('tonnage', NOVA.tonnage());
    formdata.append('cubic_meter', NOVA.cubicMeter());
    formdata.append('pallets', NOVA.pallets());
    formdata.append('carton', NOVA.carton());
    formdata.append('attributes', NOVA.selectedDriverAttributes());
    $.ajax({
      method: 'POST',
      url: '/api/admin/vehicle/type/edit',
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
        NOVA.vehicleTypeListGet();
        NOVA.closeSidebarRight();
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        NOVA.closeSidebarRight();
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
      })
      .always(function () {
        NOVA.hideLoading();
      })

  }

  NOVA.vehicleTypeDetails = function (data) {
    NOVA.editMode(1);
    NOVA.vehicletype_id(data.id)
    NOVA.openSidebarRight();
    NOVA.vehicleType(data.type_name)
    NOVA.vehicleDescription(data.description)
    NOVA.tonnage(data.tonnage)
    NOVA.cubicMeter(data.cubic_meter)
    $('#driverPropertyReqirement').val(data.attributes).trigger('change');
    NOVA.carton(data.carton)
    NOVA.pallets(data.pallet)
  }

  NOVA.vehicleTypeListGet = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/vehicle/type/list/get',
      data: {'search_term' : $('#search-input').val(), 'page_number': NOVA.current_page()},
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
      .done(function (d, textStatus, jqXHR) {
        NOVA.vehicleTypesList([]);
        if (d.data.length < 1){
          NOVA.current_page(NOVA.current_page() - 1);
          NOVA.vehicleTypeListGet();
        }
        for (let i = 0; i < d.data.length; i++) {
          NOVA.vehicleTypesList.push(d.data[i]);
        }
        NOVA.page_count(d.page_count);
        NOVA.refreshPagination();
        NOVA.pageSearch('');
        $('[data-toggle="tooltip"]').each(function() {
          if($(this).attr('title') != '') {
            $(this).tooltip({ boundary: 'window' })
          } else {
            var vals = $(this).parent().find('.forTollTip').html();
            $(this).attr('title',vals)
            $(this).tooltip({ boundary: 'window' })
          } 
        })

      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
      })
      .always(function () {
        NOVA.hideLoading();
      })
  }

  NOVA.changeStatus = function(data){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('id', data.id)
    formdata.append('status', data.status)
    $.ajax({
      method: 'POST',
      url: '/api/admin/vehicle/type/status/change',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
      .done( function (d, textStatus, jqXHR) {
        NOVA.showToast(d)
        NOVA.vehicleTypeListGet();
      })
      .fail( function (jqXHR, textStatus, errorThrown) {
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
        NOVA.vehicleTypeListGet();
      })
      .always(function(){
        NOVA.hideLoading();
      })
  }


  NOVA.confirmDeleteVehicleType = function(data){
    $("#confirmModal").modal('show')
    NOVA.vehicletype_id(data.id)
  }

  NOVA.deleteVehicleType = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('id', NOVA.vehicletype_id())
    $.ajax({
      method: 'POST',
      url: '/api/admin/vehicle/type/delete',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        $("#confirmModal").modal('hide');
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
      .done( function (d, textStatus, jqXHR) {
        NOVA.showToast(d)
        NOVA.vehicleTypeListGet();
      })
      .fail( function (jqXHR, textStatus, errorThrown) {
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
        NOVA.vehicleTypeListGet();
      })
      .always(function(){
        NOVA.hideLoading();
      })
  }

  NOVA.openSidebarRight = function () {
    // $('[name="vehicleType"]').focus();
    $('.sidebar-right-overlay .card').scrollTop(0);
    // $("#containerDiv").animate({ scrollTop: 0 }, "fast");

    createvehiclePropertyFormValidator.resetForm()
    $("body").addClass("sidebar-right-open")
    NOVA.selectedDriverAttributes([]);
  }

  NOVA.closeSidebarRight = function () {
    createvehiclePropertyFormValidator.resetForm()
    NOVA.vehicleType('');
    NOVA.vehicleDescription('');
    NOVA.tonnage('');
    NOVA.cubicMeter('');
    NOVA.pallets('');
    NOVA.carton('');
    NOVA.selectedDriverAttributes([]);
    $('#driverPropertyReqirement').val('').trigger('change');
    $("body").removeClass("sidebar-right-open")
    NOVA.editMode(0);
  }

  NOVA.init = function () {
    $('#driverPropertyReqirement').select2({
      width: '100%',
      // tags: true,
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
        vehicleType: {
          required: true,
          noSPace: true
        },
        vehicleDescription: {
          required: true,
          noSPace: true
        },
        tonnage: {
          number: true,
          digits: true,
          maxlength: 9,
          noSPace: true
        },
        cubicMeter: {
          number: true,
          digits: true,
          maxlength: 9,
          noSPace: true
        },
        pallets: {
          number: true,
          digits: true,
          maxlength: 9,
          noSPace: true
        },
        carton: {
          number: true,
          digits: true,
          maxlength: 9,
          noSPace: true
        },
      },
      messages: {
        vehicleType: {
          required: "Please enter vehicle name"
        },
        vehicleDescription: {
          required: "Please enter vehicle description"
        },
        tonnage: {
          maxlength: "Please enter value with less than 10 digits"
        },
        cubicMeter: {
          maxlength: "Please enter value with less than 10 digits"
        },
        pallets: {
          maxlength: "Please enter value with less than 10 digits"
        },
        cartons: {
          maxlength: "Please enter value with less than 10 digits"
        }
      },
      submitHandler: function () {
        if (NOVA.editMode()==0) {
          NOVA.createVehicleType();
        }
        else {
          NOVA.editVehicleType()
        }
      }
    });
  }

  NOVA.search = function() {
    NOVA.current_page(1);
    NOVA.vehicleTypeListGet();
  }

  NOVA.refreshPagination = function () {
    var max = NOVA.current_page() + 2;
    if (max > NOVA.page_count())
      max = NOVA.page_count();
    var min = max - 4;
    if (min < 1)
      min = 1;
    NOVA.pages_list([]);
    for (i = min; i <= max; i++) {
      NOVA.pages_list.push(i);
    }
  };

  NOVA.getPrevPage = function () {
    if (NOVA.current_page() != 1) {
      NOVA.current_page(NOVA.current_page() - 1);
      NOVA.vehicleTypeListGet();
    }
  };

  NOVA.getNextPage = function () {
    if (NOVA.current_page() != NOVA.page_count()) {
      NOVA.current_page(NOVA.current_page() + 1);
      NOVA.vehicleTypeListGet();
    }
  };

  NOVA.onPageClick = function (pageno) {
    NOVA.current_page(pageno);
    NOVA.vehicleTypeListGet();
  };

  NOVA.getFirstPage = function () {
    NOVA.current_page(1);
    NOVA.vehicleTypeListGet();
  }

  NOVA.getLastPage = function () {
    NOVA.current_page(NOVA.page_count());
    NOVA.vehicleTypeListGet();
  }

  NOVA.pageSearchGo = function(data, e){
    if (NOVA.pageSearch() > NOVA.page_count()){
      NOVA.current_page(NOVA.page_count());
      NOVA.pageSearch(NOVA.page_count());
    }else{
      if (NOVA.pageSearch() != ''){
        NOVA.current_page(NOVA.pageSearch());
      }
    }
    NOVA.vehicleTypeListGet();
  }

  $('#navItemAdmin').addClass('active');


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
    // NOVA.current_page(1);
    NOVA.hideLoading();
    NOVA.getAppLogo();
    NOVA.driverAttributes();
    NOVA.vehicleTypeListGet();
    NOVA.init();
    ko.applyBindings(NOVA);

  }
}
document.onreadystatechange = init;