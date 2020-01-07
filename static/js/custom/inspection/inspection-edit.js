(function (window) {
  NOVA.inspection_name = ko.observable();
  NOVA.description = ko.observable();
  NOVA.inspection_id = ko.observable();
  NOVA.periodicity = ko.observable('');
  NOVA.add_category = ko.observable(true);
  
  NOVA.periodicity_list = ko.observableArray([]);
  NOVA.inspectionItemsLst = ko.observableArray([]);

  var inspection_item = function () {
    this.parent_item_id = ko.observable('');
    this.parent_item_name = ko.observable('');
    this.parent_item_edit = ko.observable(false);

    this.item_child_lst = ko.observableArray([]);

    this.fill = function (d) {
      this.parent_item_id('' || d.parent_item_id);
      this.parent_item_name('' || d.parent_item_name);
      this.parent_item_edit('' || d.parent_item_edit);

      for(var i=0;i<d.item_child_lst.length;i++){
        var child_item1 = new child_item();
        child_item1.fill(d.item_child_lst[i]);
        this.item_child_lst.push(child_item1);
      }
      
    }
  }

  var child_item = function () {
    this.child_item_id = ko.observable('');
    this.child_item_name = ko.observable('');
    this.child_item_edit = ko.observable(true);

    this.fill = function (d) {
      this.child_item_id('' || d.child_item_id);
      this.child_item_name('' || d.child_item_name);
      this.child_item_edit('' || d.child_item_edit);
    }
  };
  
  $('.search-only').select2({
      width: '100%',
      tags: false,
    });

  jQuery.validator.addMethod("noSPace", function(value, element) {
      return this.optional(element) || /^[a-z,0-9]/i.test(value);
  }, "First space is not allowed");

  var inspectionCreateValidator = $("#inspectionCreate").validate({
    errorElement: 'span',
    errorClass: 'error text-danger',
    errorPlacement: function(error, element) {
      if (element.parent().hasClass("input-group")) {
        error.appendTo( element.parent().parent());
      } else if (element.parent().hasClass("custom-radio")) {
        error.appendTo( element.parent().parent().parent());
      } else {
        error.appendTo( element.parent());
      }
    },
    rules: {
      inspectionName: {
        required: true,
        noSPace: true
      },
      inspectionDescription : {
        required: true,
        noSPace: true
      },
      periodocity: {
        required: true
      },
      serviceRecord: {
        required: true
      },
    },
    messages: {
      inspectionName: {
        required: "Please enter inspection name"
      },
      inspectionDescription : {
        required: "Please enter inspection description"
      },
      periodocity: {
        required: "Please select periodocity"
      },
      serviceRecord: {
        required: "Please select"
      },
    },
    submitHandler: function() {
      NOVA.updateInspection();
    }
  });

  // $('.category-create-btn').on('click', function(){
  //   $('.inspection-item-create').removeClass('d-none');
  // });

  $('.parent_item_name_input').on('keyup', function(){
    var space = $(this).val().match(/^[a-z,0-9]/);
    if(($(this).val()!='') && (space)) {
      $(this).parent().find('.save-icon').prop('disabled', false);
    }else {
      $(this).parent().find('.save-icon').prop('disabled', true);
    }
  });

  $('.parent-header .save-icon').on('click', function(){
    $(this).parent().parent().parent().find('.collapse').removeClass('d-none').addClass('show');
  });

  $('.add-item-btn').on('click', function(){
    $(this).parent().parent().find('.card').removeClass('d-none');
    $(this).prop('disabled', true);
  });

  $('.child_item_name_input').on('keyup', function(){
    var space = $(this).val().match(/^[a-z,0-9]/);
    if(($(this).val()!='') && (space)) {
      $(this).parent().parent().find('.save-icon').prop('disabled', false);
    }else {
      $(this).parent().parent().find('.save-icon').prop('disabled', true);
    }
  });

  $(document).on('show.bs.collapse','.collapse', function () {
    $(this).parent().find('.card-header .btn-link span').removeClass('icon-plus').addClass('icon-minus');    
  });

  $(document).on('hide.bs.collapse','.collapse', function () { 
    $(this).parent().find('.card-header .btn-link span').removeClass('icon-minus').addClass('icon-plus');
  });


  NOVA.getPeriodicity = function (){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/inspection/periodicity/get',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.periodicity_list([]);
      for(var i=0; i<d.length; i++){
        NOVA.periodicity_list.push(d[i]);
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };


  NOVA.updateInspection = function(){
    var serviceRecord = $('input[name=serviceRecord]:checked').val();
    var signRequired = $('input[name=signRequired]:checked').val();
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('inspection_id',NOVA.inspection_id());
    formdata.append('name',NOVA.inspection_name());
    formdata.append('description',NOVA.description());
    formdata.append('add_servicerecord',serviceRecord);
    formdata.append('is_sign_required',signRequired);
    $.ajax({
      method: 'POST',
      url: '/api/inspection/update/inspection',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      $('#inspectionName,#inspectionDescription,.serviceRecord,.signRequired').attr("disabled","disabled");
      $('#inspectionEdit').removeClass('d-none')
      $('#inspectionSave').addClass('d-none')
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.createInspection = function(){
    var serviceRecord = $('input[name=serviceRecord]:checked').val();
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('name',NOVA.inspection_name());
    formdata.append('description',NOVA.description());
    formdata.append('add_servicerecord',serviceRecord);
    $.ajax({
      method: 'POST',
      url: '/api/inspection/create/inspection',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      $('#inspectionName,#inspectionDescription,.serviceRecord,.signRequired').attr("disabled","disabled");
      $('#inspectionSave').attr("disabled","disabled");
      $('#addNewCategory').removeClass('d-none');
      NOVA.inspection_id(d.inspection_id);
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.getInspectionDetails = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = {
      'inspection_id': NOVA.inspection_id()
    }
    $.ajax({
      method: 'GET',
      url: '/api/inspection/configure/details/get',
      data: formdata,
      datatype: 'json',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      $('#inspectionName,#inspectionDescription,.serviceRecord,.signRequired').attr("disabled","disabled");
      NOVA.inspection_name(d.name);
      NOVA.description(d.description);
      NOVA.inspectionItemsLst([]);
      for(var i=0;i<d.inspectionitems.length;i++){
        var inspection_item1 = new inspection_item();
        inspection_item1.fill(d.inspectionitems[i]);
        NOVA.inspectionItemsLst.push(inspection_item1);
      }
      if(d.add_servicerecord == true){
        $('#serviceRecordYes').attr('checked', true);
      }else{
        $('#serviceRecordNo').attr('checked', true);
      }
      if(d.is_sign_required == true){
        $('#signRequired-yes').attr('checked', true);
      }else{
        $('#signRequired-no').attr('checked', true);
      }
      if(d.inspectionitems.length > 0){
        $('#inspectionSave,#inspectionEdit').attr("disabled","disabled");
      }
      $('#addNewCategory').removeClass('d-none');
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.editInspection = function(){
    $('#inspectionName,#inspectionDescription,.serviceRecord,.signRequired').attr("disabled",false);
    $('#inspectionEdit').addClass('d-none')
    $('#inspectionSave').removeClass('d-none')
  };

  NOVA.keyup_validation = function(d, e) {
    var getId = $(e.currentTarget).attr('id');
    if($(e.currentTarget).val() == '') {
      $('#'+getId+'-btn').attr('disabled', true);
    } else {
      $('#'+getId+'-btn').attr('disabled', false);
    }
  };

  NOVA.addNewCategory = function(){
    NOVA.add_category(false);
    $('.add-item-btn,.add-new-category-btn').prop('disabled', true);
    $('.inspection-item-create').removeClass('d-none');
    var inspection_item1 = new inspection_item();
    var data = {'parent_item_id':'','parent_item_name':'','parent_item_edit': false,'item_child_lst':[]}
    inspection_item1.fill(data)
    NOVA.inspectionItemsLst.push(inspection_item1);
    $('.parent_item_name_input:visible').focus();
  };

  NOVA.saveparentItems = function(index,data,event){
    if (data.parent_item_id() == ''){
      NOVA.itemCreate(index,data,event);
    }else{
      NOVA.itemUpdate(index,data,event);
    }
    if($('.parent_item_name_input').length<=1 && $('.child_item_name_input').length==0) {
      $('.add-item-btn,.add-new-category-btn,#confirmInspection').prop('disabled', false)
    } else {
      $('.add-item-btn,.add-new-category-btn,#confirmInspection').prop('disabled', true)
    }
    $('#inspectionEdit').attr("disabled","disabled");
  };

  NOVA.editparentItems = function(index,data,event){
    NOVA.add_category(false);
    $('.add-item-btn,.add-new-category-btn').prop('disabled', true)
    data.parent_item_edit(false)
    $(event.currentTarget).parent().parent().find('.form-control').removeClass('d-none');
    $(event.currentTarget).parent().parent().find('h5').addClass('d-none');
  };

  NOVA.itemCreate = function(index,data,event){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('inspection_id',NOVA.inspection_id());
    formdata.append('name',data.parent_item_name());
    $.ajax({
      method: 'POST',
      url: '/api/inspection/configure/item/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.add_category(true)
      data.parent_item_edit(true);
      data.parent_item_id(d.inspection_item_id);
      $(event.currentTarget).parent().parent().find('.form-control').addClass('d-none');
      $(event.currentTarget).parent().parent().find('h5').removeClass('d-none');
      $('#category-'+index).addClass('show');
      console.log($(event.currentTarget).parent());
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.itemUpdate = function(index,data,event){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('inspection_id',NOVA.inspection_id());
    formdata.append('name',data.parent_item_name());
    formdata.append('item_id',data.parent_item_id());
    $.ajax({
      method: 'POST',
      url: '/api/inspection/configure/item/update',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.add_category(true)
      data.parent_item_edit(true);
      data.parent_item_id(d.inspection_id);
      $(event.currentTarget).parent().parent().find('.form-control').addClass('d-none');
      $(event.currentTarget).parent().parent().find('h5').removeClass('d-none');
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.addchildItems = function(index,data,event){
    NOVA.add_category(false);
    NOVA.add_category(false)
    $('.add-item-btn,.add-new-category-btn,#confirmInspection').prop('disabled', true)
    var child_item1 = new child_item();
    var data = {'child_item_id':'','child_item_name':'','child_item_edit': false}
    child_item1.fill(data);
    NOVA.inspectionItemsLst()[index].item_child_lst.push(child_item1);
    $('.child_item_name_input:visible').focus();
  };

  NOVA.savechildItems = function(parent,index,data,event){
    if($('.parent_item_name_input').length==0 && $('.child_item_name_input').length<=1) {
      $('.add-item-btn,.add-new-category-btn,#confirmInspection').prop('disabled', false)
    } else {
      $('.add-item-btn,.add-new-category-btn,#confirmInspection').prop('disabled', true)
    }
    if (data.child_item_id() == ''){
      NOVA.itemchildCreate(parent,index,data,event);
    }else{
      NOVA.itemchildUpdate(parent,index,data,event);
    }
  };


  NOVA.itemchildCreate = function(parent,index,data,event){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('inspection_id',NOVA.inspection_id());
    formdata.append('name',data.child_item_name());
    formdata.append('item_parent_id',NOVA.inspectionItemsLst()[parent].parent_item_id());
    $.ajax({
      method: 'POST',
      url: '/api/inspection/configure/item/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.add_category(true);
      data.child_item_edit(true);
      data.child_item_id(d.inspection_item_id);
      $(event.currentTarget).parent().parent().find('.form-control').addClass('d-none');
      $(event.currentTarget).parent().parent().find('h5').removeClass('d-none');
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.editchildItems = function(parent,index,data,event){
    NOVA.add_category(false);
    $('.add-item-btn,.add-new-category-btn,#confirmInspection').prop('disabled', true)
    data.child_item_edit(false)
    $(event.currentTarget).parent().parent().find('.form-control').removeClass('d-none');
    $(event.currentTarget).parent().parent().find('h5').addClass('d-none');
  };

  NOVA.itemchildUpdate = function(parent,index,data,event){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('inspection_id',NOVA.inspection_id());
    formdata.append('name',data.child_item_name());
    formdata.append('item_id',data.child_item_id());
    $.ajax({
      method: 'POST',
      url: '/api/inspection/configure/item/update',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.add_category(true);
      data.child_item_edit(true);
      data.child_item_id(d.inspection_id);
      $(event.currentTarget).parent().parent().find('.form-control').addClass('d-none');
      $(event.currentTarget).parent().parent().find('h5').removeClass('d-none');
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.removeparentItems = function(index,data,event){
    if($('.parent_item_name_input').length<=1 && $('.child_item_name_input').length==0) {
      $('.add-item-btn,.add-new-category-btn,#confirmInspection').prop('disabled', false)
    } else {
      $('.add-item-btn,.add-new-category-btn,#confirmInspection').prop('disabled', true)
    }
    if(data.parent_item_id() == ''){
      NOVA.inspectionItemsLst.splice(index,1);
    }else{
      NOVA.removeCategoryItem(index,data,event);
    }
    if(NOVA.inspectionItemsLst().length == 0){
      $('.add-new-category-btn,#confirmInspection').prop('disabled', false)
    }
  };

  NOVA.removeCategoryItem = function(index,data,event){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('inspection_id',NOVA.inspection_id());
    formdata.append('parent_item_id',data.parent_item_id());
    $.ajax({
      method: 'POST',
      url: '/api/inspection/category/item/remove',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.inspectionItemsLst.splice(index,1);
      if(NOVA.inspectionItemsLst().length == 0){
        $('.add-new-category-btn,#confirmInspection').prop('disabled', false)
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.removechildItems = function(parent,index,data,event){
    if($('.parent_item_name_input').length==0 && $('.child_item_name_input').length<=1) {
      $('.add-item-btn,.add-new-category-btn,#confirmInspection').prop('disabled', false)
    } else {
      $('.add-item-btn,.add-new-category-btn,#confirmInspection').prop('disabled', true)
    }
    if(data.child_item_id() == ''){
      NOVA.inspectionItemsLst()[parent].item_child_lst.splice(index,1);
    }else{
      NOVA.removechildCategoryItem(parent,index,data,event);
    }
  };

  NOVA.removechildCategoryItem = function(parent,index,data,event){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('inspection_id',NOVA.inspection_id());
    formdata.append('child_item_id',data.child_item_id());
    $.ajax({
      method: 'POST',
      url: '/api/inspection/child/item/remove',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.inspectionItemsLst()[parent].item_child_lst.splice(index,1);
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
  $('#navItemInspection').addClass('active');
  ko.applyBindings(NOVA);
  NOVA.hideLoading();
  var docUrlArr = document.URL.split('/');
  var inspection_id = docUrlArr[docUrlArr.length - 1];
  NOVA.inspection_id(inspection_id);
  NOVA.getInspectionDetails();
  NOVA.getAppLogo();
  }
}

document.onreadystatechange = init;