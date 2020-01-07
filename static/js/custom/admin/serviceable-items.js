(function (window) {
  NOVA.categoryName = ko.observable('');
  NOVA.editing_category = ko.observable('');
  NOVA.delete_category_id = ko.observable('');
  NOVA.categoryItems = ko.observableArray([]);
  NOVA.vsuom_list = ko.observableArray([]);
  NOVA.categories_list = ko.observableArray([]);

  var category = function(){
    this.category_id = ko.observable('');
    this.category_name = ko.observable('');
    this.is_active = ko.observable('');
    this.is_deletable = ko.observable('true');
    this.items = ko.observableArray([]);
    this.fill = function (d) {
      this.category_id('' || d.category_id);
      this.category_name('' || d.category_name);
      this.is_active('' || d.is_active);
      this.is_deletable('' || d.is_deletable);
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
    this.uom = ko.observable('');
    this.uom_list = ko.observableArray([]);
    this.price = ko.observable('');
    this.order = ko.observable('');
    this.is_deletable = ko.observable('true');
    this.fill = function (d) {
      this.item_id('' || d.item_id);
      this.name('' || d.name);
      this.uom('' || d.uom);
      this.uom_list('' || d.uom_list);
      this.price('' || d.price);
      this.order('' || d.order);
      this.is_deletable('' || d.is_deletable);
    }
  }

  NOVA.getVSUOMList = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/vs/uom/list/get',
      beforeSend: function(xhr, settings) {
        // NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.vsuom_list([]);
      for(var i=0; i< d.data.length; i++){
        NOVA.vsuom_list.push(d.data[i]);
      }
      NOVA.getVsCategoriesList();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      // NOVA.hideLoading();
    })
  }

  $('.category-create-btn').on('click', function(){
    $('.service-item-wrapper').removeClass('d-none');
    NOVA.categoryName('');
    NOVA.categoryItems([]);
    NOVA.addCategoryItem();
  })

  NOVA.addCategoryItem = function(){
    var item1 = new categoryItem();
    order = NOVA.categoryItems().length + 1
    d = {
      item_id: '',
      name : '',
      uom : '',
      uom_list : NOVA.vsuom_list(),
      price : '',
      order: order,
      is_deletable: 'true',
    }
    item1.fill(d);
    NOVA.categoryItems.push(item1);
  }

  NOVA.deleteCategoryItem = function(data, e){
    NOVA.categoryItems.remove(data);
    if(NOVA.categoryItems().length == 0){
      NOVA.addCategoryItem();
    }
  }

  NOVA.saveCategory = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('category_name', NOVA.categoryName());
    formdata.append('category_items', ko.toJSON(NOVA.categoryItems()));
    $.ajax({
      method: 'POST',
      url: '/api/admin/vs/category/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      $('.service-item-wrapper').addClass('d-none');
      NOVA.showToast(d)
      NOVA.getVsCategoriesList();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.getVsCategoriesList = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/vs/category/list/get',
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
      NOVA.init();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }
  
  NOVA.addItem = function(data, e){
    NOVA.categories_list().forEach(function(entry) {
      if(entry.category_id == data.category_id){
        var item1 = new categoryItem();
        order = entry.items.length + 1
        d = {
          item_id: '',
          name : '',
          uom : '',
          uom_list : NOVA.vsuom_list(),
          price : '',
          order: order,
          is_deletable: 'true',
        }
        item1.fill(d);
        entry.items.push(item1);
      }
    })
  $(e.currentTarget).closest('.collapse.show').find('.item-delete-btn').prop('disabled', false);
  $(e.currentTarget).closest('.collapse.show').find('.form-control').prop('disabled', false);
  }

  NOVA.deleteItem = function(parent,index,data, e){
    NOVA.categories_list()[parent].items.remove(data);
    if(NOVA.categories_list()[parent].items().length == 0){
      var item1 = new categoryItem();
      order = NOVA.categories_list()[parent].items.length + 1
      d = {
        item_id: '',
        name : '',
        uom : '',
        uom_list : NOVA.vsuom_list(),
        price : '',
        order: order,
        is_deletable: 'true',
      }
      item1.fill(d);
      NOVA.categories_list()[parent].items.push(item1);
    }
  }

  $(document).on('click', ".edit-cost-btn", function(){
    $(this).parent().parent().next().addClass('show');
    $(this).addClass('d-none');
    $(this).parent().find('.save-cost-btn').removeClass('d-none');
    $(this).parent().find('.disable-cost-btn, .delete-cost-btn, .enable-cost-btn',).attr('disabled','disabled');
    $(this).parent().parent().find('.form-control').removeClass('d-none');
    $(this).parent().parent().find('.category-text').addClass('d-none');

    $(this).parent().parent().parent().find('.form-control').removeAttr('disabled');
    $(this).parent().parent().parent().find('.item-delete-btn').removeAttr('disabled');
    $(this).parent().parent().parent().find('.item-add-btn').removeAttr('disabled');
  });

  NOVA.init = function(){
    jQuery.validator.addMethod("dollarsscents", function (value, element) {
      return this.optional(element) || /^\d{0,8}(\.\d{0,2})?$/i.test(value);
    }, "Maximum 8 digit and 2 decimal place ");

    jQuery.validator.addMethod("noSPace", function(value, element) {
        return this.optional(element) || /^[a-z0-9]/i.test(value);
    }, "First space is not allowed");
    
    $('.service-item-form').each(function(){
      getId = $(this).attr('id');
      $("#"+getId).validate({
        ignore: "",
        errorElement: 'span',
        errorClass: 'error text-danger',
        errorPlacement: function(error, element) {
          if (element.parent().hasClass("input-group")) {
            error.appendTo( element.parent().parent());
          } else {
            error.appendTo( element.parent());
          }
        },
        submitHandler: function(e) {
          $('#errorWrp').addClass('d-none');
          if($(e).attr('id') == 'serviceItem'){
            NOVA.saveCategory();
          }else{
            id_lst = ($(e).attr('id')).split('-')
            NOVA.editing_category(id_lst[1]);
            NOVA.editCategory();
          }
        }
      });
    });    

    $.validator.addMethod("categoryNameRequired", $.validator.methods.required, "Please enter category name");
    $.validator.addClassRules("category-name", {
      categoryNameRequired: true,
      noSPace: true    
    });

    $.validator.addMethod("itemNameRequired", $.validator.methods.required, "Please enter item name");
    $.validator.addClassRules("item-name", {
      itemNameRequired: true,
      noSPace: true
    });

    $.validator.addMethod("uomRequired", $.validator.methods.required, "Please select uom");
    $.validator.addClassRules("uom", {
      uomRequired: true,
      // noSPace: true     
    });

    $.validator.addMethod("unitPriceRequired", $.validator.methods.required, "Please enter unit price");
    $.validator.addClassRules("unit-price", {
      unitPriceRequired: true,
      number: true,
      dollarsscents: true,
      // noSPace: true 
    });
  }

  NOVA.editCategory = function(){
    NOVA.categories_list().forEach(function(entry) {
      if(entry.category_id() == NOVA.editing_category()){
        category_id = entry.category_id();
        category_name = entry.category_name()
        category_items = entry.items()
      }
    })

    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('category_id', category_id)
    formdata.append('category_name', category_name);
    formdata.append('category_items', ko.toJSON(category_items));
    $.ajax({
      method: 'POST',
      url: '/api/admin/vs/category/edit',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.showToast(d)
      NOVA.getVsCategoriesList();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.confirmDelete = function(data, e){
    $("#confirmModal").modal('show')
    NOVA.delete_category_id(data.category_id())
  }


  NOVA.deleteCategory = function(data, e){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('category_id', NOVA.delete_category_id())
    $.ajax({
      method: 'POST',
      url: '/api/admin/vs/category/delete',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.showToast(d)
      $("#confirmModal").modal('hide')
      NOVA.getVsCategoriesList();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $("#confirmModal").modal('hide')
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.changeStatus = function(data) {
    if(data.is_active() == 'true') {
      NOVA.disableCategory(data.category_id());
    } else {
      NOVA.enableCategory(data.category_id());
    }
  }

  NOVA.disableCategory = function(category_id){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('category_id', category_id)
    $.ajax({
      method: 'POST',
      url: '/api/admin/vs/category/disable',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.showToast(d)
      NOVA.getVsCategoriesList();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.enableCategory = function(category_id){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('category_id', category_id)
    $.ajax({
      method: 'POST',
      url: '/api/admin/vs/category/enable',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.showToast(d)
      NOVA.getVsCategoriesList();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  $(document).on('show.bs.collapse','.collapse', function () {
    $(this).parent().find('.card-header .btn-link span').removeClass('icon-plus').addClass('icon-minus');
    // $(this).parent().parent().find('.form-control').attr('disabled','disabled');
    $(this).parent().parent().find('.item-delete-btn').prop('disabled',true);
    $(this).parent().parent().find('.item-add-btn').prop('disabled', true);
    // $(this).parent().find('.card-header .save-cost-btn').removeClass('d-none');
    // $(this).parent().find('.card-header .edit-cost-btn').addClass('d-none');
    // $(this).parent().find('.card-header .delete-cost-btn').attr('disabled','disabled');
    // $(this).parent().find('.card-header .disable-cost-btn').attr('disabled','disabled');
    // $(this).parent().find('.card-header .enable-cost-btn').attr('disabled','disabled');
  });

  $(document).on('hide.bs.collapse','.collapse', function () { 
    $(this).parent().find('.card-header .btn-link span').removeClass('icon-minus').addClass('icon-plus');
    // $(this).parent().find('.card-header .save-cost-btn').addClass('d-none');
    // $(this).parent().find('.card-header .edit-cost-btn').removeClass('d-none');
    // $(this).parent().find('.card-header .delete-cost-btn').removeAttr('disabled');
    // $(this).parent().find('.card-header .disable-cost-btn').removeAttr('disabled');
    // $(this).parent().find('.card-header .enable-cost-btn').removeAttr('disabled');
  });

  $('#navItemAdmin').addClass('active');
  
})(this);

function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    NOVA.getAppLogo();
    NOVA.getVSUOMList();
    ko.applyBindings(NOVA);
  }
}
document.onreadystatechange = init;