(function (window) {

  NOVA.invoiceList = ko.observableArray([]);
  NOVA.departmentlist = ko.observableArray([]);
  NOVA.clients_list = ko.observableArray([]);
  NOVA.selectedDepartment = ko.observableArray([]);
  NOVA.selectedClient = ko.observableArray([]);
  NOVA.department_list = ko.observableArray([]);
  NOVA.clients_list = ko.observableArray([]);
  NOVA.editMode = ko.observable(0);
  NOVA.invoice_id = ko.observable('');
  NOVA.invoice_uid = ko.observable('');
  NOVA.department = ko.observable('');
  NOVA.value = ko.observable('');
  NOVA.client = ko.observable('');
  NOVA.created_date = ko.observable('');
  NOVA.invoice_date = ko.observable('');
  NOVA.created_by = ko.observable('');
  NOVA.current_page = ko.observable(1);
  NOVA.page_count = ko.observable('');
  NOVA.pages_list = ko.observableArray([]);
  NOVA.search_term = ko.observable('');
  NOVA.pageSearch = ko.observable('');
  NOVA.doc_name = ko.observable('');
  NOVA.toEmail = ko.observable('');
  NOVA.value_sort_order = ko.observable('ascending');
  NOVA.value_sort = ko.observable('false');
  NOVA.idSortOrder = ko.observable('ascending');
  NOVA.idSort = ko.observable('false');
  NOVA.dateSortOrder = ko.observable('ascending');
  NOVA.dateSort = ko.observable('false');
  NOVA.uploadedSortOrder = ko.observable('ascending');
  NOVA.uploadedSort = ko.observable('false');


  $('#toEmail').on('click', function(){
    $('#mailForm').removeClass('d-none');
  });

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
        NOVA.emailInvoice();
      }
    });

  $('.uploadFile').on('change', function(e) {
    $(this).parent().parent().find('.form-control').val(e.target.files[0].name);
  });
  $('input[name="invoiceDate"], input[name="createdDate"]').daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      autoUpdateInput: false,
      minDate: new Date(),
      locale: {
        format: 'DD MMM YYYY'
      }
    }).on('apply.daterangepicker', function (ev, picker) {
      $(this).val(picker.startDate.format('DD MMM YYYY')).trigger("change");
    });

  // NOVA.permissions_list(decodeHtmlEntity("{{ permissions_list }}"));
  
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

  $('.upload-invoice-btn').on('click', function(){
    $("body").addClass("sidebar-right-open"); 
  });
  $('.icon-cancel').on('click', function(){
    $("body").removeClass("sidebar-right-open");
  });

  jQuery.validator.addMethod("noSPace", function(value, element) {
        return this.optional(element) || /^[a-z0-9]/i.test(value);
    }, "First space is not allowed");

  jQuery.validator.addMethod("dollarsscents", function (value, element) {
      return this.optional(element) || /^\d{0,8}(\.\d{0,2})?$/i.test(value);
    }, "Maximum 8 digit and 2 decimal place ");

  createFinanceFormValidator = $("#createFinanceForm").validate({
    ignore: "",
    errorElement: 'span',
    errorClass: 'error text-danger',
    errorPlacement: function (error, element) {
      if (element.parent().hasClass("input-group")) {
        error.appendTo(element.parent().parent());
      }else if (element.parent().parent().hasClass("d-flex")) {
        error.appendTo(element.parent().parent().parent());
      } else {
        error.appendTo(element.parent());
      }
    },
    rules: {
      uploadFile: {
       required: function() {
          if($('.doc-name').val() == '') {
            return true
          } else {
            return false
          }
        }
      },
      invoiceId: {
        required: true,
        noSPace: true
      },
      department: {
        required: true,
        noSPace: true
      },
      value: {
        required: true,
        noSPace: true,
        number: true,
        dollarsscents: true
      },
      client: {
        required: true,
      },
      invoiceDate: {
        required: true
      },
      // createdBy: {
      //   required: true
      // },
      // createdDate: {
      //   required: true
      // },

    },
    messages: {
      uploadFile: {
        required: "Please upload a document"
      },
      invoiceId: {
        required: "Please enter invoice id"
      },
      department: {
        required: "Please enter department"
      },
      value: {
        required: "Please enter value"
      },
      renewalNotificationDate: {
        required: "Please select renewal notification date"
      },
      client: {
        required: "Please enter client"
      },
      invoiceDate: {
        required: "Please select invoice date"
      },
      /*createdBy: {
        required: "Please enter createdBy"
      },
      createdDate: {
        required: "Please select created date"
      }*/ 
    },
    submitHandler: function () {
      if (NOVA.editMode()==0) {
        NOVA.uploadInvoice();
      }
      else {
        NOVA.saveEditInvoice()
      }
    }
  });

  NOVA.getDepartmentList = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/department/list/get',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.departmentlist([]);
      for(var i=0; i< d.data.length; i++){
        NOVA.departmentlist.push(d.data[i]);
      }
      NOVA.getClientsList();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.getClientsList = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/invoice/clients/list/get',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.clients_list([]);
      for(var i=0; i< d.data.length; i++){
        NOVA.clients_list.push(d.data[i]);
      }
      NOVA.invoiceListGet();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.closeSidebarRight = function () {
    createFinanceFormValidator.resetForm()
    NOVA.invoice_uid('');
    NOVA.department('');
    $('#department').trigger('change');
    NOVA.value('');
    NOVA.client('');
    NOVA.invoice_date('');
    NOVA.doc_name('');
    $('#invoiceDate').val('')
    $('.edit-item').prop('disabled', false);
    $('#editInvoice').addClass('d-none');
    $('#save-invoice').removeClass('d-none');
    $("body").removeClass("sidebar-right-open")
    NOVA.editMode(0);
  }

  NOVA.uploadInvoice = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    document1 = $("#uploadDocument")[0].files[0];
    if (document1 != undefined){
      formdata.append('invoice_doc',document1);
    }
    formdata.append('invoice_uid', NOVA.invoice_uid());
    formdata.append('department', NOVA.department());
    formdata.append('value', NOVA.value());
    formdata.append('client', NOVA.client());
    formdata.append('invoice_date', $('#invoiceDate').val());
    $.ajax({
      method: 'POST',
      url: '/api/order/finance/invoice/create',
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
        NOVA.getClientsList();
        NOVA.closeSidebarRight();
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
      })
      .always(function () {
        NOVA.hideLoading();
      })
  }

  NOVA.saveEditInvoice = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    document1 = $("#uploadDocument")[0].files[0];
    if (document1 != undefined){
      formdata.append('invoice_doc',document1);
    }
    formdata.append('invoice_id', NOVA.invoice_id());
    formdata.append('invoice_uid', NOVA.invoice_uid());
    formdata.append('department', NOVA.department());
    formdata.append('value', NOVA.value());
    formdata.append('client', NOVA.client());
    formdata.append('invoice_date', $('#invoiceDate').val());
    $.ajax({
      method: 'POST',
      url: '/api/order/finance/invoice/update',
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
      NOVA.getClientsList();
      $('#editInvoice').removeClass('d-none');
      $('#save-invoice').addClass('d-none');
      NOVA.closeSidebarRight();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.openSidebarRight = function () {
    $('.sidebar-right-overlay .card').scrollTop(0);
    createFinanceFormValidator.resetForm()
    $("body").addClass("sidebar-right-open")
  }

  NOVA.invoiceDetails = function (data) {
    NOVA.editMode(1);
    $('.edit-item').prop('disabled', true);
    NOVA.invoice_id(data.invoice_id)
    NOVA.openSidebarRight();
    NOVA.invoice_uid(data.invoice_uid)
    NOVA.department(data.department)
    $('#department').trigger('change');
    NOVA.value(data.value)
    NOVA.client(data.client)
    $('#client').trigger('change');
    NOVA.doc_name(data.doc_name)
    NOVA.created_date(data.created_date)
    NOVA.created_by(data.created_by)
    NOVA.invoice_date(data.invoice_date)
    $('#invoiceDate').val(data.invoice_date)
    NOVA.created_by(data.created_by)
  }

  NOVA.editInvoice = function(){
    $('.edit-item').prop('disabled', false);
    $('#editInvoice').addClass('d-none');
    $('#save-invoice').removeClass('d-none');
  }

  NOVA.invoiceListGet = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/uploaded/invoice/finance/list/get',
      data: {
        'search_term' : $('#search-input').val(), 
        'page_number': NOVA.current_page(),
        'value_sort': NOVA.value_sort(),
        'value_sort_order': NOVA.value_sort_order(),
        'selectedDepartment':ko.toJSON(NOVA.selectedDepartment()),
        'selectedClient':ko.toJSON(NOVA.selectedClient()),
        'idSort': NOVA.idSort(),
        'idSortOrder': NOVA.idSortOrder(),
        'dateSort': NOVA.dateSort(),
        'dateSortOrder': NOVA.dateSortOrder(),
        'uploadedSort': NOVA.uploadedSort(),
        'uploadedSortOrder': NOVA.uploadedSortOrder(),
      },
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.invoiceList([]);
      for(var i = 0; i < d.data.length; i++) {
        NOVA.invoiceList.push(d.data[i]);
      }
      NOVA.page_count(d.page_count);
      NOVA.refreshPagination();
      NOVA.pageSearch('');
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.searchKey = function() {
    NOVA.current_page(1);
    NOVA.invoiceListGet();
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
      NOVA.invoiceListGet();
    }
  };

  NOVA.getNextPage = function () {
    if (NOVA.current_page() != NOVA.page_count()) {
      NOVA.current_page(NOVA.current_page() + 1);
      NOVA.invoiceListGet();
    }
  };

  NOVA.onPageClick = function (pageno) {
    NOVA.current_page(pageno);
    NOVA.invoiceListGet();
  };

  NOVA.getFirstPage = function () {
    NOVA.current_page(1);
    NOVA.invoiceListGet();
  }

  NOVA.getLastPage = function () {
    NOVA.current_page(NOVA.page_count());
    NOVA.invoiceListGet();
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
    NOVA.invoiceListGet();
  }  

  NOVA.docViewer = function(data){
    NOVA.invoice_id(data.invoice_id);
    $("#pdfWrapperModal").modal('show');
    PDFObject.embed(data.invoice_doc, "#pdfWrapper");
  }

  NOVA.deleteInvoice = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('invoice_id', NOVA.invoice_id());
    $.ajax({
      method: 'POST',
      url: '/api/order/finance/invoice/delete',
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
      NOVA.invoiceListGet();
      NOVA.closeSidebarRight();
      $("#confirmModal").modal('hide')
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.confirmdeleteInvoice = function(data){
    $("#confirmModal").modal('show')
  }

  NOVA.emailInvoice = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('invoice_id', NOVA.invoice_id());
    formdata.append('email', NOVA.toEmail());
    $.ajax({
      method: 'POST',
      url: '/api/order/finance/invoice/email/send',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      $("#pdfWrapperModal").modal('hide');
      NOVA.showToast(d);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.getFinanceFilters = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/uploaded/invoice/finance/filters/get',
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.department_list([]);
      for(var i=0; i<d.department_list.length; i++){
        NOVA.department_list.push(d.department_list[i]);
      }
      NOVA.clients_list([]);
      for(var i=0; i<d.clients_list.length; i++){
        NOVA.clients_list.push(d.clients_list[i]);
      }
      NOVA.getDepartmentList();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.filterDepartment = function(data,e) {
    if (event.target.checked) {
      NOVA.selectedDepartment.push(data)
    } 
    else {
      if (NOVA.selectedDepartment().includes(data)) {
        var i = NOVA.selectedDepartment().indexOf(data)
        NOVA.selectedDepartment.splice(i, 1)
      }
    }
    NOVA.invoiceListGet();
  }

  NOVA.filterClient = function(data,e) {
    if (event.target.checked) {
      NOVA.selectedClient.push(data)
    } 
    else {
      if (NOVA.selectedClient().includes(data)) {
        var i = NOVA.selectedClient().indexOf(data)
        NOVA.selectedClient.splice(i, 1)
      }
    }
    NOVA.invoiceListGet();
  }

  NOVA.sortInvoiceId = function() {
    NOVA.idSort('true');
    NOVA.value_sort('false');
    NOVA.dateSort('false');
    NOVA.uploadedSort('false');
    if(NOVA.idSortOrder() == 'ascending'){
      NOVA.idSortOrder('descending')
    }else{
      NOVA.idSortOrder('ascending') 
    }
    NOVA.invoiceListGet();
  }

  NOVA.sortByValue = function(){
    NOVA.value_sort('true');
    NOVA.idSort('false');
    NOVA.dateSort('false');
    NOVA.uploadedSort('false');
    if(NOVA.value_sort_order() == 'ascending'){
      NOVA.value_sort_order('descending')      
    }else{
      NOVA.value_sort_order('ascending');      
    }
    NOVA.invoiceListGet();
  }

  NOVA.sortDate = function(){
    NOVA.dateSort('true');
    NOVA.value_sort('false');
    NOVA.idSort('false');
    NOVA.uploadedSort('false');
    if(NOVA.dateSortOrder() == 'ascending'){
      NOVA.dateSortOrder('descending')      
    }else{
      NOVA.dateSortOrder('ascending');      
    }
    NOVA.invoiceListGet();
  }

  NOVA.sortUploaded = function(){
    NOVA.uploadedSort('true');
    NOVA.dateSort('false');
    NOVA.value_sort('false');
    NOVA.idSort('false');
    if(NOVA.uploadedSortOrder() == 'ascending'){
      NOVA.uploadedSortOrder('descending')      
    }else{
      NOVA.uploadedSortOrder('ascending');      
    }
    NOVA.invoiceListGet();
  }

})(this);

function init() {
  if (document.readyState == "interactive") {
    // NOVA.current_page(1);
    NOVA.hideLoading();
    NOVA.getAppLogo();
    NOVA.getFinanceFilters();
    ko.applyBindings(NOVA);

  }
}
document.onreadystatechange = init;