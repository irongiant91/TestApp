(function (window){
	NOVA.current_page = ko.observable(1);
  NOVA.page_count = ko.observable('');
  NOVA.startDate = ko.observable('');
  NOVA.endDate = ko.observable('');
  NOVA.pageSearch = ko.observable('');
  NOVA.pages_list = ko.observableArray([]);
  NOVA.logs_list = ko.observableArray([]);

  $('#navItemAdmin').addClass('active');

    $('input[name="startDate"]').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    autoUpdateInput: false,
    minDate: new Date(),
    parentEl: "#allocateUnitsModal",
    locale: {
      format: 'DD MMM YYYY'
    }
  }).on('apply.daterangepicker', function(ev, picker) {

    $('#filterBtn').prop('disabled', true)

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
        $('#filterBtn').prop('disabled', false)
      } else {
        $('#filterBtn').prop('disabled', true)
      }
    });

    if (moment(moment($('input[name="endDate"]'))).diff(picker.startDate, 'days') <= 1){
      $('input[name="endDate"]').val('').trigger('change');
      $('input[name="endDate"]').data('daterangepicker').toggle();
    }
  });

  NOVA.search = function() {
    NOVA.current_page(1);
    NOVA.getLogs();
  }

  NOVA.filterDate = function() {
  	NOVA.current_page(1);
  	NOVA.getLogs();
  }

	NOVA.getLogs = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/system/logs/get',
      data:{'search_term':$('#search-input').val(),'page_number': NOVA.current_page(), 'start_date': NOVA.startDate(), 'end_date':NOVA.endDate()},
      dataType: 'json',
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.logs_list	([]);
      for(var i = 0; i < d.data.length; i++) {
      	var offset = moment().utcOffset();
        d.data[i].created_date = moment.utc(d.data[i].date, "DD MMM YYYY hh:mmA").utcOffset(offset).format("DD MMM YYYY");
        d.data[i].created_time = moment.utc(d.data[i].date, "DD MMM YYYY hh:mmA").utcOffset(offset).format("hh:mmA");
        NOVA.logs_list.push(d.data[i]);
      }
      NOVA.page_count(d.page_count);
      NOVA.refreshPagination();
      NOVA.pageSearch('');
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseText);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
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
    NOVA.getLogs();
  }

  NOVA.refreshPagination = function(){
    var max = parseInt(NOVA.current_page()) + 2;
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
      NOVA.getLogs();
    }
  };

  NOVA.getNextPage = function(){
    if(NOVA.current_page() != NOVA.page_count()){
      NOVA.current_page(NOVA.current_page() + 1);
      NOVA.getLogs();
    }
  };

  NOVA.onPageClick = function(pageno){
    NOVA.current_page(pageno);
    NOVA.getLogs();
  };

  NOVA.getFirstPage = function(){
    NOVA.current_page(1);
    NOVA.getLogs();
  }
  NOVA.getLastPage = function(){
    NOVA.current_page(NOVA.page_count());
    NOVA.getLogs();
  }

})(this);
function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    NOVA.getAppLogo();
    NOVA.getLogs();
    ko.applyBindings(NOVA);
  }
}
document.onreadystatechange = init;