(function (window) {

  NOVA.orderList = ko.observableArray([]);
  NOVA.vehicleTypes = ko.observableArray([]);
  NOVA.sourceList = ko.observableArray([]);
  NOVA.jobtypeList = ko.observableArray([]);

  NOVA.selectedSource = ko.observableArray([]);
  NOVA.selectedJobType = ko.observableArray([]);
  NOVA.selectedVehicleType = ko.observableArray([]);
  NOVA.selectedStatus = ko.observableArray([]);
  NOVA.sortType = ko.observable('');
  NOVA.filterDay = ko.observable('');
  NOVA.filter_date = ko.observable('');
  NOVA.isChecked = ko.observable(false);

  NOVA.pageSearch = ko.observable('');
  NOVA.page_count = ko.observable('');
  NOVA.current_page = ko.observable(1);
  NOVA.pages_list = ko.observableArray([]);

  NOVA.openSidebarRight = function(){
    $("body").addClass("sidebar-right-open")
  }

  NOVA.closeSidebarRight = function(){
    $("body").removeClass("sidebar-right-open")
  }

  $('input[name="filterByDate"]').daterangepicker({
    opens: 'left',
    autoUpdateInput: false,
    locale: {
      cancelLabel: 'Clear'
    } 
  }).on('apply.daterangepicker', function(ev, picker) {
    var fullDate = picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY')
    $(this).val(fullDate);
    NOVA.filterDate(fullDate);
  });

  NOVA.search = function() {
    NOVA.getRecurringListView();
  }

  NOVA.getDetails = function (data) {
    window.open('/orders/recurring/'+data.id);
  }
  
  NOVA.openFilterDatePicker = function(){
    $('input[name="filterByDate"]').trigger("click")
  }

  var sortList = ['descending','ascending']
  var next = 0
  NOVA.sortDate = function() {
    next = next + 1
    if (next > 1){
      next = 0
    } 
    var next_item =  sortList[next]
    NOVA.sortType(next_item)
    NOVA.getRecurringListView();
  }

  NOVA.getSelected = function() {
    NOVA.filter_date('');
    NOVA.getRecurringListView();
  }

  NOVA.filterDate = function(fullDate) {
    NOVA.filterDay('');
    NOVA.filter_date(fullDate);
    NOVA.getRecurringListView();
  }

  NOVA.showPending = function() {
    if($("#showPending").prop('checked') == true){
      NOVA.isChecked(true);
    } else {
      NOVA.isChecked(false);
    }
    NOVA.getRecurringListView();
  }

  NOVA.filterSource = function(data,e) {
    if (event.target.checked) {
        NOVA.selectedSource.push(data[0])
      } 
    else {
      if (NOVA.selectedSource().includes(data[0])) {
        var i = NOVA.selectedSource().indexOf(data[0])
        NOVA.selectedSource.splice(i, 1)
      }
    }
    NOVA.getRecurringListView();
  }

  NOVA.filterJobType = function(data,e) {
    if (event.target.checked) {
        NOVA.selectedJobType.push(data)
      } 
    else {
      if (NOVA.selectedJobType().includes(data)) {
        var i = NOVA.selectedJobType().indexOf(data)
        NOVA.selectedJobType.splice(i, 1)
      }
    }
    NOVA.getRecurringListView();
  }

  NOVA.filterVehicleType = function(data,e) {
    if (event.target.checked) {
        NOVA.selectedVehicleType.push(data[0])
      } 
    else {
      if (NOVA.selectedVehicleType().includes(data[0])) {
        var i = NOVA.selectedVehicleType().indexOf(data[0])
        NOVA.selectedVehicleType.splice(i, 1)
      }
    }
    NOVA.getRecurringListView();
  }

  NOVA.filterStatus = function(data,e) {
    if (event.target.checked) {
        NOVA.selectedStatus.push(data[0])
      } 
    else {
      if (NOVA.selectedStatus().includes(data[0])) {
        var i = NOVA.selectedStatus().indexOf(data[0])
        NOVA.selectedStatus.splice(i, 1)
      }
    }
    NOVA.getRecurringListView();
  }

  NOVA.getFilterItems = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/recurring/filter/items/get',
      dataType: 'json',
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.vehicleTypes([]);
      NOVA.sourceList([]);
      NOVA.jobtypeList([]);
      NOVA.vehicleTypes(d.vehicletype_list);
      NOVA.sourceList(d.source_list);
      NOVA.jobtypeList(d.jobtype_list);
      NOVA.getRecurringListView();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseText);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }


  NOVA.getRecurringListView = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/recurring/items/get',
      data:{
        'search_term':$('#search-input').val(),'page_number': NOVA.current_page(),
        'selected_source': ko.toJSON(NOVA.selectedSource()),
        'selected_jobtype': ko.toJSON(NOVA.selectedJobType()),
        'selected_vehicletype': ko.toJSON(NOVA.selectedVehicleType()),
        'sort_type' :NOVA.sortType(),
        'filter_day': NOVA.filterDay(),
        'show_pending' : NOVA.isChecked(),
        'filter_date': NOVA.filter_date(),
      },
      dataType: 'json',
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.orderList([]);
      var offset = moment().utcOffset();
      for(var i = 0; i < d.data.length; i++) {
        // d.data[i].start_date = moment.utc(d.data[i].start_date, "DD MMM YYYY hh:mmA").utcOffset(offset).format("DD MMM YYYY HH:mm:ss");
        NOVA.orderList.push(d.data[i]);
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
      NOVA.getRecurringListView();
    }
  };

  NOVA.getNextPage = function(){
    if(NOVA.current_page() != NOVA.page_count()){
      NOVA.current_page(NOVA.current_page() + 1);
      NOVA.getRecurringListView();
    }
  };

  NOVA.onPageClick = function(pageno){
    NOVA.current_page(pageno);
    NOVA.getRecurringListView();
  };

  NOVA.getFirstPage = function(){
    NOVA.current_page(1);
    NOVA.getRecurringListView();
  }
  NOVA.getLastPage = function(){
    NOVA.current_page(NOVA.page_count());
    NOVA.getRecurringListView();
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
    NOVA.getRecurringListView();
  }

})(this);
  
function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    ko.applyBindings(NOVA);
    NOVA.getFilterItems();
  }
}

document.onreadystatechange = init;