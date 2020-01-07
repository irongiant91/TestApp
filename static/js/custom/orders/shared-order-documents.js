(function (window) {
  NOVA.order_id = ko.observable('');
  NOVA.document_id = ko.observable('');
  NOVA.doc_type = ko.observable('');
  NOVA.fin_docs = ko.observableArray([]);
  NOVA.ord_completion_docs = ko.observableArray([]);
  NOVA.ord_config_docs = ko.observableArray([]);
  NOVA.pod_docs = ko.observableArray([]);
  NOVA.image_url = ko.observable('');
  NOVA.order_type = ko.observable('');
  NOVA.source = ko.observable('');
  NOVA.order_status = ko.observable('');

  NOVA.getDocuments = function () {
    if(NOVA.source() == 'order'){
      var url = '/api/order/get/documents'
    }else{
      var url = '/api/order/get/recurring/documents'
    }

    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: url,
      data: { 'order_id': NOVA.order_id() },
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.fin_docs([]);
      NOVA.ord_completion_docs([]);
      NOVA.ord_config_docs([]);
      NOVA.pod_docs([]);
      var offset = moment().utcOffset();
      for (var i = 0; i < d.finance_docs.length; i++) {
        d.finance_docs[i].created_date = moment.utc(d.finance_docs[i].created_date, "DD MMM YYYY hh:mm:ss A").utcOffset(offset).format("DD MMM YYYY hh:mm:ss A");
        NOVA.fin_docs.push(d.finance_docs[i]);
      }
      for (var i = 0; i < d.ord_completion_docs.length; i++) {
        if(d.ord_completion_docs[i].created_date != ''){
          d.ord_completion_docs[i].created_date = moment.utc(d.ord_completion_docs[i].created_date, "DD MMM YYYY hh:mm:ss A").utcOffset(offset).format("DD MMM YYYY hh:mm:ss A");
        }
        NOVA.ord_completion_docs.push(d.ord_completion_docs[i]);
      }
      for (var i = 0; i < d.ord_config_docs.length; i++) {
        NOVA.ord_config_docs.push(d.ord_config_docs[i]);
      }
      for (var i = 0; i < d.pod_docs.length; i++) {
        d.pod_docs[i].created_date = moment.utc(d.pod_docs[i].created_date, "DD MMM YYYY hh:mm:ss A").utcOffset(offset).format("DD MMM YYYY hh:mm:ss A");
        NOVA.pod_docs.push(d.pod_docs[i]);
      }
      NOVA.order_type(d.order_type);
      NOVA.order_status(d.order_status);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  NOVA.deleteDocument = function () {
    if(NOVA.source() == 'order'){
      var url = '/api/order/delete/document'
    }else{
      var url = '/api/order/delete/recurring/document'
    }

    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('order_id', NOVA.order_id());
    formdata.append('document_id', NOVA.document_id());
    formdata.append('doc_type', NOVA.doc_type());
    $.ajax({
      method: 'POST',
      url: url,
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
      .done(function (d, textStatus, jqXHR) {
        $("#confirmModal").modal('hide')
        NOVA.showToast(d);
        NOVA.getDocuments();
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        $("#confirmModal").modal('hide')
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
        $('#errorModal').on('hidden.bs.modal', function () {
          location.reload();
         })
      })
      .always(function () {
        NOVA.hideLoading();
      })
  }

  NOVA.deleteBtn = function (data) {
    $("#confirmModal").modal('show')
    NOVA.document_id(data.document_id);
    NOVA.doc_type(data.doc_type);
  }

  NOVA.showPDF = function (data) {
    $('#pdfWrapperModal').modal('show');
    NOVA.document_id(data.event_id);
    PDFObject.embed(data.redirect_url, "#pdfWrapper");
  }

  NOVA.enlargeImage = function (data) {
    NOVA.image_url(data.redirect_url)
    $('#enlargeModal').modal('show');
  }

  NOVA.uploadDocument = function (data, event) {
    if (data.format){
      type = 'Upload'
      id = '#'+event.target.id
    }else{
      type = 'New Upload'
      id = '#uploadNewDoc'
    }
    if ( /\.(pdf)$/i.test($(id)[0].files[0].name) === false ) {
      NOVA.showErrorModal("Invalid file format. Only PDF file formats are allowed");
    } else {
      var csrftoken = NOVA.getCookie('csrftoken');
      var formdata = new FormData();
      if($(id)[0].files[0] != undefined){
        document1 = $(id)[0].files[0];
        formdata.append('document',document1);
        formdata.append('type', type);
        formdata.append('order_id', NOVA.order_id());
        if(type=='Upload'){
          formdata.append('document_id', data.document_id);
        }
        if(NOVA.source() == 'order'){
          var url = '/api/order/upload/document'
        }else{
          var url = '/api/order/upload/recurring/document'
        }
        $.ajax({
          method: 'POST',
          url: url,
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
          NOVA.getDocuments();
        })
        .fail( function (jqXHR, textStatus, errorThrown) {
          // NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
          $('#uploadContractModal').modal('hide');
          NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
          NOVA.hideLoading();
          $("#uploadContract").val("");
          NOVA.getLeadTimeline();
        })
        .always(function(){
          NOVA.hideLoading();
        })
      }
    }
  }
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
})(this);