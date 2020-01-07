(function (window) {

  NOVA.jobname = ko.observable("");
  NOVA.job_type_id = ko.observable("");
  NOVA.document_id = ko.observable("");
  NOVA.pod_status = ko.observable("");
  NOVA.add_item_btn = ko.observable(true);

  NOVA.documentConfigLst = ko.observableArray([]);

  jQuery.validator.addMethod("noSPace", function(value, element) {
        return this.optional(element) || /^[a-z]/i.test(value);
    }, "First space is not allowed");

  $("#createCard").validate({
      ignore: "",
      errorElement: 'span',
      errorClass: 'error text-danger',
      errorPlacement: function(error, element) {
        if (element.parent().hasClass("custom-control")) {
          error.appendTo( element.parent().parent());
        } else if (element.parent().parent().hasClass("checkbox-custom")){
           error.appendTo( element.parent().parent().parent());
        }else {
          error.appendTo( element.parent());
        }
      },
      rules: {
        documentName: {
          required: true,
          noSPace: true
        },
        mandatory: "required",
        customDoc: "required"
      },
      messages: {
        documentName: "Please enter documnet name",
        mandatory: "Please select any of these",
        customDoc: "Please select any of these"
      },
      submitHandler: function() {
        NOVA.documentCreate();
      }
    });

    $('.add-document').on('click', function(){
      NOVA.add_item_btn(true)
      $('.create-card').removeClass('d-none');
      
    })

  // $('.doc-edit-btn').on('click', function(){
  //     $(this).addClass('d-none');
  //     $(this).parent().find('.save-doc-btn').removeClass('d-none');
  //     $(this).parent().parent().find('.form-control,.custom-control-input,.checkbox-custom .custom-doc').prop('disabled', false)
  //   })

  NOVA.initValidation = function(){
    
    $('.edit-doc').each(function(){
      getId = $(this).attr('id');
      console.log('getId',getId)
      $("#"+getId).validate({
        ignore: "",
        errorElement: 'span',
        errorClass: 'error text-danger',
        errorPlacement: function(error, element) {
          if (element.parent().hasClass("input-group")) {
            error.appendTo( element.parent().parent());
          } else if (element.parent().parent().hasClass("checkbox-custom")){
            error.appendTo( element.parent().parent().parent());
          }else {
            error.appendTo( element.parent());
          }
        },
        submitHandler: function(e) {
         $('#errorWrp').addClass('d-none');
         if($(e).attr('id') == 'createCard'){
           NOVA.documentCreate();
         }else{
           id_lst = ($(e).attr('id')).split('-')
           is_collected = $(e).find('.collect-after').is(':checked');
           is_carried = $(e).find('.carried-during').is(':checked');
           is_mandatory = $(e).find('.mandatory-radio:checked').val();
           document_name = $(e).find('.doc-name').val()
           NOVA.document_id(id_lst[1]);
           NOVA.documentUpdate(is_collected,is_carried,is_mandatory,document_name);
         }
       }
      });
    });
    $.validator.addMethod("docNameRequired", $.validator.methods.required, "Please enter position name");
    $.validator.addClassRules("doc-name", {
      docNameRequired: true
    });

    $.validator.addMethod("mandatoryRequired", $.validator.methods.required, "Please select any of these");
    $.validator.addClassRules("mandatory", {
      mandatoryRequired: true     
    });

    $.validator.addMethod("customDocRequired", $.validator.methods.required, "Please select any of these");
    $.validator.addClassRules("customDoc", {
      customDocRequired: true     
    });
  }



  var document_item = function (){
    this.document_name = ko.observable('');
    this.document_id = ko.observable('');
    this.is_mandatory = ko.observable('true');
    this.to_be_collected = ko.observable(false);
    this.to_be_carried = ko.observable(false);
    this.is_saved = ko.observable(false);
    this.edit_enabled = ko.observable(false);
    this.fill = function (d) {
        this.document_name('' || d.document_name);
        this.document_id('' || d.document_id);
        this.is_mandatory('' || d.is_mandatory);
        this.to_be_collected('' || d.to_be_collected);
        this.to_be_carried('' || d.to_be_carried);
        this.is_saved('' || d.is_saved);
        this.edit_enabled('' || d.edit_enabled);
    }
  };

  NOVA.documentCreate = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    is_collected = $('#isCollected').is(':checked')
    is_carried = $('#isCarried').is(':checked')
    if (is_collected == true){
      formdata.append('is_collected', true);
    }else{
      formdata.append('is_collected', false);
    }
    if (is_carried == true){
      formdata.append('is_carried', true);
    }else{
      formdata.append('is_carried', false);
    }
    formdata.append('document_name', $('#documentName').val());
    formdata.append('job_type_id', NOVA.job_type_id());
    formdata.append('is_mandatory', $("input[name='mandatory']:checked").val());
    $.ajax({
      method: 'POST',
      url: '/api/admin/document/config/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      $('#createCard')[0].reset();
      $('.create-card').addClass('d-none');
      NOVA.getDocumentConfigdetail();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.getDocumentConfigdetail = function(data,e){
    var formdata = {
      'jobtype_id': NOVA.job_type_id(),
    }
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/job/type/document/details/get',
      data: formdata,
      datatype: 'json',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.documentConfigLst([]);
      for(var i=0; i< d.data.length; i++){
        var document_item1 = new document_item();
        document_item1.fill(d.data[i]);
        NOVA.documentConfigLst.push(document_item1);
      }
      NOVA.initValidation();
      if(d.data.length > 0){
        $('.create-card').addClass('d-none');
        NOVA.add_item_btn(false);
      }else{
        $('.create-card').removeClass('d-none');
      }
      if(d.pod_status == true){
        $("#proofOfDelivery").prop('checked',true);
      }else{
        $("#proofOfDelivery").prop('checked',false);
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.editButtonClick = function(data,e){
    data.is_saved(false)
    data.edit_enabled(true)
    NOVA.add_item_btn(true);
  };

  NOVA.documentUpdate = function(is_collected,is_carried,is_mandatory,document_name){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('is_collected', is_collected);
    formdata.append('is_carried', is_carried);
    formdata.append('document_name', document_name);
    formdata.append('document_id', NOVA.document_id());
    formdata.append('job_type_id', NOVA.job_type_id());
    formdata.append('is_mandatory', is_mandatory);
    $.ajax({
      method: 'POST',
      url: '/api/admin/document/config/update',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      $('#createCard')[0].reset();
      $('.create-card').addClass('d-none');
      NOVA.getDocumentConfigdetail();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.deleteButtonClick = function(data,e){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('document_id', NOVA.document_id());
    formdata.append('job_type_id', NOVA.job_type_id());
    $.ajax({
      method: 'POST',
      url: '/api/admin/document/config/delete',
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
      NOVA.getDocumentConfigdetail();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $("#confirmModal").modal('hide')
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.jobtypeDetails = function(){
    window.location = '/admin/jobtype/edit/'+NOVA.job_type_id();
  }

  NOVA.financeConfigDetails = function(){
    window.location = '/admin/finance-config/'+NOVA.job_type_id();
  }

  $('#navItemAdmin').addClass('active');

  NOVA.nextStep = function(){
    window.location = '/admin/finance-config/'+NOVA.job_type_id();
  }

  NOVA.confirmdeleteDocument = function(data){
    $("#confirmModal").modal('show')
    NOVA.document_id(data.document_id())
  }

  NOVA.updatePODStatus = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    var status;
    if($("#proofOfDelivery").prop("checked") == true){
      $("#proofOfDelivery").prop('checked',true);
      status = 'true';
    }else{
      $("#proofOfDelivery").prop('checked',false);
      status = 'false';
    }
    formdata.append('job_type_id', NOVA.job_type_id());
    formdata.append('status',status);
    $.ajax({
      method: 'POST',
      url: '/api/admin/jobtype/pod/status/update',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.getDocumentConfigdetail();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $("#confirmModal").modal('hide')
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  $(document).on('click','#isCollected',function(){
    if($(this).is(':checked') == true){
      $('#isCarried').prop('checked', false);
    }
  })

  $(document).on('click','.collect-after',function(){
    if($(this).is(':checked') == true){
      $(this).parent().parent().parent().parent().find('.carried-during').prop('checked', false);
    }
  })

  $(document).on('click','#isCarried',function(){
    if($(this).is(':checked') == true){
      $('#isCollected').prop('checked', false);
    }
  })

  $(document).on('click','.carried-during',function(){
    if($(this).is(':checked') == true){
      $(this).parent().parent().parent().parent().find('.collect-after').prop('checked', false);
    }
  })
  
})(this);

function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    NOVA.getAppLogo();
    var docUrlArr = document.URL.split('/');
    var job_type_id = docUrlArr[docUrlArr.length - 1];
    NOVA.job_type_id(job_type_id);
    NOVA.getDocumentConfigdetail();
    ko.applyBindings(NOVA);
  }
}
document.onreadystatechange = init;