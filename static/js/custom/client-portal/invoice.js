(function (window) {
  NOVA.search_term = ko.observable();
  NOVA.generated_sort= ko.observable('')
  NOVA.amount_sort= ko.observable('')
  NOVA.current_page = ko.observable(1);
  NOVA.page_count = ko.observable('');
  NOVA.pageSearch = ko.observable('');
  NOVA.invoice_id = ko.observable('');

  NOVA.status_filter= ko.observableArray([]);
  NOVA.invoices_list = ko.observableArray([]);
  NOVA.pages_list = ko.observableArray([]);
  NOVA.statusList = ko.observableArray([]);

  NOVA.getStatusList = function (){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/clientportal/invoice/status/list/get',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.statusList([]);
      for (let i = 0; i < d.status_list.length; i++) {
        NOVA.statusList.push(d.status_list[i]);
      }
      NOVA.getInvoices();
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
      url: '/api/clientportal/client/invoices/list',
      data: {'search_term': NOVA.search_term(),
             'status_filter': ko.toJSON(NOVA.status_filter()),
             'generated_sort': NOVA.generated_sort(),
             'amount_sort': NOVA.amount_sort(),
             'page_number': NOVA.current_page(),
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

  NOVA.search = function(){
    NOVA.current_page(1)
    NOVA.search_term($('#search-input').val());
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

  NOVA.docViewer = function(data){
    $("#pdfWrapperModal").modal('show');
    NOVA.invoice_id(data.invoice_id);
    PDFObject.embed(data.doc, "#pdfWrapper");
  }

  $('#toEmail').on('click', function() {
    $('#emailInput').removeClass('d-none');
  })

  $.validator.addMethod("emailRegex", function(value, element) {
    return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test( value );
  });

  mailForm = $("#mailForm").validate({
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
      toEmail: {
        required: true,
        emailRegex: true
      }
    },
    messages: {
      toEmail: {
        required: "Please enter mail ID",
        emailRegex: "Please enter valid email"
      }
    },
    submitHandler: function() {
      NOVA.sendMail();
    }
  });

  NOVA.sendMail = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('invoice_id', NOVA.invoice_id());
    formdata.append('email', NOVA.toEmail());
    $.ajax({
      method: 'POST',
      url: '/api/clientportal/send/client/invoice',
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
      $('#emailInput').addClass('d-none');
       $('#pdfWrapperModal').modal('hide');
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

})(this);
  
function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    ko.applyBindings(NOVA);
    NOVA.getStatusList()
    NOVA.getAppLogo();
  }
}
document.onreadystatechange = init;