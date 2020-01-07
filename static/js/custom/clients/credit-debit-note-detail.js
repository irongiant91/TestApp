(function (window) {
  NOVA.client_id = ko.observable('');
  NOVA.note_type = ko.observable('');
  NOVA.note_id = ko.observable('');
  NOVA.note_number = ko.observable('');
  NOVA.amount = ko.observable('');
  NOVA.remarks = ko.observable('');
  NOVA.created_by = ko.observable('');
  NOVA.reimbursed_by = ko.observable('');
  NOVA.cancelled_by = ko.observable('');
  NOVA.created_on = ko.observable('');
  NOVA.cancelled_on = ko.observable('');
  NOVA.reimbursed_on = ko.observable('');
  NOVA.status = ko.observable('');
  NOVA.cancel_remark = ko.observable('');
  NOVA.reimburse_remark = ko.observable('');

  NOVA.getClientNoteDetails = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/client/note/details/get',
      data:{'note_id': NOVA.note_id()
      },
      dataType: 'json',
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.note_type(d.note_type);
      $('#type').val(d.note_type);
      if(d.note_type == 'creditNote'){
        $('#cnNumber').removeClass('d-none');
        $('#dnNumber').addClass('d-none');
      }else{
        $('#dnNumber').removeClass('d-none');
        $('#cnNumber').addClass('d-none');
      }
      NOVA.note_number(d.note_number);
      NOVA.amount(d.amount);
      NOVA.remarks(d.remarks);
      NOVA.created_by(d.created_by);
      NOVA.created_on(d.created_on);
      NOVA.status(d.status);
      NOVA.reimbursed_by(d.reimbursed_by);
      NOVA.reimbursed_on(d.reimbursed_on);
      NOVA.reimburse_remark(d.reimburse_remark);
      NOVA.cancelled_by(d.cancelled_by);
      NOVA.cancelled_on(d.cancelled_on);
      NOVA.cancel_remark(d.cancel_remark);
      if(NOVA.status() == 'Pending'){
        $('#edit-btn').removeClass('d-none');
        $('#cancel-btn').removeClass('d-none');
        $('#reimburse-btn').removeClass('d-none');
      }else if(NOVA.status() == 'Reimbursed'){
        $('#cancel-btn').removeClass('d-none');
        $('#edit-btn').addClass('d-none');
        $('#reimburse-btn').addClass('d-none');
      }else{
        $('#edit-btn').addClass('d-none');
        $('#cancel-btn').addClass('d-none');
        $('#reimburse-btn').addClass('d-none');
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseText);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.typeChangeEvent = function(){
    if($('#type').val() == 'creditNote'){
      $('#cnNumber').removeClass('d-none');
      $('#dnNumber').addClass('d-none');
    }else{
      $('#dnNumber').removeClass('d-none');
      $('#cnNumber').addClass('d-none');
    }
    NOVA.note_number('');
  }

  $(document).on('click','.edit-btn', function(){
    $('.edited-row .form-control').prop('disabled', false);
    $(this).addClass('d-none');
    $('.save-btn').removeClass('d-none');
  });

  /*$(document).on('click','.save-btn', function(){
    
  });*/

  jQuery.validator.addMethod("dollarsscents", function (value, element) {
    return this.optional(element) || /^\d{0,8}(\.\d{0,2})?$/i.test(value);
  }, "Maximum 8 digit and 2 decimal place ");

  jQuery.validator.addMethod("noSPace", function(value, element) {
    return this.optional(element) || /^[a-z,0-9]/i.test(value);
  }, "First space is not allowed");

  editCreditDebitValidator = $("#editCreditDebit").validate({
    errorElement: 'span',
    errorClass: 'error text-danger',
    errorPlacement: function(error, element) {
      if (element.parent().hasClass("input-group")) {
        error.appendTo( element.parent().parent());
      } else if (element.parent().hasClass("custom-control")){
        error.appendTo( element.parent().parent().parent());
      } else {
        error.appendTo( element.parent());
      }
    },
    rules: {
      type: {
        required: true,
        noSPace: true,
      },
      cnNumber: {
        required: true,
        noSPace: true
      },
      dnNumber: {
        required: true,
        noSPace: true
      },
      amount: {
        required: true,
        number: true,
        dollarsscents: true,
        noSPace: true,
      },
      remarks: {
        required: true,
        noSPace: true
      },
    },
    messages: {
      type: {
        required: "Please select type"
      },
      cnNumber: {
        required: "Please enter cn number",
      },
      dnNumber: {
        required: "Please enter dn number",
      },
      amount: {
        required: "Please enter amount",
      },
      remarks: {
        required: "Please enter remarks"
      },
    },
    submitHandler: function(e) {
      NOVA.upadteClientNote();
    }
  });

  NOVA.upadteClientNote = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('note_id', NOVA.note_id());
    formdata.append('note_number', NOVA.note_number());
    formdata.append('amount', NOVA.amount());
    var note_type = $('#type').val();
    formdata.append('note_type', note_type);
    $.ajax({
      method: 'POST',
      url: '/api/client/update/note/details',
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
      $('.edited-row .form-control').prop('disabled', true);
      $(this).addClass('d-none');
      $('.edit-btn').removeClass('d-none');
      $('.save-btn').addClass('d-none');
      NOVA.getClientNoteDetails();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  $(document).on('click','#cancel-btn', function(){
    NOVA.cancel_remark('');
    $('#cancelCreditNote').modal('show');
  });

  NOVA.cancelClientNote = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('note_id', NOVA.note_id());
    formdata.append('cancel_remark', NOVA.cancel_remark());
    $.ajax({
      method: 'POST',
      url: '/api/client/cancel/client/note',
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
      $('#cancelCreditNote').modal('hide');
      NOVA.getClientNoteDetails();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

  $(document).on('click','#reimburse-btn', function(){
    NOVA.reimburse_remark('');
    $('#reimbursedModal').modal('show');
  });

  NOVA.reimburseClientNote = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('note_id', NOVA.note_id());
    formdata.append('reimburse_remark', NOVA.reimburse_remark());
    $.ajax({
      method: 'POST',
      url: '/api/client/reimburse/client/note',
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
      $('#reimbursedModal').modal('hide');
      NOVA.getClientNoteDetails();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
  }

})(this);
  
function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    var docUrlArr = document.URL.split('/');
    var client_id = docUrlArr[docUrlArr.length - 4];
    NOVA.client_id(client_id);
    var note_id = docUrlArr[docUrlArr.length - 1];
    NOVA.note_id(note_id);
    NOVA.getClientNoteDetails();
    ko.applyBindings(NOVA);
  }
}

document.onreadystatechange = init;