(function (window) {

  NOVA.jobname = ko.observable("");
  NOVA.job_type_id = ko.observable("");
  NOVA.finance_config_id = ko.observable("");
  NOVA.is_published = ko.observable("");
  NOVA.add_item_btn = ko.observable(true);

  NOVA.financeConfigLst = ko.observableArray([]);

  jQuery.validator.addMethod("noSPace", function(value, element) {
        return this.optional(element) || /^[a-z]/i.test(value);
    }, "First space is not allowed");

  jQuery.validator.addMethod("dollarsscents", function (value, element) {
    return this.optional(element) || /^\d{0,8}(\.\d{0,2})?$/i.test(value);
  }, "Maximum 8 digit and 2 decimal place ");

  $("#createFinance").validate({
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
        expenseName: {
          required: true,
          noSPace: true,
        },
        mandatory: "required",
        receiptCollection: "required",
        defaultValue: {
          required: true,
          number: true,
          dollarsscents: true
        },
      },
      messages: {
        expenseName: {
          required: "Please enter documnet name"
        },
        mandatory: "Please select any of these",
        receiptCollection: "Please select any of these",
        defaultValue: {
          required: "Please enter default value",
          number: "Please enter valid value"
        }
      },
      submitHandler: function() {
          NOVA.financeConfigCreate();
      }
    });

    $('.add-expense').on('click', function(){
      $('.create-card').removeClass('d-none');
    })

    $('.doc-edit-btn').on('click', function(){
      $(this).addClass('d-none');
      $(this).parent().find('.save-doc-btn').removeClass('d-none');
    })


  NOVA.initValidation = function(e){
    $('.edit-finance').each(function(e){
      getId = $(this).attr('id');
      $("#"+getId).validate({
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
        submitHandler: function(e) {
         $('#errorWrp').addClass('d-none');
         if($(e).attr('id') == 'createFinance'){
           NOVA.financeConfigCreate();
         }else{
            id_lst = ($(e).attr('id')).split('-')
            name = $(e).find('.expense-name').val()
            amount = $(e).find('.exp-amount').val()
            is_mandatory = $(e).find('.mandatory-radio:checked').val();
            has_reciept = $(e).find('.receipt-collection:checked').val();
            NOVA.finance_config_id(id_lst[1]);
            NOVA.financeConfigUpdate(name,amount,is_mandatory,has_reciept);
         }
       }
      });
    });

    $.validator.addMethod("docNameRequired", $.validator.methods.required, "Please enter position name");
    $.validator.addClassRules("expense-name", {
      docNameRequired: true,
      noSPace: true, 
    });

    $.validator.addMethod("mandatoryRequired", $.validator.methods.required, "Please select any of these");
    $.validator.addClassRules("mandatory", {
      mandatoryRequired: true     
    });

    $.validator.addMethod("receiptCollectionRequired", $.validator.methods.required, "Please select any of these");
    $.validator.addClassRules("receipt-collection", {
      receiptCollectionRequired: true     
    });
    
    $.validator.addMethod("defaultValueRequired", $.validator.methods.required, "Please enter default value");
    $.validator.addClassRules("default-value", {
      defaultValueRequired: true,
      number: true,
      dollarsscents: true,
    });
  }

  var document_item = function (){
    this.name = ko.observable('');
    this.id = ko.observable('');
    this.amount = ko.observable('');
    this.is_mandatory = ko.observable('true');
    this.has_reciept = ko.observable('');
    this.is_saved = ko.observable(false);
    this.edit_enabled = ko.observable(false);
    this.fill = function (d) {
        this.name('' || d.name);
        this.id('' || d.id);
        this.amount('' || d.amount);
        this.is_mandatory('' || d.is_mandatory);
        this.has_reciept('' || d.has_reciept);
        this.is_saved('' || d.is_saved);
        this.edit_enabled('' || d.edit_enabled);
    }
  };

  NOVA.financeConfigCreate = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('name', $('#expenseName').val());
    formdata.append('amount', $('#amount').val());
    formdata.append('job_type_id', NOVA.job_type_id());
    formdata.append('is_mandatory', $("input[name='mandatory']:checked").val());
    formdata.append('has_reciept', $("input[name='receiptCollection']:checked").val());
    $.ajax({
      method: 'POST',
      url: '/api/admin/finance/config/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      $('#createFinance')[0].reset();
      $('.create-card').addClass('d-none');
      NOVA.getFinanceConfigdetail();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.getFinanceConfigdetail = function(data,e){
    var formdata = {
      'jobtype_id': NOVA.job_type_id(),
    }
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/job/type/finance/details/get',
      data: formdata,
      datatype: 'json',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.financeConfigLst([]);
      NOVA.is_published(d.is_published)
      for(var i=0; i< d.data.length; i++){
        var document_item1 = new document_item();
        document_item1.fill(d.data[i]);
        NOVA.financeConfigLst.push(document_item1);
      }
      NOVA.initValidation();
      if(d.data.length > 0){
        $('.create-card').addClass('d-none');
        NOVA.add_item_btn(false);
      }else{
        $('.create-card').removeClass('d-none');
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

  NOVA.financeConfigUpdate = function(name,amount,is_mandatory,has_reciept){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('name', name);
    formdata.append('amount', amount);
    formdata.append('finance_config_id', NOVA.finance_config_id());
    formdata.append('job_type_id', NOVA.job_type_id());
    formdata.append('is_mandatory', is_mandatory);
    formdata.append('has_reciept', has_reciept);
    $.ajax({
      method: 'POST',
      url: '/api/admin/finance/config/update',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      $('.create-card').addClass('d-none');
      NOVA.getFinanceConfigdetail();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  // NOVA.mandatoryClick = function(data,e){
  //   data.is_mandatory(true)
  // }
  // NOVA.notmandatoryClick = function(data,e){
  //   data.is_mandatory(false)
  // }

  NOVA.deleteButtonClick = function(data,e){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('fin_id', NOVA.finance_config_id());
    formdata.append('job_type_id', NOVA.job_type_id());
    $.ajax({
      method: 'POST',
      url: '/api/admin/finance/config/delete',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      $("#confirmModal").modal('hide');
      NOVA.getFinanceConfigdetail();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $("#confirmModal").modal('hide');
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.jobtypeDetails = function(){
    window.location = '/admin/jobtype/edit/'+NOVA.job_type_id();
  }

  NOVA.docConfigDetails = function(){
    window.location = '/admin/document-config/'+NOVA.job_type_id();
  }

  NOVA.publishJobType = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('job_type_id', NOVA.job_type_id());
    $.ajax({
      method: 'POST',
      url: '/api/admin/jobtype/publish',
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
      NOVA.is_published(true)
      setTimeout(function(){ 
        window.location.href = '/admin/jobtypes'; }, 2000);
        
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.confirmdeleteFinance = function(data){
    $("#confirmModal").modal('show')
    NOVA.finance_config_id(data.id())
  }
  
  $('#navItemAdmin').addClass('active');

})(this);

function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    NOVA.getAppLogo();
    var docUrlArr = document.URL.split('/');
    var job_type_id = docUrlArr[docUrlArr.length - 1];
    NOVA.job_type_id(job_type_id);
    NOVA.getFinanceConfigdetail();
    NOVA.initValidation();
    ko.applyBindings(NOVA);
  }
}
document.onreadystatechange = init;