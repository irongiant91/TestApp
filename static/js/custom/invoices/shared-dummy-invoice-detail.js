(function (window) {

  NOVA.order_id = ko.observable('');
  NOVA.order_invoice = ko.observable('');
  NOVA.start_date = ko.observable('');
  NOVA.end_date = ko.observable('');
  NOVA.client_id = ko.observable('');
  NOVA.invoice_logo = ko.observable('');
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
  NOVA.contact_name = ko.observable('');
  NOVA.contact_email = ko.observable('');
  NOVA.contact_phone = ko.observable('');
  NOVA.invoice_address = ko.observable('');
  NOVA.invoice_doc = ko.observable('');
  NOVA.toEmail = ko.observable('');
  NOVA.order_uid = ko.observable();
  NOVA.service_date = ko.observable();
  NOVA.tax_percentage = ko.observable('');
  NOVA.tax_amount = ko.observable('');
  NOVA.payment_terms = ko.observable('');
  NOVA.delete_button_status = ko.observable(false);
  NOVA.add_button_status = ko.observable(false);
  NOVA.save_button_status = ko.observable(false);
  NOVA.approve_button_status = ko.observable(false);
  NOVA.particularList = ko.observableArray([]);
  NOVA.invoiceItemsList = ko.observableArray([]);
  NOVA.invoicelogList = ko.observableArray([]);

  var invoice_items = function(){
    this.invoice_item_id = ko.observable('');
    this.item_type = ko.observable('');
    this.item_id = ko.observable('');
    this.particular = ko.observable('');
    this.quantity = ko.observable('');
    this.unit_price = ko.observable('');
    this.amount = ko.observable('');
    this.particular_lst = ko.observableArray([]);
    this.fill = function (d) {
      this.invoice_item_id('' || d.invoice_item_id);
      this.item_type('' || d.item_type);
      this.item_id('' || d.item_id);
      this.particular('' || d.particular);
      this.quantity('' || d.quantity);
      this.unit_price('' || d.unit_price);
      this.amount('' || d.amount);
      this.particular_lst('' || d.particular_lst)
    }
  };
    

  $(".searchonly").select2({
      tags: false
      }).on('change', function (e, v) {
      if ($(e.currentTarget).find('option:checked').val() == '') {
        $(e.currentTarget).parent().find('span.error').show()
      } else {
        $(e.currentTarget).parent().find('span.error').hide()
      }
    });
    
    $(".select2").select2({
      tags: true
    }).on('change', function (e, v) {
      if ($(e.currentTarget).find('option:checked').val() == '') {
        $(e.currentTarget).parent().find('span.error').show()
      } else {
        $(e.currentTarget).parent().find('span.error').hide()
      }
    });

    $('input[name="serviceDate"]').daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      autoUpdateInput: false,
      locale: {
        format: 'DD MMM YYYY'
      }
    }).on('apply.daterangepicker', function (ev, picker) {
      $(this).val(picker.startDate.format('DD MMM YYYY')).trigger("change");
    });

    jQuery.validator.addMethod("dollarsscents", function (value, element) {
      return this.optional(element) || /^\d{0,8}(\.\d{0,2})?$/i.test(value);
    }, "Maximum 8 digit and 2 decimal place ");

    var dummyInvoiceValidator = $("#dummyInvoice").validate({
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
        particular: "required",
        quantity: {
          required: true,
          number: true,
          digits: true
        },
        unitPrice: {
          required: true,
          number: true,
          digits: true,
          dollarsscents: true
        },
        amount: {
          required: true,
          number: true,
          digits: true,
          dollarsscents: true
        }
      },
      messages: {
        particular: "Please select particular",
        quantity: {
          required: "Please enter quantity",
        },
        unitPrice: {
          required: "Please enter unit price",
        },
        amount: {
          required: "Please enter amount",
        }
      },
      submitHandler: function () {
        $('#errorWrp').addClass('d-none');
      }
    });

    // $('.add-btn').on('click', function(){
    //   $('.cumulative-invoice-table tfoot').removeClass('d-none');
    // });


    $('.dummy-invoice-table tfoot .form-control').on('keyup change', function(){
      if(($('.particular').val()!='') && ($('.quantity').val()!='') && ($('.unit-price').val()!='') && ($('.amount').val()!='')) {
        $('.add-btn').prop('disabled', false);
      }else {
        $('.add-btn').prop('disabled', true);
      }
    });

    $('.notification-btn').on('click', function(){
    $("body").addClass("sidebar-right-open");
    NOVA.getLogList();

  });
  
  $('.close-notification').on('click', function(){
    $("body").removeClass("sidebar-right-open");
  });

  NOVA.detailPage=function(data){
    location.href='/client/'+data.id+'/detail';
  }

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

  NOVA.getInvoiceAddress = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/invoice/address/get',
      beforeSend: function(xhr, settings) {
        // NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.invoice_logo(d.invoice_logo)
      NOVA.invoice_address(d.invoice_address)
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      // NOVA.hideLoading();
    })
  };

  NOVA.getInvoiceDetails = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/get/order/invoice/details',
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
      NOVA.invoiceItemsList([]);
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
      NOVA.contact_name(d.contact_name);
      NOVA.contact_email(d.contact_email);
      NOVA.contact_phone(d.contact_phone);
      NOVA.order_uid(d.order_uid);
      NOVA.service_date(d.service_date);
      NOVA.invoice_doc(d.invoice_doc);
      NOVA.tax_percentage(d.tax_percentage);
      NOVA.tax_amount(d.tax_amount);
      NOVA.payment_terms(d.payment_terms);
      for(var j=0; j<d.invoice_item_lst.length; j++){
        var invoice_items1 = new invoice_items();
        invoice_items1.fill(d.invoice_item_lst[j]);
        NOVA.invoiceItemsList.push(invoice_items1);
        $(".particular").select2({
          tags: true
        }).on('change', function (e, v) {
          if ($(e.currentTarget).find('option:checked').val() == '') {
            $(e.currentTarget).parent().find('span.error').show()
          } else {
            $(e.currentTarget).parent().find('span.error').hide()
          }
        });
      }
      NOVA.particularList(d.particular_lst);
      if(d.is_draft == false){
        $('#draftBtn,#editBtn,#publishBtn').addClass('d-none')
      }else{
        $('#approveBtn, #rejectBtn, #draftBtn').addClass('d-none')
        $('#editBtn, #publishBtn').removeClass('d-none')
      };
      $('.order-id,.particular,.quantity,.unit-price,.invoiceId,.remove-item').attr('disabled',true);
      $('#invoiceId, #paymentTerms').attr('disabled',true);
      if(d.status == 'Approved' || d.status == 'Rejected' || d.status == 'Paid' || d.status =='Archived'){
        $('.order-id,.particular,.quantity,.unit-price,.invoiceId,.remove-item').attr('disabled',true);
        $('#approveBtn, #rejectBtn, #draftBtn').addClass('d-none')
        $('#draftBtn,#editBtn,#publishBtn').addClass('d-none')
      }
      NOVA.add_button_status(true);
      if(d.has_paid_invoice == true){
        $('.order-id,.particular,.quantity,.unit-price,.invoiceId,.remove-item').attr('disabled',true);
        $('#invoiceId, #paymentTerms').attr('disabled',true);
        $('#approveBtn, #rejectBtn, #draftBtn').addClass('d-none')
        $('#draftBtn,#editBtn,#publishBtn').addClass('d-none')
        NOVA.add_button_status(true);
      }
      // NOVA.addButtonStatusCheck();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.particularChangeEvent = function(data){
    for (var i = 0; i < NOVA.particularList().length; i++) {
      entry = NOVA.particularList()[i]
      if(entry.item_id == data.item_id()){
        data.particular(entry.item_name)
        data.quantity(entry.quantity)
        data.unit_price(entry.unit_price)
        data.amount(entry.amount)
        data.item_type(entry.item_type)
        break;
      }else{
        data.quantity('')
        data.unit_price('')
        data.amount('')
        data.item_type('Other')
        data.particular(data.item_id())
      }
    }
    if(NOVA.particularList().length == 0){
      data.quantity('')
      data.unit_price('')
      data.amount('')
      data.item_type('Other')
      data.particular(data.item_id())
    }
    NOVA.totalamountCalculate();
    NOVA.addButtonStatusCheck();
  }

  NOVA.totalamountCalculate = function(){
    total_amount = 0
    tax_percentage = NOVA.tax_percentage();
    NOVA.invoiceItemsList().forEach(function(entry) {
      if(entry.amount() != ''){
        total_amount = parseFloat(total_amount) + parseFloat(entry.amount());
      }
    })
    tax_amount = (total_amount * parseFloat(tax_percentage)) / 100
    total_amount = total_amount + tax_amount
    total_amount = total_amount.toFixed(2)
    tax_amount = tax_amount.toFixed(2)
    NOVA.total_amount(total_amount)
    NOVA.tax_amount(tax_amount)
  }

  NOVA.removeItem = function(data){
    NOVA.invoiceItemsList.remove(data)
    if (NOVA.invoiceItemsList().length == 1){
      NOVA.delete_button_status(true);
    }
    NOVA.totalamountCalculate();
    NOVA.addButtonStatusCheck();
  }

  NOVA.addItem = function(){
    NOVA.add_button_status(true);
    NOVA.save_button_status(true);
    NOVA.delete_button_status(false);
    $('.remove-item').attr('disabled',false)
    d = {
      'invoice_item_id': '',
      'item_type': '',
      'item_id': '',
      'particular': '',
      'quantity': '',
      'unit_price': '',
      'amount': '',
      'particular_lst': NOVA.particularList()
    }
    var invoice_items1 = new invoice_items();
    invoice_items1.fill(d);
    NOVA.invoiceItemsList.push(invoice_items1);
    $(".particular").select2({
      tags: true
    }).on('change', function (e, v) {
      if ($(e.currentTarget).find('option:checked').val() == '') {
        $(e.currentTarget).parent().find('span.error').show()
      } else {
        $(e.currentTarget).parent().find('span.error').hide()
      }
    });
  };

  NOVA.calculatePrice = function(data){
    amount = 0
    if(data.quantity() != '' && data.unit_price() != ''){
      amount = data.quantity() * data.unit_price()
      amount = amount.toFixed(2)
      data.amount(amount);
      NOVA.add_button_status(false);
      NOVA.save_button_status(false);
    }else{
      data.amount('')
      NOVA.add_button_status(true);
      NOVA.save_button_status(true);
    }

    NOVA.totalamountCalculate();
  };

  NOVA.addButtonStatusCheck = function(){
    for (var i = 0; i < NOVA.invoiceItemsList().length; i++) {
      entry = NOVA.invoiceItemsList()[i]
      if(entry.quantity() == '' || entry.unit_price() == '' || entry.item_id() == undefined){
        NOVA.add_button_status(true);
        NOVA.save_button_status(true);
        break;
      }else{
        NOVA.add_button_status(false);
        NOVA.save_button_status(false);
      }
    }
    NOVA.validateButtonstatus();
  };


  NOVA.invoicePublish = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('order_id',NOVA.order_id());
    formdata.append('is_publish','true');
    formdata.append('order_invoice',NOVA.order_invoice());
    formdata.append('invoice_number',NOVA.invoice_number());
    formdata.append('client_name',NOVA.client_name());
    formdata.append('client_address',NOVA.client_address());
    formdata.append('company_address',NOVA.company_address());
    formdata.append('invoice_type',NOVA.invoice_type());
    formdata.append('contact_name',NOVA.contact_name());
    formdata.append('contact_email',NOVA.contact_email());
    formdata.append('contact_phone',NOVA.contact_phone());
    formdata.append('total_amount',NOVA.total_amount());
    formdata.append('payment_terms',NOVA.payment_terms());
    formdata.append('tax_amount',NOVA.tax_amount());
    formdata.append('invoice_items', ko.toJSON(NOVA.invoiceItemsList()));
    $.ajax({
      method: 'POST',
      url: '/api/order/dummy/invoice/publish',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.order_invoice(d.order_invoice)
      NOVA.getInvoiceDetails();
      NOVA.getLogList();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })    
  }

  NOVA.invoiceSaveAsDraft = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('order_id',NOVA.order_id());
    formdata.append('is_publish','false');
    formdata.append('order_invoice',NOVA.order_invoice());
    formdata.append('invoice_number',NOVA.invoice_number());
    formdata.append('client_name',NOVA.client_name());
    formdata.append('client_address',NOVA.client_address());
    formdata.append('company_address',NOVA.company_address());
    formdata.append('invoice_type',NOVA.invoice_type());
    formdata.append('contact_name',NOVA.contact_name());
    formdata.append('contact_email',NOVA.contact_email());
    formdata.append('contact_phone',NOVA.contact_phone());
    formdata.append('total_amount',NOVA.total_amount());
    formdata.append('payment_terms',NOVA.payment_terms());
    formdata.append('tax_amount',NOVA.tax_amount());
    formdata.append('invoice_items', ko.toJSON(NOVA.invoiceItemsList()));
    $.ajax({
      method: 'POST',
      url: '/api/order/dummy/invoice/publish',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.order_invoice(d.order_invoice)
      NOVA.getInvoiceDetails();
      NOVA.getLogList();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })    
  }

  NOVA.editInvoice = function(){
    $('.order-id,.particular,.quantity,.unit-price,.invoiceId,.remove-item').attr('disabled',false);
    $('#invoiceId, #paymentTerms').attr('disabled',false);
    NOVA.add_button_status(false);
    NOVA.validateButtonstatus();
    $('#draftBtn').removeClass('d-none')
    $('#editBtn').addClass('d-none')
    if (NOVA.invoiceItemsList().length == 1){
      $('.remove-item').attr('disabled',true)
    }
  }

  NOVA.docViewer = function(data){
    $("#pdfWrapperModal").modal('show');
    NOVA.invoice_doc();
    PDFObject.embed(NOVA.invoice_doc(), "#pdfWrapper");
  }

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
      url: '/api/order/dummy/invoice/approve/reject',
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
      NOVA.getInvoiceDetails();
      NOVA.getLogList();
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
      url: '/api/order/dummy/invoice/approve/reject',
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
      NOVA.getInvoiceDetails();
      NOVA.getLogList();
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

  NOVA.validateButtonstatus = function(){
    if(NOVA.invoiceItemsList().length == 0){
      NOVA.save_button_status(true);
    };
    for (var i = 0; i < NOVA.invoiceItemsList().length; i++) {
      entry = NOVA.invoiceItemsList()[i]
      if(entry.quantity() == '' || entry.unit_price() == '' || entry.item_id() == undefined || $('#invoiceId').val() == '' || $('#paymentTerms').val() == ''){
        NOVA.save_button_status(true);
        break;
      }else{
        NOVA.save_button_status(false);
      }
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
      NOVA.getInvoiceAddress();
      NOVA.getInvoiceDetails();
    }
  }
  
  document.onreadystatechange = init;