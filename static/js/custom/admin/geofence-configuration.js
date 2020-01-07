(function (window) {

  NOVA.geofenceName = ko.observable('');
  NOVA.latitude = ko.observable('');
  NOVA.longitude = ko.observable('');
  NOVA.radius = ko.observable('');
  NOVA.geofenceList = ko.observableArray([]);
  NOVA.editMode = ko.observable(0);
  NOVA.geofence_id = ko.observable('');
  NOVA.current_page = ko.observable(1);
  NOVA.page_count = ko.observable('');
  NOVA.pages_list = ko.observableArray([]);
  NOVA.search_term = ko.observable('');
  NOVA.pageSearch = ko.observable('');

  NOVA.createGeofence = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('geofenceName', NOVA.geofenceName());
    formdata.append('latitude', NOVA.latitude());
    formdata.append('longitude', NOVA.longitude());
    formdata.append('radius', NOVA.radius());
    $.ajax({
      method: 'POST',
      url: '/api/admin/geofence/create',
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
        NOVA.geofenceListGet();
        NOVA.closeSidebarRight();
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        // NOVA.closeSidebarRight();
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
      })
      .always(function () {
        NOVA.hideLoading();
      })
  }

  NOVA.editGeofence = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('geofence_id', NOVA.geofence_id());
    formdata.append('geofenceName', NOVA.geofenceName());
    formdata.append('latitude', NOVA.latitude());
    formdata.append('longitude', NOVA.longitude());
    formdata.append('radius', NOVA.radius());
    $.ajax({
      method: 'POST',
      url: '/api/admin/geofence/edit',
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
        NOVA.geofenceListGet();
        NOVA.closeSidebarRight();
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        // NOVA.closeSidebarRight();
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
      })
      .always(function () {
        NOVA.hideLoading();
      })

  }

  NOVA.geofenceDetails = function (data) {
    NOVA.editMode(1);
    NOVA.geofence_id(data.id)
    NOVA.openSidebarRight();
    NOVA.geofenceName(data.name)
    NOVA.latitude(data.lat)
    NOVA.longitude(data.lng)
    NOVA.radius(data.hotspot_radius)
  }

  NOVA.confirmdelete = function(data){
    NOVA.geofence_id(data.id)
    $("#confirmModal").modal('show')
  }

  NOVA.deleteGeofence = function(data) {
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('geofence_id', NOVA.geofence_id());
    $.ajax({
      method: 'POST',
      url: '/api/admin/geofence/delete',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
      xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      $("#confirmModal").modal('hide')
      NOVA.showToast(d)
      NOVA.geofenceListGet();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseJSON);
      $('.error-modal').modal('show');
    })
    .always(function(){
      $("#confirmModal").modal('hide')
      NOVA.hideLoading();
    })
  }

  NOVA.geofenceListGet = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/geofence/configuration/list/get',
      data: {'search_term' : $('#search-input').val(), 'page_number': NOVA.current_page()},
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
      .done(function (d, textStatus, jqXHR) {
        NOVA.geofenceList([]);
        for (let i = 0; i < d.data.length; i++) {
          NOVA.geofenceList.push(d.data[i]);
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
    formdata.append('geofence_id', data.id)
    formdata.append('status', data.status)
    $.ajax({
      method: 'POST',
      url: '/api/admin/geofence/status/change',
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
        NOVA.geofenceListGet();
      })
      .fail( function (jqXHR, textStatus, errorThrown) {
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
        NOVA.geofenceListGet();
      })
      .always(function(){
        NOVA.hideLoading();
      })
  }

  NOVA.init = function () {
    jQuery.validator.addMethod("dollarsscents", function (value, element) {
      return this.optional(element) || /^\d{0,8}(\.\d{0,2})?$/i.test(value);
    }, "Maximum 8 digit and 2 decimal place ");

    jQuery.validator.addMethod("noSPace", function(value, element) {
        return this.optional(element) || /^[a-z0-9]/i.test(value);
    }, "First space is not allowed");

    jQuery.validator.addMethod("lat", function(value, element) {
        return this.optional(element) || /^(\+|-)?((\d((\.)|\.\d{1,6})?)|(0*?[0-8]\d((\.)|\.\d{1,6})?)|(0*?90((\.)|\.0{1,6})?))$/i.test(value);
    }, "Please enter valid latitude");

       jQuery.validator.addMethod("lng", function(value, element) {
        return this.optional(element) || /^(\+|-)?((\d((\.)|\.\d{1,6})?)|(0*?\d\d((\.)|\.\d{1,6})?)|(0*?1[0-7]\d((\.)|\.\d{1,6})?)|(0*?180((\.)|\.0{1,6})?))$/i.test(value);
    }, "Please enter valid longitude");



    creategeofenceValidator = $("#creategeofenceForm").validate({
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
        geofenceName: {
          required: true,
          noSPace: true
        },
        latitude: {
          required: true,
          lat: true
        },
        longitude: {
          required: true,
          lng: true
        },
        radius: {
          required: true,
          noSPace: true,
          digits: true
        }
      },
      messages: {
        geofenceName: {
          required: "Please enter geofence name"
        },
        latitude: {
          required: "Please enter valid latitude"
        },
        longitude: {
          required: "Please enter valid longitude"
        },
        radius: {
          required: "Please enter valid radius"
        }
      },
      submitHandler: function () {
        if (NOVA.editMode()==0) {
          NOVA.createGeofence();
        }
        else {
          NOVA.editGeofence()
        }
      }
    });
  }

  NOVA.openSidebarRight = function () {
    // $('[name="vehicleType"]').focus();
    $('.sidebar-right-overlay .card').scrollTop(0);
    // $("#containerDiv").animate({ scrollTop: 0 }, "fast");

    creategeofenceValidator.resetForm()
    $("body").addClass("sidebar-right-open")
  }

  NOVA.closeSidebarRight = function () {
    creategeofenceValidator.resetForm()
    NOVA.geofenceName('');
    NOVA.latitude('');
    NOVA.longitude('');
    NOVA.radius('');
    $("body").removeClass("sidebar-right-open")
    NOVA.editMode(0);
  }

  NOVA.search = function() {
    NOVA.current_page(1);
    NOVA.geofenceListGet();
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
      NOVA.geofenceListGet();
    }
  };

  NOVA.getNextPage = function () {
    if (NOVA.current_page() != NOVA.page_count()) {
      NOVA.current_page(NOVA.current_page() + 1);
      NOVA.geofenceListGet();
    }
  };

  NOVA.onPageClick = function (pageno) {
    NOVA.current_page(pageno);
    NOVA.geofenceListGet();
  };

  NOVA.getFirstPage = function () {
    NOVA.current_page(1);
    NOVA.geofenceListGet();
  }

  NOVA.getLastPage = function () {
    NOVA.current_page(NOVA.page_count());
    NOVA.geofenceListGet();
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
    NOVA.geofenceListGet();
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
    NOVA.init();
    NOVA.geofenceListGet();
    ko.applyBindings(NOVA);

  }
}
document.onreadystatechange = init;