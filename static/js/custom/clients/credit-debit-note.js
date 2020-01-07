(function (window) {
  NOVA.client_id = ko.observable('');
  NOVA.note_number = ko.observable('');
  NOVA.amount = ko.observable('');
  NOVA.remarks = ko.observable('');
  NOVA.selectedStatus = ko.observable('');

  NOVA.statusList = ko.observableArray([]);
  NOVA.notesList = ko.observableArray([]);

  NOVA.pageSearch = ko.observable('');
  NOVA.page_count = ko.observable('');
  NOVA.current_page = ko.observable(1);
  NOVA.pages_list = ko.observableArray([]);

  NOVA.getNoteFilters = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/client/notes/filter/items/get',
      dataType: 'json',
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.statusList([]);
      for(var i=0; i<d.status_list.length; i++){
        NOVA.statusList.push(d.status_list[i]);
      }
      NOVA.getClientNotesList();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseText);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  jQuery.validator.addMethod("dollarsscents", function (value, element) {
      return this.optional(element) || /^\d{0,8}(\.\d{0,2})?$/i.test(value);
    }, "Maximum 8 digit and 2 decimal place ");

  jQuery.validator.addMethod("noSPace", function(value, element) {
        return this.optional(element) || /^[a-z,0-9]/i.test(value);
    }, "First space is not allowed");

  createCreditDebitFormValidator = $("#createCreditDebitForm").validate({
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
        noSPace: true
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
    submitHandler: function() {
      NOVA.saveClientNote();
    }
  });

  NOVA.saveClientNote = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('client_id', NOVA.client_id());
    formdata.append('note_number', NOVA.note_number());
    formdata.append('amount', NOVA.amount());
    formdata.append('remarks', NOVA.remarks());
    var note_type = $("input[name='type']:checked").val();
    formdata.append('note_type', note_type);
    $.ajax({
      method: 'POST',
      url: '/api/client/note/create',
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
      NOVA.getClientNotesList();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
      $("body").removeClass("sidebar-right-open");
    })
  }

  $(document).on('click','.create-cn-dn', function() {
    $("body").addClass("sidebar-right-open");
    $('#creditNote').prop('checked', false);
    $('#debitNote').prop('checked', false);
    NOVA.note_number('');
    NOVA.amount('');
    NOVA.remarks('');
  });

  $(document).on('click','.close-cn-dn', function(){
    $("body").removeClass("sidebar-right-open");
  });

  $('[name="type"]').on('change', function() {
    getId = $(this).attr('id');
    if(getId == 'creditNote') {
      $('.cn-num').removeClass('d-none');
      $('.dn-num').addClass('d-none');
    } else {
      $('.cn-num').addClass('d-none');
      $('.dn-num').removeClass('d-none');
    }
  });

  NOVA.getClientNotesList = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/client/notes/list/get',
      data:{
        'search_term':$('#search-input').val(),'page_number': NOVA.current_page(),        
        'selected_status': ko.toJSON(NOVA.selectedStatus()),
        'client_id': NOVA.client_id()
      },
      dataType: 'json',
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.notesList([]);
      for(var i = 0; i < d.data.length; i++) {
        NOVA.notesList.push(d.data[i]);
      }

      if(NOVA.notesList().length == 0){
        $('#card-data-empty').removeClass('d-none');
      }

      NOVA.page_count(d.page_count);
      NOVA.refreshPagination();
      NOVA.pageSearch('')
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseText);
      $('.error-modal').modal('show');
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
      NOVA.getClientNotesList();
    }
  };

  NOVA.getNextPage = function(){
    if(NOVA.current_page() != NOVA.page_count()){
      NOVA.current_page(NOVA.current_page() + 1);
      NOVA.getClientNotesList();
    }
  };

  NOVA.onPageClick = function(pageno){
    NOVA.current_page(pageno);
    NOVA.getClientNotesList();
  };

  NOVA.getFirstPage = function(){
    NOVA.current_page(1);
    NOVA.getClientNotesList();
  }
  NOVA.getLastPage = function(){
    NOVA.current_page(NOVA.page_count());
    NOVA.getClientNotesList();
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
    NOVA.getClientNotesList();
  }

  NOVA.search = function() {
    NOVA.getClientNotesList();
  }

  NOVA.filterStatus = function(data,e) {
    var selected_status = [];
    $.each($("input[name='statusfilter']:checked"), function(){
      selected_status.push($(this).val());
    });
    NOVA.selectedStatus(selected_status);
    /*if(e.target.checked == true){
      NOVA.selectedStatus.push(data[0])
    } 
    else {
      if (NOVA.selectedStatus().includes(data[0])) {
        var i = NOVA.selectedStatus().indexOf(data[0])
        NOVA.selectedStatus.splice(i, 1)
      }
    }*/
    NOVA.getClientNotesList();
  }

  NOVA.getDetails = function(data, e){
    window.location = '/client/'+NOVA.client_id()+'/credit-debit-note/detail/'+data.id;
  }


})(this);
  
function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    var docUrlArr = document.URL.split('/');
    var client_id = docUrlArr[docUrlArr.length - 2];
    NOVA.client_id(client_id);
    NOVA.getNoteFilters();
    ko.applyBindings(NOVA);
  }
}

document.onreadystatechange = init;