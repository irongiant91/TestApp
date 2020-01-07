(function (window) {
  NOVA.lead_id = ko.observable('');
  NOVA.total_expense = ko.observable(0);
  NOVA.pl_status = ko.observable('N/A');
  NOVA.total_revenue = ko.observable('');
  NOVA.published = ko.observable('');
  NOVA.is_published = ko.observable('');
  NOVA.lead_won = ko.observable('');
  NOVA.expense_exist = ko.observable('');
  NOVA.categories_list = ko.observableArray([]);

  var category = function(){
    this.category_id = ko.observable('');
    this.category_name = ko.observable('');
    this.selected_items = ko.observable('');
    this.total_items = ko.observable('');
    this.total_expense = ko.observable('');
    this.is_selected = ko.observable('');
    this.items = ko.observableArray([]);
    this.fill = function (d) {
      this.category_id('' || d.category_id);
      this.category_name('' || d.category_name);
      this.selected_items('' || d.selected_items);
      this.total_items('' || d.total_items);
      this.total_expense('' || d.total_expense);
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
    this.is_selected = ko.observable('');
    this.volume = ko.observable('');
    this.uom = ko.observable('');
    this.uom_list = ko.observableArray([]);
    this.propose_rate = ko.observable('');
    this.expense = ko.observable('');
    this.remarks = ko.observable('');
    this.tooltip_text = ko.observable('');
    this.remarks_editable = ko.observable('');
    this.has_price_change = ko.observable('');
    this.new_price = ko.observable('');
    this.price_change_tooltip = ko.observable('');
    this.fill = function (d) {
      this.item_id('' || d.item_id);
      this.name('' || d.name);
      this.is_selected('' || d.is_selected);
      this.volume('' || d.volume);
      this.uom('' || d.uom);
      this.uom_list('' || d.uom_list);
      this.propose_rate('' || d.propose_rate);
      this.expense('' || d.expense);
      this.remarks('' || d.remarks);
      this.tooltip_text('' || d.tooltip_text);
      this.remarks_editable('' || d.remarks_editable);
      this.has_price_change('' || d.has_price_change);
      this.new_price('' || d.new_price);
      this.price_change_tooltip('' || d.price_change_tooltip);
    }
  }
  
  NOVA.getCbiCategoriesList = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/lead/expense/categories/list/get',
      data: {'lead_id':NOVA.lead_id()},
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      console.log(d.data)
      NOVA.categories_list([]);
      for(var j=0; j<d.data.length; j++){
        var category1 = new category();
        category1.fill(d.data[j]);
        NOVA.categories_list.push(category1);
      }
      NOVA.total_expense(d.total_expense);
      NOVA.expense_exist(d.expense_exist);
      NOVA.pl_status(d.pl_status);
      NOVA.total_revenue(d.total_revenue);
      NOVA.is_published(d.is_published);
      NOVA.lead_won(d.lead_won);
      
      if(NOVA.expense_exist() == true){
        if(NOVA.is_published() == true){
          $('#draftBtn').attr('disabled','disabled');
          $('#publishBtn').addClass('d-none');
          $('#editBtn').removeClass('d-none');
          $('.config_expence').attr('disabled','disabled');
        }else{
          $('#draftBtn').removeAttr('disabled');
          $('#publishBtn').removeAttr('disabled');
        }
      }
      if(d.item_available == false){
        $('#editBtn').removeClass('d-none');
        $('#draftBtn').attr('disabled','disabled');
        $('#publishBtn').addClass('d-none');
        $('#publishBtn').attr('disabled','disabled');
      }

      $('[data-toggle="tooltip"]').tooltip({ boundary: 'window' })
      // console.log(ko.toJSON(NOVA.categories_list()))
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  $(document).on('click', '#editBtn', function(){
    // $('#draftBtn').removeAttr('disabled');
    $('#publishBtn').removeClass('d-none');
    $('#editBtn').addClass('d-none');
    $('.config_expence[type="checkbox"]').removeAttr('disabled');
    $('.config_expence[type="checkbox"]').each(function() {
      var getTr = $(this).closest('tr');
      if($(this).is(':checked')) {
        getTr.find('select.config_expence').prop('disabled',false);
        getTr.find('.volumeInputs').prop('disabled',false);
        getTr.find('.priceInputs').prop('disabled',false);
        getTr.find('.remarks-view').prop('disabled',false);
      }
    })
  })


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
      // data.volume('');
      // data.uom('');
      // data.expense(0);
      NOVA.categories_list()[parent].total_expense(0)
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

      if(data.has_price_change() == true){
        data.propose_rate(data.new_price());
        expense = data.volume() * data.propose_rate();
        data.expense(expense)
      }

    }

    if(publishFlag2 && publishFlag3) {
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
    NOVA.calculateTotalExpense();
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
  if(publishFlag2 && publishFlag3) {
    $('#publishBtn, #draftBtn').prop('disabled', false);
  } else {
    $('#publishBtn, #draftBtn').prop('disabled', true);
  }
})

  NOVA.calculateItemExpense = function(parent,index,data, e){    
    volume = NOVA.categories_list()[parent].items()[index].volume()
    propose_rate = NOVA.categories_list()[parent].items()[index].propose_rate()
    if(volume != '' && propose_rate != ''){
      volume = parseFloat(volume)
      propose_rate = parseFloat(propose_rate)
      expense = (volume * propose_rate).toFixed(2);
      NOVA.categories_list()[parent].items()[index].expense(expense);
    }else{
      NOVA.categories_list()[parent].items()[index].expense(0);
    }
    NOVA.calculateTotalExpense();
  }

  NOVA.calculateTotalExpense = function(){
    total_expense = 0
    NOVA.categories_list().forEach(function(entry){
      if(entry.is_selected() == 'true'){
        item_expense = 0
        entry.items().forEach(function(entry1){
          if(entry1.is_selected() == 'true'){
            expense = parseFloat(entry1.expense());
            item_expense += expense
          }
        })
        item_expense = item_expense.toFixed(2);
        entry.total_expense(item_expense);
        expense = parseFloat(entry.total_expense())
        total_expense += expense;
      }
    })
    total_expense = total_expense.toFixed(2);
    NOVA.total_expense(total_expense);
    pl_status = (total_expense - parseFloat(NOVA.total_revenue())).toFixed(2);
    NOVA.pl_status(pl_status)
  }

  NOVA.publishLeadExpense = function(){
    NOVA.published('true');
    NOVA.createLeadExpense();
  }

  NOVA.draftLeadRevenue = function(){
    NOVA.published('false');
    NOVA.createLeadExpense();
  }


  NOVA.createLeadExpense = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id',NOVA.lead_id());
    formdata.append('categories_list', ko.toJSON(NOVA.categories_list()));
    formdata.append('published',NOVA.published());
    formdata.append('total_expense',NOVA.total_expense());
    $.ajax({
      method: 'POST',
      url: '/api/lead/expense/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      // NOVA.getCbiCategoriesList();
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
    $('#contractFilterBtn').addClass('d-none');
    $('#contractFilterBtnEdit').removeClass('d-none');
    $('#publishBtn').removeAttr('disabled');
    $('#draftBtn').removeAttr('disabled');
  }

  NOVA.editRevenueDate = function(){
    $('#contractFilterBtnEdit').addClass('d-none');
    $('#contractFilterBtn').removeClass('d-none');
    $('#publishBtn').attr('disabled');
    $('#draftBtn').attr('disabled');
  }

  NOVA.saveItemRemarks = function(parent,index,data, e){
    NOVA.categories_list()[parent].items()[index].remarks_editable('false');
    tooltip_text = NOVA.categories_list()[parent].items()[index].remarks();
    NOVA.categories_list()[parent].items()[index].tooltip_text(tooltip_text);
  }
  
})(this);

function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    NOVA.getAppLogo();
    var docUrlArr = document.URL.split('/');
    var lead_id = docUrlArr[docUrlArr.length - 2];
    NOVA.lead_id(lead_id);
    NOVA.getCbiCategoriesList();
    ko.applyBindings(NOVA);
  }
}
document.onreadystatechange = init;