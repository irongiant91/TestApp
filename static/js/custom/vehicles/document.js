(function (window) {

  NOVA.vehicle_id = ko.observable('');
  NOVA.doc_name = ko.observable('');
  NOVA.doc_description = ko.observable('');
  NOVA.expiry_date = ko.observable('');
  NOVA.renewal_notif_date = ko.observable('');
  NOVA.doc_id = ko.observable('');
  NOVA.documentsList = ko.observableArray([]);
  NOVA.toEmail = ko.observable('');
  NOVA.image_url = ko.observable('');
  NOVA.pages_list = ko.observableArray([]);
  NOVA.current_page = ko.observable(1);
  NOVA.page_count = ko.observable('');
  NOVA.pageSearch = ko.observable('');
  NOVA.editMode = ko.observable(0);
  NOVA.search_term = ko.observable();

  NOVA.openSidebarRight = function () {
    $("body").addClass("sidebar-right-open");
  }

  NOVA.closeSidebarRight = function () {
    $("body").removeClass("sidebar-right-open");
    createDocumentFormValidator.resetForm()
    NOVA.doc_name('');
    NOVA.doc_description('');
    NOVA.expiry_date('');
    NOVA.renewal_notif_date('');
    $("#uploadFileName").val('');
    NOVA.editMode(0);
    $('#docName').prop('disabled', false);
    $('#docDescription').prop('disabled', false);
    $('#expiryDate').prop('disabled', false);
    $('#renewalDate').prop('disabled', false);
    $('#uploadDocument').prop('disabled', false);

  }

  NOVA.createDocument = function () {
    if ($("#uploadDocument")[0].files[0] != undefined) {
      document1 = $("#uploadDocument")[0].files[0];
      
      var csrftoken = NOVA.getCookie('csrftoken');
      var formdata = new FormData();
      formdata.append('vehicle_id', NOVA.vehicle_id());
      formdata.append('doc_name', NOVA.doc_name());
      formdata.append('doc_description', NOVA.doc_description());
      formdata.append('expiry_date', NOVA.expiry_date());
      formdata.append('renewal_notif_date', NOVA.renewal_notif_date());
      formdata.append('document', document1);
      $.ajax({
        method: 'POST',
        url: '/api/vehicle/create/document',
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
          NOVA.closeSidebarRight();
          NOVA.documentsListGet();
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          // NOVA.closeSidebarRight();
          $('.sidebar-right-overlay').css('z-index', 1049);
          NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
        })
        .always(function () {
          NOVA.hideLoading();
        })

    }
  }

  NOVA.updateDocument = function () {
    newDocUpload = false;
    if ($("#uploadDocument")[0].files[0] != undefined) {
      newDocUpload = true;
      document1 = $("#uploadDocument")[0].files[0];
    }
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('vehicle_id', NOVA.vehicle_id());
    formdata.append('doc_name', NOVA.doc_name());
    formdata.append('doc_description', NOVA.doc_description());
    formdata.append('expiry_date', NOVA.expiry_date());
    formdata.append('renewal_notif_date', NOVA.renewal_notif_date());
    formdata.append('doc_id', NOVA.doc_id());
    formdata.append('new_upload', newDocUpload)
    
    if (newDocUpload){
      formdata.append('document', document1);
    }
    $.ajax({
      method: 'POST',
      url: '/api/vehicle/update/document',
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
        NOVA.closeSidebarRight();
        NOVA.documentsListGet();
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        // NOVA.closeSidebarRight();
        $('.sidebar-right-overlay').css('z-index', 1049);
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
      })
      .always(function () {
        NOVA.hideLoading();
      })

  }


  NOVA.emailDocument = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('doc_id', NOVA.doc_id());
    formdata.append('email', NOVA.toEmail());
    $.ajax({
      method: 'POST',
      url: '/api/vehicle/send/document',
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
      mailForm.resetForm();
      $('#mailForm').addClass('d-none');
      $('#pdfWrapperModal').modal('hide');
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      mailForm.resetForm();
      $('#mailForm').addClass('d-none');
       $('#pdfWrapperModal').modal('hide');
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }



  NOVA.deleteBtn = function (data) {
    $("#confirmModal").modal('show')
  }

  NOVA.editBtn = function (data) {
    $('#editBtn').addClass('d-none');
    $('#saveBtn').removeClass('d-none');
    
    $('#docName').prop('disabled', false);
    $('#docDescription').prop('disabled', false);
    $('#expiryDate').prop('disabled', false);
    $('#renewalDate').prop('disabled', false);
    $('#uploadDocument').prop('disabled', false);
  }

  NOVA.deleteDocument = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('doc_id', NOVA.doc_id());
    $.ajax({
      method: 'POST',
      url: '/api/vehicle/delete/document',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      $("#confirmModal").modal('hide')
      NOVA.showToast(d)
      NOVA.closeSidebarRight();
      NOVA.documentsListGet();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      $("#confirmModal").modal('hide')
      NOVA.closeSidebarRight();
      $('.sidebar-right-overlay').css('z-index', 1049);
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.documentsListGet = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/vehicle/get/documents/list',
      data: { 'vehicle_id': NOVA.vehicle_id(), 'search_term': $('#search-input').val(), 'page_number': NOVA.current_page() },
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
      .done(function (d, textStatus, jqXHR) {
        NOVA.documentsList([]);
        for (i = 0; i < d.data.length; i++) {
          NOVA.documentsList.push(d.data[i]);
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

  NOVA.downloadDoc = function(data) {
    window.location = 'api/vehicle/download/document/'+NOVA.doc_id();
  }

  NOVA.showPDF = function (data) {
    NOVA.doc_id(data.id);
    $('#pdfWrapperModal').modal('show');
    PDFObject.embed(data.path, "#pdfWrapper");
  }

  NOVA.documentDetails = function (data) {
    NOVA.editMode(1);
    $('#docName').prop('disabled', true);
    $('#docDescription').prop('disabled', true);
    $('#expiryDate').prop('disabled', true);
    $('#renewalDate').prop('disabled', true);
    $('#uploadDocument').prop('disabled', true);
    NOVA.doc_id(data.id);
    NOVA.openSidebarRight();
    NOVA.doc_name(data.doc_name);
    NOVA.doc_description(data.doc_name);
    NOVA.expiry_date(data.expiry_date);
    NOVA.renewal_notif_date(data.renewal_notif_date);
    $('#uploadFileName').val(data.doc_file_name);
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
      NOVA.documentsListGet();
    }
  };

  NOVA.getNextPage = function () {
    if (NOVA.current_page() != NOVA.page_count()) {
      NOVA.current_page(NOVA.current_page() + 1);
      NOVA.documentsListGet();
    }
  };

  NOVA.onPageClick = function (pageno) {
    NOVA.current_page(pageno);
    NOVA.documentsListGet();
  };

  NOVA.getFirstPage = function () {
    NOVA.current_page(1);
    NOVA.documentsListGet();
  };

  NOVA.getLastPage = function () {
    NOVA.current_page(NOVA.page_count());
    NOVA.documentsListGet();
  };

  NOVA.pageSearchGo = function (data, e) {
    if (NOVA.pageSearch() > NOVA.page_count()) {
      NOVA.current_page(NOVA.page_count());
      NOVA.pageSearch(NOVA.page_count());
    } else {
      if (NOVA.pageSearch() != '') {
        NOVA.current_page(NOVA.pageSearch());
      }
    }
    NOVA.documentsListGet();
  }

  NOVA.searchKey = function () {
    NOVA.current_page(1);
    NOVA.search_term($('#search-input').val());
    NOVA.documentsListGet();
  }

})(this);

function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    $('#navItemVehicles').addClass('active');
    NOVA.getAppLogo();
    var docUrlArr = document.URL.split('/');
    var id = docUrlArr[docUrlArr.length - 2];
    NOVA.vehicle_id(id);
    NOVA.documentsListGet();
    ko.applyBindings(NOVA);

  }
}
document.onreadystatechange = init;