(function (window) {
  KRP = {};
  KRP.app_logo = ko.observable('');
  KRP.moviesList = ko.observableArray([]);
  KRP.moviesListOnline = ko.observableArray([]);
  KRP.getMovies = function(){
    var csrftoken = KRP.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/movie/list/get',
      beforeSend: function(xhr, settings) {
        KRP.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
      .done( function (d, textStatus, jqXHR) {
        console.log(d)
        d.data.forEach(x => {
          KRP.moviesList.push(x);
        });
      })
      .fail( function (jqXHR, textStatus, errorThrown) {
        KRP.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
      })
      .always(function(){
        KRP.hideLoading();
      })
  }

  // KRP.ajaxGet = function(){
  //   for (let year = 2015; year < 2020; year++) {
  //     for (let page = 1; page < 501; page++) {
      
  //       var settings = {
  //         "async": true,
  //         "crossDomain": true,
  //         "url": "https://api.themoviedb.org/3/discover/movie?primary_release_year="+year+"&page="+page+"&include_video=false&include_adult=false&sort_by=primary_release_date.asc&language=en-US&api_key=533cebbf81b3725e15f6ab60866b25cd",
  //         "method": "GET",
  //         "headers": {},
  //         "data": "{}"
  //       }
        
  //       $.ajax(settings).done(function (response) {
  //         KRP.moviesListOnline.push(response.results);
  //       });
  //     }
  //     setTimeout(function(){ console.log("THE YEAR IS "+year) }, 5000);
  //   }
    
  //   // var csrftoken = KRP.getCookie('csrftoken');
  //   // $.ajax({
  //   //   method: 'GET',
  //   //   url: '/api/movie/online',
  //   //   beforeSend: function(xhr, settings) {
  //   //     GBL.showLoading();
  //   //     xhr.setRequestHeader('X-CSRFToken', csrftoken);
  //   //   }
  //   // })
  //   //   .done( function (d, textStatus, jqXHR) {
        
  //   //   })
  //   //   .fail( function (jqXHR, textStatus, errorThrown) {
  //   //     GBL.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
  //   //   })
  //   //   .always(function(){
  //   //     GBL.hideLoading();
  //   //   })
  // }
  KRP.redirectMovie = function(){
    window.location = '/movie/list'
  }

  KRP.redirectTV = function(){
    window.location = '/tv'
  }

  KRP.redirectMovieDetail = function(data) {
    window.location = '/movie/'+data.uid
  }
  
  var toastTimer
  KRP.showToast = function( msg ){
    if ( $("#customToast").hasClass('visible') ) {
      $("#customToast").text(msg);
      window.clearTimeout(toastTimer)
      toastTimer = window.setTimeout(function(){
        $("#customToast").removeClass('visible')
      }, 3000)
    } else {
      $("#customToast").text(msg).addClass('visible')
      toastTimer = window.setTimeout(function(){
        $("#customToast").removeClass('visible')
      }, 3000)
    }
    
  };

  KRP.showLoading = function(){
    $(".loader").show();
    $(".no-data").removeClass('active');
  };

  KRP.hideLoading = function(){
    $(".loader").hide();
    $(".no-data").addClass('active');
  };

  KRP.showErrorModal = function(msg){
    $("#errorModal").modal('show');
    $("#errorMessage").text(msg);
  };

  KRP.showErrorToast = function(data, e){
    e.stopPropagation()
    KRP.showToast("Feature not implemented")
  }

  KRP.getCookie = function(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  KRP.getAppLogo = function(){
    var csrftoken = KRP.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/app/logo/get',
      beforeSend: function(xhr, settings) {
        // KRP.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      KRP.app_logo(d)
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      KRP.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      // KRP.hideLoading();
    })
  };
  
})(this);

function init() {
  if (document.readyState == "interactive") {
    KRP.hideLoading();
    KRP.getMovies();
    // KRP.ajaxGet();
    ko.applyBindings(KRP);
  }
}
document.onreadystatechange = init;