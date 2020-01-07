(function (window) {
  NOVA.inspection_name = ko.observable();
  NOVA.description = ko.observable();
  NOVA.inspection_id = ko.observable();
  NOVA.created_date = ko.observable();
  NOVA.inspection_report_id = ko.observable();
  NOVA.is_generated = ko.observable(false);
  NOVA.vehicle_id = ko.observable('');
  NOVA.incompleted_inspection_exist = ko.observable(false);
  NOVA.generated_button_status = ko.observable(true);
  NOVA.unit_name = ko.observable('');
  NOVA.document_path = ko.observable('');
  NOVA.inspection_status = ko.observable('');
  NOVA.user_timezone = ko.observable('');
  NOVA.service_record_required = ko.observable('');
  NOVA.is_signature_required = ko.observable('');
  NOVA.inspector = ko.observable('');
  NOVA.inspection_uid = ko.observable('');
  NOVA.device_id = ko.observable('');
  NOVA.registration_id = ko.observable('');
  NOVA.inspection_status = ko.observable('');
  NOVA.client_email = ko.observable('');
  NOVA.inspectionItemsLst = ko.observableArray([]);
  NOVA.preview_images = ko.observableArray([]);
  NOVA.files = ko.observableArray([]);
  NOVA.services_list = ko.observableArray([]);

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

    
    $('.category-create-btn').on('click', function(){
      $('.inspection-item-create').removeClass('d-none');
    });

    $('.parent-item-name-input').on('keyup', function(){
      var space = $(this).val().match(/^[a-z,0-9]/);
      if(($(this).val()!='') && (space)) {
        $(this).parent().find('.save-icon').prop('disabled', false);
      }else {
        $(this).parent().find('.save-icon').prop('disabled', true);
      }
    });

    $('.parent-header .save-icon').on('click', function(){
      $(this).parent().parent().parent().find('.collapse').removeClass('d-none').addClass('show');
    });

    $('.add-item-btn').on('click', function(){
      $(this).parent().parent().find('.card').removeClass('d-none');
      $(this).prop('disabled', true);
    });

    $('.child-item-name-input').on('keyup', function(){
      var space = $(this).val().match(/^[a-z,0-9]/);
      if(($(this).val()!='') && (space)) {
        $(this).parent().parent().find('.save-icon').prop('disabled', false);
      }else {
        $(this).parent().parent().find('.save-icon').prop('disabled', true);
      }
    });

    // $(document).on('show.bs.collapse','.collapse', function () {
    //   $(this).parent().find('.card-header .btn-link span').removeClass('icon-plus').addClass('icon-minus');    
    // });

    // $(document).on('hide.bs.collapse','.collapse', function () { 
    //   $(this).parent().find('.card-header .btn-link span').removeClass('icon-minus').addClass('icon-plus');
    // });

  NOVA.getBase64 = function(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  NOVA.setThumbnailWidth = function(){
    $('.thumbnail').each(function(el, i){
      let imgWidth = $(this).width();
      // $(this).css({ 'height': imgWidth*1.3})
    })
  };

  NOVA.collapseChild =function(){
    setTimeout(function() {
      NOVA.setThumbnailWidth();
    }, 500);
  }

  $(window).resize(function(){
    NOVA.setThumbnailWidth();
  })


  NOVA.setThumbnailWidth();

  NOVA.itemImageUpload = function(index,parent,data, e,file){
    NOVA.getBase64(file).then(function(data){
      var preview_image_item1 = new preview_image_item();
      preview_image_item1.fill({preview: data});
      NOVA.inspectionItemsLst()[parent].item_child_lst()[index].preview_images.push(
        preview_image_item1)
      NOVA.inspectionItemsLst()[parent].item_child_lst()[index].files.push(dataURLtoFile(data, file.name))
      $(e.currentTarget).val('');
      $(e.target).parent().parent().siblings(".error").hide();
      NOVA.setThumbnailWidth();
    })
  }

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  NOVA.removePreviewImage = function(data, e, index,child, parent){
    NOVA.inspectionItemsLst()[parent].item_child_lst()[child].preview_images.remove(data);
    NOVA.inspectionItemsLst()[parent].item_child_lst()[child].files().splice(index(), 1);
  };

  NOVA.beforeImageUpload = function(index,parent,data, e,file){
    NOVA.getBase64(file).then(function(data){
      var preview_image_before1 = new preview_image_before();
      preview_image_before1.fill({preview: data});
      NOVA.inspectionItemsLst()[parent].item_child_lst()[index].before_preview_images.push(
        preview_image_before1)
      NOVA.inspectionItemsLst()[parent].item_child_lst()[index].beforefiles.push(dataURLtoFile(data, file.name))
      $(e.currentTarget).val('');
      $(e.target).parent().siblings(".error").hide();
      NOVA.setThumbnailWidth();
    })
  };

  NOVA.removePreviewImageBefore = function(data, e, index,child, parent){
    NOVA.inspectionItemsLst()[parent].item_child_lst()[child].before_preview_images.remove(data);
    NOVA.inspectionItemsLst()[parent].item_child_lst()[child].beforefiles().splice(index(), 1);
  };

  NOVA.afterImageUpload = function(index,parent,data, e,file){
    NOVA.getBase64(file).then(function(data){
      var preview_image_after1 = new preview_image_after();
      preview_image_after1.fill({preview: data});
      NOVA.inspectionItemsLst()[parent].item_child_lst()[index].after_preview_images.push(
        preview_image_after1)
      NOVA.inspectionItemsLst()[parent].item_child_lst()[index].afterfiles.push(dataURLtoFile(data, file.name))
      $(e.currentTarget).val('');
      $(e.target).parent().siblings(".error").hide();
      NOVA.setThumbnailWidth();
    })
  };

  NOVA.removePreviewImageAfter = function(data, e, index,child, parent){
    NOVA.inspectionItemsLst()[parent].item_child_lst()[child].after_preview_images.remove(data);
    NOVA.inspectionItemsLst()[parent].item_child_lst()[child].afterfiles().splice(index(), 1);
  };

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

  $.validator.addMethod("regex", function(value, element, regexpr) {
    return regexpr.test(value);
  });

  var exportViaEmailValidator = $("#exportViaEmailForm").validate({
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
      email: {
        required: true,
        regex: /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@(([0-9a-zA-Z])+([-\w]*[0-9a-zA-Z])*\.)+[a-zA-Z]{2,9})$/
      }
    },
    messages: {
      email: {
        required: "Please enter email",
        regex: "Please enter a valid email"
      }
    },
    submitHandler: function() {      
      NOVA.emaiExport();
    }
  });



  NOVA.getInspectionDetails = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = {
      'inspection_id': NOVA.inspection_id()
    }
    $.ajax({
      method: 'GET',
      url: '/api/inspection/run/report/details',
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
      NOVA.inspector(d.inspector);
      NOVA.inspection_uid(d.inspection_uid);
      NOVA.device_id(d.device_id);
      NOVA.registration_id(d.registration_id);
      NOVA.inspection_status(d.inspection_status);
      NOVA.generated_button_status(d.generated_button_status);
      NOVA.document_path(d.document_path);
      NOVA.is_signature_required(d.is_signature_required);
      NOVA.inspectionItemsLst([]);
      for(var i=0;i<d.inspectionitems.length;i++){
        var inspection_item1 = new inspection_item();
        inspection_item1.fill(d.inspectionitems[i]);
        NOVA.inspectionItemsLst.push(inspection_item1);
      }
      NOVA.services_list([]);
      for(var i=0;i<d.services_list.length;i++){
        NOVA.services_list.push(d.services_list[i]);
      }
      if(d.status == 'Completed'){
        NOVA.is_generated(true)
        $('#createService').addClass('d-none')
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  function checkChangeValidation(e, val) {
    if(e.params.data.text != val) {
      $(e.currentTarget).parent().find('span.error').hide()
    } else {
      $(e.currentTarget).parent().find('span.error').show()
    }
  }

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
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.itemStatusCheck = function(data,e,child,parent){
    NOVA.inspectionItemsLst()[parent].item_child_lst()[child].item_status($(e.currentTarget).val())

    if ( $(e.currentTarget).is(":checked") ) {
      $(e.currentTarget).parent().siblings(".error").addClass("d-none");
    }
  }

  NOVA.inspectionReportSave = function(){
    if(NOVA.incompleted_inspection_exist() == true){
      $('#rejectInspection').modal('show');
    }else{
      NOVA.inspectionReportCreate();
    }
  };


  NOVA.generateReportButtonStatus = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('inspection_report_id', NOVA.inspection_report_id());
    $.ajax({
      method: 'POST',
      url: '/api/inspection/generate/button/status/get',
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
      NOVA.is_signature_required(d.is_sign_required);
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

  NOVA.updateRemarksValidation = function(data, event){
    if ( $(event.currentTarget).val() == "" ){
      $(event.currentTarget).siblings(".error").removeClass("d-none");
    } else {
      $(event.currentTarget).siblings(".error").addClass("d-none");
    }
  }

  NOVA.inspectionReportItemSave = function(data,e,child,parent){
    if (data.item_status() !='Not Applicable'){
      tag_validation1 = false
      tag_validation2 = false
      tag_validation3 = false
      tag_validation4 = false
      tag_validation5 = false
      if (data.item_status() == "" || data.item_status() == null || data.item_status() == undefined){
        $(e.currentTarget).parent().find(".status-input").find(".error").removeClass('d-none');
      } else {
        $(e.currentTarget).parent().find(".status-input").find(".error").addClass('d-none');
        tag_validation1 = true
      }

      if (data.remarks() == "" || data.remarks() == null || data.remarks() == undefined){
        $(e.currentTarget).parent().find(".remarks").find(".error").removeClass('d-none');
        $(e.currentTarget).parent().find(".remarks").find(".form-control").focus()
      } else {
        $(e.currentTarget).parent().find(".remarks").find(".error").addClass('d-none');
        tag_validation2 = true
      }

      if (((data.images_lst().length + data.preview_images().length) > 0)){
        $(e.currentTarget).parent().find(".inspection-image").find(".error").addClass('d-none');
      } else {
        $(e.currentTarget).parent().find(".inspection-image").find(".error").removeClass('d-none');
        tag_validation3 = true
      }

      if (((data.before_images_lst().length + data.before_preview_images().length) > 0)){
        $(e.currentTarget).parent().find(".inspection-image-before").find(".error").addClass('d-none');
      } else {
        $(e.currentTarget).parent().find(".inspection-image-before").find(".error").removeClass('d-none');
        tag_validation4 = true
      }

      if (((data.after_images_lst().length + data.after_preview_images().length) > 0)){
        $(e.currentTarget).parent().find(".inspection-image-after").find(".error").addClass('d-none');
      } else {
        $(e.currentTarget).parent().find(".inspection-image-after").find(".error").removeClass('d-none');
        tag_validation5 = true
      }

      // if ( (data.item_status() == "" || data.item_status() == null || data.item_status() == undefined) || (data.remarks() == "" || data.remarks() == null || data.remarks() == undefined) || ((data.images_lst().length + data.preview_images().length) == 0) || ((data.before_images_lst().length + data.before_preview_images().length) == 0)){
      //   return;
      // }
      if ( (data.item_status() == "" || data.item_status() == null || data.item_status() == undefined) || (data.remarks() == "" || data.remarks() == null || data.remarks() == undefined)){
        return;
      }

      if(data.item_status() == "Good" && tag_validation3 == true){
        return;
      }

      if(data.item_status() == "Damaged" && tag_validation4 == true){
        return;
      }

      if(data.item_status() == "Damaged" && tag_validation5 == true){
        return;
      }
    }

    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('inspection_report_id', NOVA.inspection_report_id());
    formdata.append('child_item_id', data.child_item_id());
    formdata.append('item_status', data.item_status());
    formdata.append('remarks', data.remarks());
    if (NOVA.inspectionItemsLst()[parent].item_child_lst()[child].files().length){
      $.each(NOVA.inspectionItemsLst()[parent].item_child_lst()[child].files(), function(i, file) {
        formdata.append('report_images', file);
      });
    }
    if (NOVA.inspectionItemsLst()[parent].item_child_lst()[child].beforefiles().length){
      $.each(NOVA.inspectionItemsLst()[parent].item_child_lst()[child].beforefiles(), function(i, file) {
        formdata.append('before_images', file);
      });
    }
    if (NOVA.inspectionItemsLst()[parent].item_child_lst()[child].afterfiles().length){
      $.each(NOVA.inspectionItemsLst()[parent].item_child_lst()[child].afterfiles(), function(i, file) {
        formdata.append('after_images', file);
      });
    }
    $.ajax({
      method: 'POST',
      url: '/api/inspection/report/item/details/save',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.generateReportButtonStatus();
      data.button_name('Update');
      NOVA.inspectionItemsLst()[parent].item_child_lst()[child].files([]);
      NOVA.inspectionItemsLst()[parent].item_child_lst()[child].preview_images([]);
      NOVA.inspectionItemsLst()[parent].item_child_lst()[child].images_lst([]);
      for(var i=0;i<d.images_lst.length;i++){
        var image_item1 = new image_item();
        image_item1.fill(d.images_lst[i]);
        NOVA.inspectionItemsLst()[parent].item_child_lst()[child].images_lst.push(image_item1);
      }
      NOVA.inspectionItemsLst()[parent].item_child_lst()[child].beforefiles([]);
      NOVA.inspectionItemsLst()[parent].item_child_lst()[child].before_preview_images([]);
      NOVA.inspectionItemsLst()[parent].item_child_lst()[child].before_images_lst([]);
      for(var i=0;i<d.before_images_lst.length;i++){
        var before_image_item1 = new before_image_item();
        before_image_item1.fill(d.before_images_lst[i]);
        NOVA.inspectionItemsLst()[parent].item_child_lst()[child].before_images_lst.push(before_image_item1);
      }
      NOVA.inspectionItemsLst()[parent].item_child_lst()[child].afterfiles([]);
      NOVA.inspectionItemsLst()[parent].item_child_lst()[child].after_preview_images([]);
      NOVA.inspectionItemsLst()[parent].item_child_lst()[child].after_images_lst([]);
      for(var i=0;i<d.after_images_lst.length;i++){
        var after_image_item1 = new after_image_item();
        after_image_item1.fill(d.after_images_lst[i]);
        NOVA.inspectionItemsLst()[parent].item_child_lst()[child].after_images_lst.push(after_image_item1);
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.removeCreatedImage = function(data,e,index,child,parent){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('report_image_id', data.image_id());
    $.ajax({
      method: 'POST',
      url: '/api/inspection/report/item/image/delete',
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
      NOVA.inspectionItemsLst()[parent].item_child_lst()[child].images_lst.remove(data);
      NOVA.generateReportButtonStatus();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.removebeforeImage = function(data,e,index,child,parent){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('report_image_id', data.image_id());
    $.ajax({
      method: 'POST',
      url: '/api/inspection/report/item/image/delete',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.showErrorModal(d);
      NOVA.inspectionItemsLst()[parent].item_child_lst()[child].before_images_lst.remove(data);
      NOVA.generateReportButtonStatus();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.removeAfterImage = function(data,e,index,child,parent){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('report_image_id', data.image_id());
    $.ajax({
      method: 'POST',
      url: '/api/inspection/report/item/image/delete',
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
      NOVA.inspectionItemsLst()[parent].item_child_lst()[child].after_images_lst.remove(data);
      NOVA.generateReportButtonStatus();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };


  NOVA.generateReport = function(){
    if (NOVA.is_signature_required() == true){
      $("#signatureRequiredModel").modal('show');
    }else{
      NOVA.inspectionReportGenerate();
    }
  };

  NOVA.inspectionReportGenerate = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('inspection_report_id', NOVA.inspection_report_id());
    $.ajax({
      method: 'POST',
      url: '/api/inspection/report/generate',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.getInspectionDetails();
      NOVA.showToast(d.msg);
      NOVA.document_path(d.document_path);
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.emailInspectionReport = function(){
    $("#exportViaEmailModal").modal('show');
  }

  NOVA.emaiExport = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('inspection_report_id',NOVA.inspection_report_id());
    formdata.append('email',NOVA.client_email());
    formdata.append('user_timezone', NOVA.user_timezone());
    $.ajax({
      method: 'POST',
      url: '/api/inspection/report/email',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.showToast(d.msg);
      $("#exportViaEmailModal").modal('hide');
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };
  
  NOVA.viewInspectionReport = function(){
    $("#pdfWrapperModal").modal('show');
    PDFObject.embed(NOVA.document_path(), "#pdfWrapper");
  };

  NOVA.vehicleChangeEvent = function(data, event){
     NOVA.ispectionRunCheck()
    // $('#vehicleRegistration').trigger('select2:select').select2({tags: false});
  };

  NOVA.registrationChangeEvent = function(data, event){
    NOVA.ispectionRunCheck()
    // $('#vehicleId').trigger('select2:select').select2({tags: false});
  }

  NOVA.createService = function(){
    window.location = '/inspection/'+NOVA.inspection_id()+'/service/create'
  }

  NOVA.servicesDetail = function(data){
    window.location = '/inspection/'+NOVA.inspection_id()+'/vehicle/service/'+data.service_id
  }
  
  
})(this);

//   function init() {
//     $('#navItemInspection').addClass('active');
//     if (document.readyState == "interactive") {
//       NOVA.hideLoading();
//       var docUrlArr = document.URL.split('/');
//       var inspection_id = docUrlArr[docUrlArr.length - 2];
//       NOVA.inspection_id(inspection_id);
//       NOVA.inspection_report_id(inspection_id);
//       NOVA.getInspectionDetails();
//       NOVA.getAppLogo();
//       ko.applyBindings(NOVA);
//     }
//   }

// document.onreadystatechange = init;