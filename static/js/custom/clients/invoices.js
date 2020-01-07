(function (window) {

  NOVA.client_id = ko.observable();
  NOVA.search_term = ko.observable();
  NOVA.pages_list = ko.observableArray([]);
  NOVA.invoices_list = ko.observableArray([]);
  NOVA.typesList = ko.observableArray([]);
  NOVA.statusList = ko.observableArray([]);
  NOVA.type_filter= ko.observableArray([]);
  NOVA.status_filter= ko.observableArray([]);
  NOVA.generated_sort= ko.observable('')
  NOVA.amount_sort= ko.observable('')
  NOVA.current_page = ko.observable(1);
  NOVA.page_count = ko.observable('');
  NOVA.pageSearch = ko.observable('');

  NOVA.invoice_number = ko.observable('');
  NOVA.invoice_amount = ko.observable('');
  
  

  $('input[name="startDate"]').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    autoUpdateInput: false,
    parentEl: "#allocateUnitsModal",
    locale: {
      format: 'DD MMM YYYY'
    }
  }).on('apply.daterangepicker', function(ev, picker) {

    $('#contractFilterBtn').prop('disabled', true)

    $(this).val(picker.startDate.format('DD MMM YYYY')).trigger("change");

    if ($(this).hasClass("error")){
      $(this).parent().siblings("span.error").remove();
      $(this).removeClass("error text-danger");
    }

    if ($('input[name="endDate"]').data('daterangepicker') != undefined){
      $('input[name="endDate"]').data('daterangepicker').remove();
    }

    $('input[name="endDate"]').daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      autoUpdateInput: false,
      minDate: picker.startDate,
      parentEl: "#allocateUnitsModal",
      locale: {
        format: 'DD MMM YYYY'
      }
    }).on('apply.daterangepicker', function(ev, picker) {
      $(this).val(picker.startDate.format('DD MMM YYYY')).trigger("change");
      if ($(this).hasClass("error")){
        $(this).parent().siblings("span.error").remove();
        $(this).removeClass("error text-danger");
      }
      if(picker.startDate) {
        $('.generate-invoice-btn').prop('disabled', false)
      } else {
        $('.generate-invoice-btn').prop('disabled', true)
      }
    });
    if (moment(moment($('input[name="endDate"]'))).diff(picker.startDate, 'days') <= 1){
      $('input[name="endDate"]').val('').trigger('change');
      $('input[name="endDate"]').data('daterangepicker').toggle();
    }
  });

  $('input[name="netSuiteInvoiceStartDate"]').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    autoUpdateInput: false,
    parentEl: "#allocateUnitsModal",
    locale: {
      format: 'DD MMM YYYY'
    }
  }).on('apply.daterangepicker', function(ev, picker) {

    $('#contractFilterBtn').prop('disabled', true)

    $(this).val(picker.startDate.format('DD MMM YYYY')).trigger("change");

    if ($(this).hasClass("error")){
      $(this).parent().siblings("span.error").remove();
      $(this).removeClass("error text-danger");
    }

    if ($('input[name="netSuiteInvoiceEndDate"]').data('daterangepicker') != undefined){
      $('input[name="netSuiteInvoiceEndDate"]').data('daterangepicker').remove();
    }

    $('input[name="netSuiteInvoiceEndDate"]').daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      autoUpdateInput: false,
      minDate: picker.startDate,
      parentEl: "#allocateUnitsModal",
      locale: {
        format: 'DD MMM YYYY'
      }
    }).on('apply.daterangepicker', function(ev, picker) {
      $(this).val(picker.startDate.format('DD MMM YYYY')).trigger("change");
      if ($(this).hasClass("error")){
        $(this).parent().siblings("span.error").remove();
        $(this).removeClass("error text-danger");
      }
      if(picker.startDate) {
        $('.generate-invoice-btn').prop('disabled', false)
      } else {
        $('.generate-invoice-btn').prop('disabled', true)
      }
    });
    if (moment(moment($('input[name="netSuiteInvoiceEndDate"]'))).diff(picker.startDate, 'days') <= 1){
      $('input[name="netSuiteInvoiceEndDate"]').val('').trigger('change');
      $('input[name="netSuiteInvoiceEndDate"]').data('daterangepicker').toggle();
    }
  });

  $('input[name="payByDate"]').daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      autoUpdateInput: false,
      minDate: new Date(),
      locale: {
        format: 'DD MMM YYYY'
      }
    }).on('apply.daterangepicker', function(ev, picker) {
      $(this).val(picker.startDate.format('DD MMM YYYY')).trigger("change");
    });

  $('#generateCumulativeInvoiceModal').on('hidden.bs.modal', function (e) {
    $('input[name="endDate"]').val('');
    $('input[name="startDate"]').val('');
    $('.generate-invoice-btn').prop('disabled', true);
  });


  NOVA.generateInvoice=function(){
    var startDate = $('#startDate').val().split(' ');
    var endDate = $('#endDate').val().split(' ');
    var newstartDate = startDate[0] + '-' + startDate[1] + '-' + startDate[2]
    var newendDate = endDate[0] + '-' + endDate[1] + '-' + endDate[2]
    location.href='/client/'+NOVA.client_id()+'/invoices/generate-cumulative-invoice/'+newstartDate+'/'+newendDate;
  };

  NOVA.getTypesStatus = function (){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/client/get/statustype',
      data: {'client_id': NOVA.client_id(),
             'source': 'client'},
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
      .done( function (d, textStatus, jqXHR) {
        NOVA.typesList([]);
        for (let i = 0; i < d.types_list.length; i++) {
          NOVA.typesList.push(d.types_list[i]);
        }
        NOVA.statusList([]);
        for (let i = 0; i < d.status_list.length; i++) {
          NOVA.statusList.push(d.status_list[i]);
        }
      })
      .fail( function (jqXHR, textStatus, errorThrown) {
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
      })
      .always(function(){
        NOVA.hideLoading();
      })
  }
  
  NOVA.getInvoices = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/client/get/invoices',
      data: {'client_id': NOVA.client_id(),
             'search_term': NOVA.search_term(),
             'type_filter': ko.toJSON(NOVA.type_filter()),
             'status_filter': ko.toJSON(NOVA.status_filter()),
             'generated_sort': NOVA.generated_sort(),
             'amount_sort': NOVA.amount_sort(),
             'page_number': NOVA.current_page(),
             'source': 'client'
            },
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
      .done( function (d, textStatus, jqXHR) {
        NOVA.invoices_list([]);
        for (let i = 0; i < d.data.length; i++) {
          NOVA.invoices_list.push(d.data[i]);
        }
        NOVA.page_count(d.page_count);
        NOVA.refreshPagination();
        NOVA.pageSearch('');
      })
      .fail( function (jqXHR, textStatus, errorThrown) {
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
      })
      .always(function(){
        NOVA.hideLoading();
      })
  }

  NOVA.typeFilter = function(data,e){
    if (event.target.checked) {
      NOVA.type_filter.push(data)
    } 
    else {
      if (NOVA.type_filter().includes(data)) {
        var j = NOVA.type_filter().indexOf(data)
        NOVA.type_filter.splice(j, 1)
      }
    }
    NOVA.getInvoices();
  }

  NOVA.statusFilter = function(data,e){
    if (event.target.checked) {
      NOVA.status_filter.push(data)
    } 
    else {
      if (NOVA.status_filter().includes(data)) {
        var j = NOVA.status_filter().indexOf(data)
        NOVA.status_filter.splice(j, 1)
      }
    }
    NOVA.getInvoices();
  }

  NOVA.sortGeneratedOn = function(data, e){
    if(NOVA.generated_sort() == 'ascending'){
      NOVA.generated_sort('descending')
      NOVA.getInvoices();
    }else{
      NOVA.generated_sort('ascending');
      NOVA.getInvoices();
    }
  }

  NOVA.sortAmount = function(data, e){
    if(NOVA.amount_sort() == 'ascending'){
      NOVA.amount_sort('descending')
      NOVA.getInvoices();
    }else{
      NOVA.amount_sort('ascending');
      NOVA.getInvoices();
    }
  }

  NOVA.refreshPagination = function(){
    var max = NOVA.current_page() + 2;
    if(max > NOVA.page_count())
      max = NOVA.page_count();
    var min = max - 2;
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
      NOVA.getInvoices();
    }
  };

  NOVA.getNextPage = function(){
    if(NOVA.current_page() != NOVA.page_count()){
      NOVA.current_page(NOVA.current_page() + 1);
      NOVA.getInvoices();
    }
  };

  NOVA.onPageClick = function(pageno){
    NOVA.current_page(pageno);
    NOVA.getInvoices();
  };

  NOVA.getFirstPage = function(){
    NOVA.current_page(1);
    NOVA.getInvoices();
  }

  NOVA.getLastPage = function(){
    NOVA.current_page(NOVA.page_count());
    NOVA.getInvoices();
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
    NOVA.getInvoices();
  }

  NOVA.searchKey = function(){
    NOVA.current_page(1)
    NOVA.search_term($('#search-input').val());
    NOVA.getInvoices();
 }

 NOVA.invoiceDetail = function(data){
    if(data.order_id == '' && data.type == "Dummy Cumulative"){
      window.location = '/client/'+NOVA.client_id()+'/invoices/'+data.invoice_id+'/generate-cumulative-invoice/'+data.start_date+'/'+data.end_date;
    }else if(data.order_id != '' && data.type == "Dummy"){
      window.location = '/order/'+data.orderid+'/client-invoice/'+data.invoice_id+'/dummy'
    }else if(data.order_id != '' && data.type == "Netsuite"){
      window.location = '/order/'+data.orderid+'/invoice/'+data.invoice_id+'/client-netsuite'
    }else if(data.type == "Netsuite Cumulative"){
      window.open('/client/'+data.client_id+'/netsuite-cummalative/'+data.invoice_id+'/invoice-detail')
    }
 };

 NOVA.cummulativeNetsuiteModalShow = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/invoice/number/get',
      dataType: 'json',
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.invoice_number(d.invoice_number)
      $('#uploadNetsuiteInvoiceModal').modal('show')
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseText);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
 };

 NOVA.uploadInvoice = function(e){
    if ( /\.(pdf)$/i.test($("#uploadNetsuiteInvoice")[0].files[0].name) === false ) {
      NOVA.showErrorModal("Invalid file format. Only PDF file formats are allowed");
    } else {
        var csrftoken = NOVA.getCookie('csrftoken');
        var formdata = new FormData();
        document1 = $("#uploadNetsuiteInvoice")[0].files[0];
        formdata.append('invoice_number', NOVA.invoice_number());
        formdata.append('invoice_amount', NOVA.invoice_amount());
        formdata.append('client_id', NOVA.client_id());
        formdata.append('invoice_doc',document1);
        formdata.append('start_date',$('#netSuiteInvoiceStartDate').val());
        formdata.append('end_date',$('#netSuiteInvoiceEndDate').val());
        formdata.append('payby_date',$('#payByDate').val());
        $.ajax({
          method: 'POST',
          url: '/api/order/cummulative/netsuit/upload',
          data: formdata,
          contentType: false,
          processData: false,
          beforeSend: function(xhr, settings) {
            NOVA.showLoading();
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
        })
        .done( function (d, textStatus, jqXHR) {
            window.location = '/client/'+NOVA.client_id()+'/netsuite-cummalative/'+d.order_invoice+'/invoice-detail'
        })
        .fail( function (jqXHR, textStatus, errorThrown) {
          NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
          $("#uploadNetsuiteInvoice").val(null);
        })
        .always(function(){
          NOVA.hideLoading();
        })
      }
  };

  })(this);
  
  function init() {
    if (document.readyState == "interactive") {
    $('#navItemClients').addClass('active');
    ko.applyBindings(NOVA);
    NOVA.hideLoading();
    var docUrlArr = document.URL.split('/');
    var client_id = docUrlArr[docUrlArr.length - 2];
    NOVA.client_id(client_id);
    NOVA.getInvoices();
    NOVA.getTypesStatus()
    NOVA.getAppLogo();
    }
  }
  
  document.onreadystatechange = init;