(function (window) {

  NOVA.propertyName = ko.observable('');
  NOVA.description = ko.observable('');
  NOVA.serviceFee = ko.observable('');
  NOVA.isEdit = ko.observable(false);
  NOVA.propId = ko.observable(0);
  NOVA.pageSearch = ko.observable('');

  NOVA.current_page = ko.observable(1);
  NOVA.page_count = ko.observable('');
  NOVA.pages_list = ko.observableArray([]);
  NOVA.propList = ko.observableArray([]);

  NOVA.profileImageVisibility = ko.observable(false);

  jQuery.validator.addMethod("dollarsscents", function (value, element) {
    return this.optional(element) || /^\d{0,8}(\.\d{0,2})?$/i.test(value);
  }, "Maximum 8 digit and 2 decimal place ");

  jQuery.validator.addMethod("noSPace", function(value, element) {
        return this.optional(element) || /^[a-z0-9]/i.test(value);
    }, "First space is not allowed");

  var createvehiclePropertyFormValidator = $("#createvehiclePropertyForm").validate({
    errorElement: 'span',
    errorClass: 'error text-danger',
    errorPlacement: function(error, element) {
      if (element.parent().hasClass("input-group")) {
        error.appendTo( element.parent().parent());
      } else {
        error.appendTo( element.parent());
      }
    },
    rules: {
      propertyName: {
        required: true,
        noSPace: true,
      },
      propertyDescription: {
        required: true,
        noSPace: true
      },
      serviceFee: {
        required: true,
        number: true,
        dollarsscents: true
      },
    },
    messages: {
      propertyName: {
        required: "Please enter feature name"
      },
      propertyDescription: {
        required: "Please enter feature description"
      },
      serviceFee: {
        required: "Please enter service fee",
        number: "Please enter a valid number"
      }
    },
    submitHandler: function() {
      if(!NOVA.isEdit()) {
        NOVA.createVehicleProperty();
      } else {
        NOVA.editVehicleProperty();
      }
    }
  });

  NOVA.openSidebarRight = function(){
    NOVA.isEdit(false);
    createvehiclePropertyFormValidator.resetForm()
    $("body").addClass("sidebar-right-open")
    NOVA.resetPropForm();
  }

  NOVA.openSidebarRightSystem = function(){
    createvehiclePropertyFormValidator.resetForm()
    $("body").addClass("sidebar-right-open")
  }

  NOVA.closeSidebarRight = function(){
    createvehiclePropertyFormValidator.resetForm()
    $("body").removeClass("sidebar-right-open")
  }

  NOVA.resetPropForm = function() {
    NOVA.isEdit(false);
    $('#createvehiclePropertyForm').each(function(){
      this.reset();
    });
  }

  NOVA.createVehicleProperty = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    
    formdata.append('property_name', NOVA.propertyName());
    formdata.append('description', NOVA.description());
    formdata.append('service_charge', NOVA.serviceFee());

    $.ajax({
      method: 'POST',
      url: '/api/admin/vehicle/property/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
      xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.showToast(d);
      NOVA.closeSidebarRight();
      NOVA.getProperties();
      NOVA.propertyName('');
      NOVA.description('');
      NOVA.serviceFee('');
      NOVA.isEdit(false);
      // $('#createvehiclePropertyForm').each(function(){
      //   this.reset();
      // });
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.closeSidebarRight();
      $('#errorMessage').text(jqXHR.responseJSON);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  } 

  NOVA.editVehicleProperty = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    
    formdata.append('prop_id', NOVA.propId());
    formdata.append('property_name', NOVA.propertyName());
    formdata.append('description', NOVA.description());
    formdata.append('service_charge', NOVA.serviceFee());

    $.ajax({
      method: 'POST',
      url: '/api/admin/vehicle/property/edit',
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
      NOVA.closeSidebarRight();
      NOVA.propertyName('');
      NOVA.description('');
      NOVA.serviceFee('');
      NOVA.isEdit(false);
      NOVA.getProperties();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.closeSidebarRight();
      $('#errorMessage').text(jqXHR.responseJSON);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.confirmDeleteProperty = function(data){
    $("#confirmModal").modal('show')
    NOVA.propId(data.prop_id)
  }

  NOVA.deleteProperty = function(data){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    
    formdata.append('prop_id', NOVA.propId());

    $.ajax({
      method: 'POST',
      url: '/api/admin/vehicle/property/delete',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
      $("#confirmModal").modal('hide')
      NOVA.showLoading();
      xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.showToast(d)
      NOVA.getProperties();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.closeSidebarRight();
      $('#errorMessage').text(jqXHR.responseJSON);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.changeStatus = function(data){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    
    formdata.append('prop_id', data.prop_id);
    formdata.append('status', data.status);

    $.ajax({
      method: 'POST',
      url: '/api/admin/vehicle/property/status/change',
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
      NOVA.getProperties();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.closeSidebarRight();
      $('#errorMessage').text(jqXHR.responseJSON);
      $('.error-modal').modal('show');
      NOVA.getProperties();
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.search = function() {
    NOVA.current_page(1);
    NOVA.getProperties();
  }

  NOVA.getProperties = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/vehicle/properties/get',
      data:{'search_term':$('#search-input').val(),'page_number': NOVA.current_page()},
      dataType: 'json',
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.propList([]);
      for(var i = 0; i < d.data.length; i++) {
        NOVA.propList.push(d.data[i]);
      }
      NOVA.page_count(d.page_count);
      NOVA.refreshPagination();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseText);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.getPropertyDetail = function (data) {
    NOVA.openSidebarRightSystem();
    NOVA.isEdit(true);
    NOVA.propId(data.prop_id);
    NOVA.propertyName(data.prop_name);
    NOVA.description(data.description);
    NOVA.serviceFee(data.service_charge);
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
      NOVA.getProperties();
    }
  };

  NOVA.getNextPage = function(){
    if(NOVA.current_page() != NOVA.page_count()){
      NOVA.current_page(NOVA.current_page() + 1);
      NOVA.getProperties();
    }
  };

  NOVA.onPageClick = function(pageno){
    NOVA.current_page(pageno);
    NOVA.getProperties();
  };

  NOVA.getFirstPage = function(){
    NOVA.current_page(1);
    NOVA.getProperties();
  }
  NOVA.getLastPage = function(){
    NOVA.current_page(NOVA.page_count());
    NOVA.getProperties();
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
    NOVA.getProperties();
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
    NOVA.hideLoading();
    NOVA.getAppLogo();
    ko.applyBindings(NOVA);
    NOVA.getProperties();
  }
}
document.onreadystatechange = init;