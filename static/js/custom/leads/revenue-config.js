(function (window) {
  NOVA.lead_id = ko.observable('');
  NOVA.start_date = ko.observable('');
  NOVA.end_date = ko.observable('');
  NOVA.total_revenue = ko.observable(0);
  NOVA.pl_status = ko.observable('');
  NOVA.total_expense = ko.observable('');
  NOVA.published = ko.observable('');
  NOVA.is_published = ko.observable('');
  NOVA.lead_won = ko.observable('');
  NOVA.revenue_exist = ko.observable('');
  NOVA.categories_list = ko.observableArray([]);

  var category = function(){
    this.category_id = ko.observable('');
    this.category_name = ko.observable('');
    this.category_type = ko.observable('');
    this.selected_items = ko.observable('');
    this.total_items = ko.observable('');
    this.total_revenue = ko.observable('');
    this.is_selected = ko.observable('');
    this.items = ko.observableArray([]);
    this.fill = function (d) {
      this.category_id('' || d.category_id);
      this.category_name('' || d.category_name);
      this.category_type('' || d.category_type);
      this.selected_items('' || d.selected_items);
      this.total_items('' || d.total_items);
      this.total_revenue('' || d.total_revenue);
      this.is_selected('' || d.is_selected);
      this.items([]);
      for(var i=0;i<d.items.length;i++){
        var category_item = new categoryItem();
        category_item.fill(d.items[i]);
        this.items.push(category_item);
      }
    }
  }

  var categoryItem = function(){
    this.item_id = ko.observable('');
    this.name = ko.observable('');
    this.item_type = ko.observable('');
    this.is_selected = ko.observable('');
    this.volume = ko.observable('');
    this.uom = ko.observable('');
    this.uom_list = ko.observableArray([]);
    this.tooltip_text = ko.observable('');
    this.propose_rate = ko.observable('');
    this.revenue = ko.observable('');
    this.expense = ko.observable('');
    this.remarks = ko.observable('');
    this.remarks_tooltip = ko.observable('');
    this.remarks_editable = ko.observable('');
    this.fill = function (d) {
      this.item_id('' || d.item_id);
      this.name('' || d.name);
      this.item_type('' || d.item_type);
      this.is_selected('' || d.is_selected);
      this.volume('' || d.volume);
      this.uom('' || d.uom);
      this.uom_list('' || d.uom_list);
      this.tooltip_text('' || d.tooltip_text);
      this.propose_rate('' || d.propose_rate);
      this.revenue('' || d.revenue);
      this.expense('' || d.expense);
      this.remarks('' || d.remarks);
      this.remarks_tooltip('' || d.remarks_tooltip);
      this.remarks_editable('' || d.remarks_editable);
    }
  }
  
  NOVA.getCbsCategoriesList = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/lead/revenue/categories/list/get',
      data: {'lead_id':NOVA.lead_id()},
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.categories_list([]);
      setTimeout(function(){
        $('[data-toggle="tooltip"]').tooltip({ boundary: 'window' })
      },10);
      /*for(var j=0; j<d.data.length; j++){
        var category1 = new category();
        category1.fill(d.data[j]);
        NOVA.categories_list.push(category1);
      }*/
      NOVA.start_date(d.start_date);
      NOVA.end_date(d.end_date);
      NOVA.total_revenue(d.total_revenue);
      NOVA.revenue_exist(d.revenue_exist);
      NOVA.pl_status(d.pl_status);
      NOVA.total_expense(d.total_expense);
      NOVA.is_published(d.is_published);
      NOVA.lead_won(d.lead_won);
      
      if(NOVA.revenue_exist() == true){
        publishFlag1 = true
        for(var j=0; j<d.data.length; j++){
          var category1 = new category();
          category1.fill(d.data[j]);
          NOVA.categories_list.push(category1);
        }
        $('#contractFilterBtn').addClass('d-none');
        $('#contractFilterBtnEdit').removeClass('d-none');
        if(NOVA.is_published() == true){
          $('#draftBtn').attr('disabled','disabled');
          $('#publishBtn').addClass('d-none');
          $('#editBtn').removeClass('d-none');
          $('.config_expence').attr('disabled','disabled');
          $('#contractStartDate, #contractEndDate, #contractFilterBtnEdit').attr('disabled','disabled');
        }else{
          $('#publishBtn').removeClass('d-none');
          $('#editBtn').addClass('d-none');
          $('#draftBtn').removeAttr('disabled');
          $('#publishBtn').removeAttr('disabled');
        }
      }else{
        $('.inital-configure').addClass('d-none');
        $('#editBtn').addClass('d-none');
        $('#draftBtn').attr('disabled','disabled');
        $('#publishBtn').attr('disabled','disabled');        
      }

      
      // console.log(ko.toJSON(NOVA.categories_list()))

      if(NOVA.is_published() == false){
        $('.config_expence[type="checkbox"]').each(function() {
          var getTr = $(this).closest('tr');
          if($(this).is(':checked')) {
            getTr.find('select.config_expence').prop('disabled',false);
            getTr.find('.volumeInputs').prop('disabled',false);
            getTr.find('.priceInputs').prop('disabled',false);
            getTr.find('.remarks-view').prop('disabled',false);
          } else {
            getTr.find('select.config_expence').prop('disabled',true);
            getTr.find('.volumeInputs').prop('disabled',true);
            getTr.find('.priceInputs').prop('disabled',true);
            getTr.find('.remarks-view').prop('disabled',true);
          }
        })
      }
      if(d.item_available == false){
        $('#editBtn').removeClass('d-none');
        $('#publishBtn').addClass('d-none');
        $('#draftBtn').attr('disabled','disabled');
        $('#publishBtn').attr('disabled','disabled');
        $('#contractStartDate, #contractEndDate, #contractFilterBtnEdit').attr('disabled','disabled');
        $('.config_expence[type="checkbox"]').each(function() {
          var getTr = $(this).closest('tr');
          getTr.find('.config_expence').prop('disabled',true);
          getTr.find('.volumeInputs').prop('disabled',true);
          getTr.find('.priceInputs').prop('disabled',true);
          getTr.find('.remarks-view').prop('disabled',true);
        })
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  $(document).on('click', '#editBtn', function(){
    publishFlag1 = true
    publishFlag2 = true
    publishFlag3 = true
    $('#draftBtn').attr('disabled', 'disabled');
    $('#publishBtn').removeClass('d-none');
    $('#editBtn').addClass('d-none');

    $('.config_expence[type="checkbox"]').removeAttr('disabled');    
      
    $('#contractFilterBtnEdit').removeAttr('disabled');

    $('.config_expence[type="checkbox"]').each(function() {
      var getTr = $(this).closest('tr');
      if($(this).is(':checked')) {
        getTr.find('select.config_expence').prop('disabled',false);
        getTr.find('.volumeInputs').prop('disabled',false);
        getTr.find('.priceInputs').prop('disabled',false);
        getTr.find('.remarks-view').prop('disabled',false);
      } else {
        getTr.find('select.config_expence').prop('disabled',true);
        getTr.find('.volumeInputs').prop('disabled',true);
        getTr.find('.priceInputs').prop('disabled',true);
        getTr.find('.remarks-view').prop('disabled',true);
      }
    })

  })

  var publishFlag1 = false;
  var publishFlag2 = false;
  var publishFlag3 = false;

  NOVA.selectItem = function(parent,index,data, e){
    var getTr = $(e.currentTarget).closest('tr');
      if($(e.currentTarget).is(':checked')) {
        getTr.find('select.config_expence').prop('disabled',false);
        getTr.find('.volumeInputs').prop('disabled',false);
        getTr.find('.priceInputs').prop('disabled',false);
        getTr.find('.remarks-view').prop('disabled',false);
        publishFlag2 = true;
      if(getTr.find('select.config_expence').val() == '' || getTr.find('.volumeInputs').val() == '' || getTr.find('.priceInputs').val() == '') {
        publishFlag3 = false;
      } else {
        publishFlag3 = true;
      }
    } else {
        data.volume('');
        data.uom('');
        data.revenue(0);
        data.propose_rate(0);
        NOVA.categories_list()[parent].total_revenue(0)
        getTr.find('select.config_expence').prop('disabled',true);
        getTr.find('.volumeInputs').prop('disabled',true);
        getTr.find('.priceInputs').prop('disabled',true);
        getTr.find('.remarks-view').prop('disabled',true);
        getTr.next('tr:visible').addClass('d-none');

      if($('.config_expence[type="checkbox"]:checked').length > 0) {
        $('.config_expence[type="checkbox"]:checked').each(function() {
          publishFlag2 = true;
          publishFlag3 = true;
          var getTr = $(this).closest('tr');
          if(getTr.find('select.config_expence').val() == '' || getTr.find('.volumeInputs').val() == '' || getTr.find('.priceInputs').val() == '') {
              publishFlag3 = false;
            } 
        })
      } else {
        publishFlag2 = false;
      }
    }

    if(publishFlag1 && publishFlag2 && publishFlag3) {
      $('#publishBtn, #draftBtn').prop('disabled', false);
    } else {
      $('#publishBtn, #draftBtn').prop('disabled', true);
    }


    if(NOVA.categories_list()[parent].items()[index].is_selected() == 'true'){
      NOVA.categories_list()[parent].items()[index].is_selected('false');
    }else{
      NOVA.categories_list()[parent].items()[index].is_selected('true');
    }
    is_selected = 'false'
    NOVA.categories_list()[parent].items().forEach(function(entry) {
      if(entry.is_selected() == 'true'){
        is_selected = 'true'
      }
    })
    NOVA.categories_list()[parent].is_selected(is_selected);
    NOVA.calculateTotalRevenue();
  }

  $(document).on('keyup change', '.config_expence[type="number"], select.config_expence', function() {
    var getTr = $(this).closest('tr');

    if(getTr.find('select.config_expence').val() == '' || getTr.find('.volumeInputs').val() == '' || getTr.find('.priceInputs').val() == '') {
      
      if(getTr.find('.config_expence[type="checkbox"]').is(':checked')) {
        publishFlag3 = false;
      } 
    } else {
      if($('.config_expence[type="checkbox"]:checked').length > 0) {
          $('.config_expence[type="checkbox"]:checked').each(function() {
            publishFlag2 = true;
            publishFlag3 = true;
            var getTr = $(this).closest('tr');
            if(getTr.find('select.config_expence').val() == '' || getTr.find('.volumeInputs').val() == '' || getTr.find('.priceInputs').val() == '') {
                publishFlag3 = false;
                return false
              } 
          })
        } else {
          publishFlag2 = false;
        }
    }
    if(publishFlag1 && publishFlag2 && publishFlag3) {
      $('#publishBtn, #draftBtn').prop('disabled', false);
    } else {
      $('#publishBtn, #draftBtn').prop('disabled', true);
    }
  })

  NOVA.calculateItemRevenue = function(parent,index,data, e){
    volume = NOVA.categories_list()[parent].items()[index].volume()
    propose_rate = NOVA.categories_list()[parent].items()[index].propose_rate()
    if(volume != '' && propose_rate != ''){
      volume = parseFloat(volume)
      propose_rate = parseFloat(propose_rate)
      revenue = (volume * propose_rate).toFixed(2);
      NOVA.categories_list()[parent].items()[index].revenue(revenue);
    }else{
      NOVA.categories_list()[parent].items()[index].expense(0);
    }
    NOVA.calculateTotalRevenue();
  }

  NOVA.calculateTotalRevenue = function(){
    total_revenue = 0
    NOVA.categories_list().forEach(function(entry){
      if(entry.is_selected() == 'true'){
        item_revenue = 0
        entry.items().forEach(function(entry1){
          if(entry1.is_selected() == 'true'){
            revenue = parseFloat(entry1.revenue());
            item_revenue += revenue
          }
        })
        item_revenue = item_revenue.toFixed(2)
        entry.total_revenue(item_revenue);
        revenue = parseFloat(entry.total_revenue())
        total_revenue += revenue;
      }
    })
    total_revenue = total_revenue.toFixed(2);
    NOVA.total_revenue(total_revenue);
    pl_status = (total_revenue - parseFloat(NOVA.total_expense())).toFixed(2);
    NOVA.pl_status(pl_status)
  }

  NOVA.publishLeadRevenue = function(){
    NOVA.published('true');
    flag = false
    NOVA.categories_list().forEach(function(entry){
      if(entry.is_selected() == 'true'){
        flag = true
      }
    })
    if(flag == true){
      NOVA.createLeadRevenue();
    }else{
      NOVA.showErrorModal("Please select atleast one category");
    }
  }

  NOVA.draftLeadRevenue = function(){
    NOVA.published('false');
    flag = false
    NOVA.categories_list().forEach(function(entry){
      if(entry.is_selected() == 'true'){
        flag = true
      }
    })
    if(flag == true){
      NOVA.createLeadRevenue();
    }else{
      NOVA.showErrorModal("Please select atleast one category");
    }
  }


  NOVA.createLeadRevenue = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id',NOVA.lead_id());
    formdata.append('categories_list', ko.toJSON(NOVA.categories_list()));
    formdata.append('start_date',NOVA.start_date());
    formdata.append('end_date',NOVA.end_date());
    formdata.append('published',NOVA.published());
    formdata.append('total_revenue',NOVA.total_revenue());
    $.ajax({
      method: 'POST',
      url: '/api/lead/revenue/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      // NOVA.getCbsCategoriesList();
      window.location = '/lead/details/'+NOVA.lead_id();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })    
  }  

  NOVA.applyRevenueDate = function(){
    NOVA.revenueCategoryGet();
    setTimeout(function(){
      // alert('a/s')
        $('[data-toggle="tooltip"]').tooltip({ boundary: 'window' })
      },10);
    // $('#contractFilterBtn').addClass('d-none');
    // $('#contractFilterBtnEdit').removeClass('d-none');
    // $('[name="contractStartDate"]').prop('disabled', true);
    // $('[name="contractEndDate"]').prop('disabled', true);

    // // $('#publishBtn').removeAttr('disabled');
    // // $('#draftBtn').removeAttr('disabled');
    // // $('#editBtn').removeAttr('disabled');
    // publishFlag1 = true
    // if(publishFlag1 && publishFlag2 && publishFlag3) {
    //   $('#publishBtn, #draftBtn').prop('disabled', false);
    // } else {
    //   $('#publishBtn, #draftBtn').prop('disabled', true);
    // }

    /*if(NOVA.is_published() == true){

      
    } */ 
  }

  NOVA.editRevenueDate = function(){
    $('[name="contractStartDate"]').prop('disabled', false);
    $('[name="contractEndDate"]').prop('disabled', false);

    $('#contractFilterBtnEdit').addClass('d-none');
    $('#contractFilterBtn').removeClass('d-none');

    publishFlag1 = false
    $('#publishBtn').attr('disabled','disabled');
    $('#draftBtn').attr('disabled','disabled');
    $('#editBtn').attr('disabled','disabled');
    if(NOVA.revenue_exist() == true){
      $('#contractFilterBtn').removeAttr('disabled');
    }

    $('input[name="contractEndDate"]').daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      autoUpdateInput: false,
      minDate: moment($('[name="contractStartDate"]').val(), 'DD MMM YYYY', true).format('DD MMM YYYY'),
      // parentEl: "#allocateUnitsModal",
      locale: {
        format: 'DD MMM YYYY'
      }
    }).on('apply.daterangepicker', function(ev, picker) {
      $(this).val(picker.startDate.format('DD MMM YYYY')).trigger("change");
      if ($(this).hasClass("error")){
        $(this).parent().siblings("span.error").remove();
        $(this).removeClass("error text-danger");
      }
    });    
  }

  $('#navItemLeads').addClass('active');  

  NOVA.saveItemRemarks = function(parent,index,data, e){
    NOVA.categories_list()[parent].items()[index].remarks_editable('false');
    tooltip_text = NOVA.categories_list()[parent].items()[index].remarks();
    NOVA.categories_list()[parent].items()[index].remarks_tooltip(tooltip_text);
  }

  $(document).on('click','.remarks-view', function() {
    var nextTr = $(this).closest('tr').next('tr')
    if(nextTr.is(':visible')) {
      nextTr.addClass('d-none');
    } else {
      nextTr.removeClass('d-none');
    }
  })


  NOVA.revenueCategoryGet = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/lead/active/revenue/categories/get',
      data: {
        'lead_id':NOVA.lead_id(),
        'start_date':NOVA.start_date(),
        'end_date':NOVA.end_date()
      },
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.categories_list([]);
      setTimeout(function(){
      // alert('a/s')
        $('[data-toggle="tooltip"]').tooltip({ boundary: 'window' })
      },10);
      NOVA.total_revenue(d.total_revenue);
      NOVA.pl_status(d.pl_status);
      for(var j=0; j<d.data.length; j++){
        var category1 = new category();
        category1.fill(d.data[j]);
        NOVA.categories_list.push(category1);
      }
      $('.inital-configure').removeClass('d-none');
      $('#contractFilterBtn').addClass('d-none');
      $('#contractFilterBtnEdit').removeClass('d-none');
      // $('#contractFilterBtnEdit').prop('disabled', 'disabled');
      $('[name="contractStartDate"]').prop('disabled', true);
      $('[name="contractEndDate"]').prop('disabled', true);
      publishFlag1 = true
      if(publishFlag1 && publishFlag2 && publishFlag3) {
        $('#publishBtn, #draftBtn').prop('disabled', false);
      } else {
        $('#publishBtn, #draftBtn').prop('disabled', true);
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

})(this);

function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    var docUrlArr = document.URL.split('/');
    var lead_id = docUrlArr[docUrlArr.length - 2];
    NOVA.lead_id(lead_id);
    NOVA.getAppLogo();
    NOVA.getCbsCategoriesList();
    ko.applyBindings(NOVA);
  }
}
document.onreadystatechange = init;