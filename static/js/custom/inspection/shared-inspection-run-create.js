(function (window) {
  NOVA.inspection_name = ko.observable();
  NOVA.description = ko.observable();
  NOVA.inspection_id = ko.observable();
  NOVA.created_date = ko.observable();
  NOVA.inspection_report_id = ko.observable();
  NOVA.is_generated = ko.observable(false);
  NOVA.vehicle_id = ko.observable(false);
  NOVA.incompleted_inspection_exist = ko.observable(false);
  NOVA.generated_button_status = ko.observable(true);
  NOVA.unit_name = ko.observable('');
  NOVA.document_path = ko.observable('');
  NOVA.user_timezone = ko.observable('');
  NOVA.service_record_required = ko.observable('');
  NOVA.is_signature_required = ko.observable('');
  NOVA.inspector = ko.observable('');
  NOVA.inspection_uid = ko.observable('');
  NOVA.vehicle_registration = ko.observable('');
  
  NOVA.inspectionItemsLst = ko.observableArray([]);
  NOVA.preview_images = ko.observableArray([]);
  NOVA.files = ko.observableArray([]);
  NOVA.vehicle_lst = ko.observableArray([]);

  $(document).on( "click", ".action-panel .btn-icon", function(){
    $(".action-panel .btn-icon").removeClass( 'active' );
    if ($(this).hasClass( 'active' )){
      $(this).removeClass( 'active' );
    } else {
      $(this).addClass( 'active' );
    }
  })

  $(document).on( "click", ".action-panel .btn-group .btn", function(){
    $(".action-panel .btn-icon").removeClass( 'active' );
  } )

  $(document).on("click", function(e) {
    if ( $(".action-panel .btn-group, .action-panel .btn-icon").has(event.target).length == 0 && !$(".action-panel .btn-group").is(e.target) ){
      $(".action-panel .btn-icon").removeClass( 'active' );
    }
  });

    jQuery.validator.addMethod("noSPace", function(value, element) {
        return this.optional(element) || /^[a-z,0-9]/i.test(value);
    }, "First space is not allowed");

    var inspectionRunCreateValidator = $("#inspectionRunCreate").validate({
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
        vehicleId: {
          required: true,
        },
        vehicleRegistration : {
          required: true,
        },
      },
      messages: {
        vehicleId: {
          required: "Please select vehicle ID"
        },
        vehicleRegistration : {
          required: "Please select vehicle registration"
        },
      },
      submitHandler: function() {
        NOVA.inspectionReportSave()
      }
    });

  var inspection_item = function () {
    this.parent_item_id = ko.observable('');
    this.parent_item_name = ko.observable('');

    this.item_child_lst = ko.observableArray([]);

    this.fill = function (d) {
      this.parent_item_id('' || d.parent_item_id);
      this.parent_item_name('' || d.parent_item_name);

      for(var i=0;i<d.item_child_lst.length;i++){
        var child_item1 = new child_item();
        child_item1.fill(d.item_child_lst[i]);
        this.item_child_lst.push(child_item1);
      }
      
    }
  }

  var child_item = function () {
    this.child_item_id = ko.observable('');
    this.child_item_name = ko.observable('');
    this.item_status = ko.observable('');
    this.status_pass = ko.observable('');
    this.status_fail = ko.observable('');
    this.fail_description = ko.observable('');
    this.status_missing = ko.observable('');
    this.remarks = ko.observable('');
    this.button_name = ko.observable('');
    this.preview_images = ko.observableArray([]);
    this.images_lst = ko.observableArray([]);
    this.files = ko.observableArray([]);
    this.before_preview_images = ko.observableArray([]);
    this.before_images_lst = ko.observableArray([]);
    this.beforefiles = ko.observableArray([]);
    this.after_preview_images = ko.observableArray([]);
    this.after_images_lst = ko.observableArray([]);
    this.afterfiles = ko.observableArray([]);

    this.fill = function (d) {
      this.child_item_id('' || d.child_item_id);
      this.child_item_name('' || d.child_item_name);
      this.item_status('' || d.item_status);
      this.status_pass('' || d.status_pass);
      this.status_fail('' || d.status_fail);
      this.status_missing('' || d.status_missing);
      this.fail_description('' || d.fail_description);
      this.remarks('' || d.remarks);
      this.button_name('' || d.button_name);

      for(var i=0;i<d.preview_images.length;i++){
        var preview_image_item1 = new preview_image_item();
        preview_image_item1.fill(d.preview_images[i]);
        this.preview_images.push(preview_image_item1);
      }

      for(var i=0;i<d.images_lst.length;i++){
        var image_item1 = new image_item();
        image_item1.fill(d.images_lst[i]);
        this.images_lst.push(image_item1);
      }

      for(var i=0;i<d.before_preview_images.length;i++){
        var preview_image_before1 = new preview_image_before();
        preview_image_before1.fill(d.before_preview_images[i]);
        this.before_preview_images.push(preview_image_before1);
      }

      for(var i=0;i<d.before_images_lst.length;i++){
        var before_image_item1 = new before_image_item();
        before_image_item1.fill(d.before_images_lst[i]);
        this.before_images_lst.push(before_image_item1);
      }

      for(var i=0;i<d.after_preview_images.length;i++){
        var preview_image_after1 = new preview_image_after();
        preview_image_after1.fill(d.after_preview_images[i]);
        this.after_preview_images.push(preview_image_after1);
      }

      for(var i=0;i<d.after_images_lst.length;i++){
        var after_image_item1 = new after_image_item();
        after_image_item1.fill(d.after_images_lst[i]);
        this.after_images_lst.push(after_image_item1);
      }
    }
  };

  var image_item = function () {
    this.image_id = ko.observable('');
    this.image_path = ko.observable('');

    this.fill = function (d) {
      this.image_id('' || d.image_id);
      this.image_path('' || d.image_path);
    }
  };

  var preview_image_item = function () {
    this.preview = ko.observable('');

    this.fill = function (d) {
      this.preview('' || d.preview);
    }
  };

  var before_image_item = function () {
    this.image_id = ko.observable('');
    this.image_path = ko.observable('');

    this.fill = function (d) {
      this.image_id('' || d.image_id);
      this.image_path('' || d.image_path);
    }
  };

  var preview_image_before = function () {
    this.preview = ko.observable('');

    this.fill = function (d) {
      this.preview('' || d.preview);
    }
  };

  var after_image_item = function () {
    this.image_id = ko.observable('');
    this.image_path = ko.observable('');

    this.fill = function (d) {
      this.image_id('' || d.image_id);
      this.image_path('' || d.image_path);
    }
  };

  var preview_image_after = function () {
    this.preview = ko.observable('');

    this.fill = function (d) {
      this.preview('' || d.preview);
    }
  };


  NOVA.getInspectionDetails = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = {
      'inspection_id': NOVA.inspection_id()
    }
    $.ajax({
      method: 'GET',
      url: '/api/inspection/configure/run/details',
      data: formdata,
      datatype: 'json',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.inspection_name(d.name);
      NOVA.description(d.description);
      NOVA.created_date(d.created_date);
      NOVA.inspector(d.inspector)
      NOVA.inspection_uid(d.inspection_uid)
      NOVA.vehicle_lst([]);
      for(var i=0;i<d.vehicle_lst.length;i++){
        NOVA.vehicle_lst.push(d.vehicle_lst[i]);
      }
      $('#vehicleId').val(NOVA.run_vehicle_id()).trigger('change');
      $('#vehicleRegistration').val(NOVA.run_vehicle_id()).trigger('change');
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.ispectionRunCheck = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = {
      'inspection_config_id': NOVA.inspection_id(),
      'vehicle_id': NOVA.vehicle_id(),
    }
    $.ajax({
      method: 'GET',
      url: '/api/inspection/pending/inspection/exist/check',
      data: formdata,
      datatype: 'json',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.incompleted_inspection_exist(d.pending_inspection);
      NOVA.vehicle_registration(d.vehicle_registration);
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.inspectionReportSave = function(){
    if(NOVA.incompleted_inspection_exist() == true){
      $('#rejectInspection').modal('show');
    }else{
      NOVA.inspectionReportCreate();
    }
  };

  NOVA.inspectionReportCreate = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('inspection_id',NOVA.inspection_id());
    formdata.append('vehicle_id',NOVA.vehicle_id());
    formdata.append('inspection_uid',NOVA.inspection_uid());
    $.ajax({
      method: 'POST',
      url: '/api/inspection/vehicle/report/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      window.location = '/inspection-report/'+d.inspection_report_id+'/detail'
      // $('.inspection-item-create').removeClass('d-none');
      // NOVA.inspection_report_id(d.inspection_report_id);
      // $('#generateReport').removeClass('d-none');
      // $('#reportItems').removeClass('d-none');
      // $('#createService').removeClass('d-none');
      // $('#inspectionSave').attr("disabled", "disabled");
      // NOVA.inspectionItemsLst([]);
      // for(var i=0;i<d.inspectionitems.length;i++){
      //   var inspection_item1 = new inspection_item();
      //   inspection_item1.fill(d.inspectionitems[i]);
      //   NOVA.inspectionItemsLst.push(inspection_item1);
      // }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.generateReportButtonStatus = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('inspection_report_id', NOVA.inspection_report_id());
    $.ajax({
      method: 'POST',
      url: '/api/maintenance/inspection/generate/button/status',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.generated_button_status(d.item_status);
      NOVA.is_signature_required(d.is_signature_required);
      if(d.item_status== false){
        $('#generateReport').removeClass('d-none');
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.vehicleChangeEvent = function(data, e){
    $('#vehicleId').val(NOVA.vehicle_id()).trigger('change');
    $('#vehicleRegistration').val(NOVA.vehicle_id()).trigger('change');
    NOVA.ispectionRunCheck()
  }

  NOVA.registrationChangeEvent = function(data, event){
    $('#vehicleId').val(NOVA.vehicle_id()).trigger('change');
    $('#vehicleRegistration').val(NOVA.vehicle_id()).trigger('change');
    NOVA.ispectionRunCheck()
  }
  
  
})(this);

  // function init() {
    /*$('#inspections').addClass('active')
    if (document.readyState == "interactive") {
      NOVA.hideLoading();
      var docUrlArr = document.URL.split('/');
      var inspection_id = docUrlArr[docUrlArr.length - 2];
      NOVA.inspection_id(inspection_id);
      NOVA.getInspectionDetails();
      NOVA.getAppLogo();
      ko.applyBindings(NOVA);
    }
  }

document.onreadystatechange = init;*/