(function (window) {

  NOVA.order_invoice = ko.observable('');
  NOVA.client_id = ko.observable('');
  NOVA.order_id = ko.observable('');
  NOVA.invoice_number = ko.observable('');
  NOVA.client_name = ko.observable('');
  NOVA.client_address = ko.observable('');
  NOVA.company_address = ko.observable('');
  NOVA.invoice_type = ko.observable('');
  NOVA.total_amount = ko.observable('');
  NOVA.is_draft = ko.observable('');
  NOVA.status = ko.observable('');
  NOVA.invoice_date = ko.observable('');
  NOVA.generated_on = ko.observable('');
  NOVA.generated_by = ko.observable('');
  NOVA.order_uid = ko.observable('');
  NOVA.service_date = ko.observable('');
  NOVA.invoice_doc = ko.observable('');
  NOVA.toEmail = ko.observable('');
  NOVA.invoicelogList = ko.observableArray([]);


  $.validator.addMethod("regex", function(value, element, regexpr) {
    return regexpr.test(value);
  });

  $.validator.addMethod("multiemail", function (value, element) {
    if (this.optional(element)) {
      return true;
    } else {
      if(value.indexOf(',')) {
        var emails = value.split(','),
        valid = true,
        chkFormat = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@(([0-9a-zA-Z])+([-\w]*[0-9a-zA-Z])*\.)+[a-zA-Z]{2,9})$/
        for (var i = 0, limit = emails.length; i < limit; i++) {
          value = emails[i];
          valid = valid && $.validator.methods.email.call(this, value, element) && chkFormat.test(value);
        }
        return valid;
      }
    }
  }, "Invalid email format, please use a comma to separate multiple email addresses");

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
        multiemail: true,
      }
    },
    messages: {
      email: {
        required: "Please enter email",
        multiemail: "Please enter a valid email"
      }
    },
    submitHandler: function() {      
      NOVA.sendMail();
    }
  });

  $('.notification-btn').on('click', function(){
    $("body").addClass("sidebar-right-open");
    NOVA.getLogList();
  });
  
  $('.close-notification').on('click', function(){
    $("body").removeClass("sidebar-right-open");
  });

  $('.edit-ivoice-detail-btn').on('click', function(){
    $(this).addClass('d-none');
    $('.save-ivoice-detail-btn').removeClass('d-none');
    $('#invoiceDetailForm .form-control').prop('disabled', false);
  });

  jQuery.validator.addMethod("dollarsscents", function (value, element) {
      return this.optional(element) || /^\d{0,8}(\.\d{0,2})?$/i.test(value);
    }, "Maximum 8 digit and 2 decimal place ");

  jQuery.validator.addMethod("noSPace", function(value, element) {
      return this.optional(element) || /^[a-z0-9]/i.test(value);
  }, "First space is not allowed");

  invoiceDetailFormValidator = $("#invoiceDetailForm").validate({
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
      invoiceNumber: {
        required: true,
        noSPace: true
      },
      amount: {
        required: true,
        number: true,
        dollarsscents: true
      },  
    },
    messages: {
      invoiceNumber: {
        required: "Please enter invoice number"
      },
      amount: {
        required: "Please enter amount"
      },
    },
    submitHandler: function () {
      NOVA.invoiceUpdate();
    }
  });
    

  NOVA.getInvoiceDetails = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/uploaded/invoice/details/get',
      data: {
        'order_id':NOVA.order_id(),
        'order_invoice':NOVA.order_invoice(),
      },
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      PDFObject.embed(d.invoice_doc, "#pdfWrapper");
      NOVA.invoice_number(d.invoice_number);
      NOVA.client_name(d.client_name);
      NOVA.client_id(d.client_id);
      NOVA.client_address(d.client_address);
      NOVA.company_address(d.company_address);
      NOVA.invoice_type(d.invoice_type);
      NOVA.total_amount(d.total_amount);
      NOVA.is_draft(d.is_draft);
      NOVA.status(d.status);
      NOVA.invoice_date(d.invoice_date);
      NOVA.generated_on(d.generated_on);
      NOVA.generated_by(d.generated_by);
      NOVA.order_uid(d.order_uid);
      NOVA.invoice_doc(d.invoice_doc);
      NOVA.service_date(d.service_date);
      if(d.status == 'Approved' || d.status == 'Rejected' || d.status == 'Paid' || d.status =='Archived'){
        $('#invoiceDetailForm .form-control').prop('disabled', true);
        $('#approveBtn, #rejectBtn').addClass('d-none')
        $('.edit-ivoice-detail-btn').addClass('d-none')
      };
      if(d.status == 'Paid'){
        $('#markasPaid').addClass('d-none');
        $('.edit-ivoice-detail-btn').addClass('d-none')
      }
      if(d.has_paid_invoice == true){
        $('#invoiceDetailForm .form-control').prop('disabled', true);
        $('#approveBtn, #rejectBtn').addClass('d-none')
        $('.edit-ivoice-detail-btn').addClass('d-none')
        $('#markasPaid').addClass('d-none');
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.emailInvoice = function(data){
    $("#exportViaEmailModal").modal('show');
  }

  NOVA.sendMail = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('order_invoice', NOVA.order_invoice());
    formdata.append('email', NOVA.toEmail());
    $.ajax({
      method: 'POST',
      url: '/api/order/invoice/email/send',
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
      NOVA.toEmail('');
       $('#exportViaEmailModal').modal('hide');
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.approveInvoice = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('order_invoice', NOVA.order_invoice());
    formdata.append('status', 'Approved');
    formdata.append('order_id', NOVA.order_id());
    $.ajax({
      method: 'POST',
      url: '/api/order/uploaded/invoice/approve/reject',
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
      NOVA.getLogList();
      NOVA.status('Approved');
      $('#approveBtn, #rejectBtn').addClass('d-none')
      $('#markasPaid').removeClass('d-none');
      $('.edit-ivoice-detail-btn').addClass('d-none')
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.rejectInvoice = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('order_invoice', NOVA.order_invoice());
    formdata.append('status', 'Rejected');
    formdata.append('order_id', NOVA.order_id());
    $.ajax({
      method: 'POST',
      url: '/api/order/uploaded/invoice/approve/reject',
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
      NOVA.getLogList();
      $('#approveBtn, #rejectBtn').addClass('d-none')
      $('.edit-ivoice-detail-btn').addClass('d-none')
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.getLogList = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/invoice/log/get',
      data: {
        'order_invoice':NOVA.order_invoice(),
      },
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.invoicelogList([]);
      var offset = moment().utcOffset();
      for(var j=0; j<d.data.length; j++){
        d.data[j].created_time = moment.utc(d.data[j].created_time, "DD MMM YYYY hh:mmA").utcOffset(offset).format("DD MMM YYYY hh:mmA");
        NOVA.invoicelogList.push(d.data[j]);
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.invoiceUpdate = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('order_id',NOVA.order_id());
    formdata.append('order_invoice',NOVA.order_invoice());
    formdata.append('total_amount',NOVA.total_amount());
    formdata.append('invoice_number',NOVA.invoice_number());
    $.ajax({
      method: 'POST',
      url: '/api/order/uploaded/invoice/update',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      $('#invoiceDetailForm .form-control').prop('disabled', true);
      $('.edit-ivoice-detail-btn').removeClass('d-none')
      $('.save-ivoice-detail-btn').addClass('d-none')
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })    
  }

  NOVA.markasPaid = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('order_invoice', NOVA.order_invoice());
    formdata.append('status', 'Paid');
    formdata.append('order_id', NOVA.order_id());
    $.ajax({
      method: 'POST',
      url: '/api/order/uploaded/invoice/mark/paid',
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
      NOVA.getLogList();
      NOVA.status('Paid');
      $('#approveBtn, #rejectBtn').addClass('d-none')
      $('#markasPaid').addClass('d-none');
      $('.edit-ivoice-detail-btn').addClass('d-none')
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.saveDisable = function(){
    if($('.invoice-number').val() == '' || $('.amount').val() == ''){
      $('.save-ivoice-detail-btn').prop('disabled',true)
    }else{
      $('.save-ivoice-detail-btn').prop('disabled',false)
    }
  }

})(this);
  
  function init() {
    if (document.readyState == "interactive") {
      // $('#navItemClients').addClass('active');
      ko.applyBindings(NOVA);
      NOVA.hideLoading();
      var docUrlArr = document.URL.split('/');
      var order_id = docUrlArr[docUrlArr.length - 4];
      var order_invoice = docUrlArr[docUrlArr.length - 2];
      NOVA.order_id(order_id);
      NOVA.order_invoice(order_invoice);
      NOVA.getAppLogo();
      NOVA.getInvoiceDetails();
    }
  }
  
  document.onreadystatechange = init;