







$(document).ready(function() {
    
    $("#query-form").submit(function(event) { performSearch(event); });
  });
  
  
  
  var defunctDomains = [
    "kraftfoods.com",
    "cookeatshare.com",
    "find.myrecipes.com"
  ];
  
  
  
  
  function isADefunctSite(sampleSite) {
  
    var found = false;
  
    defunctDomains.forEach(
      function (item, index) {
        if (sampleSite.includes(item)) { found = true; }
      }
    );
  
    return found;
  
  }
  
  
  
  
  function formatSearchResults(jsonResults) {
  
    var jsonObject = JSON.parse(jsonResults);
    var siteCount = 0;
  
    if (jsonObject.results.length == 0) { 
       setNotFoundMessages(); 
    } 
     else { 
  
      $("#search-results-heading").text("Search Results");
      var formatedText = "";
  
      jsonObject.results.forEach(
        function(item, index) {
  
          if (isADefunctSite(item.href)) { return; } 
          siteCount++; 
  
          var thumbnail = item.thumbnail;
          if (thumbnail == "") { thumbnail = "images/generic_dish.jpg"; }  
  
          const href = item.href;
          const ingredient = item.ingredients;
  
          formatedText += "<div class='dish-image-div'><a " + " href='" + href + "' target='_blank'><img class='dish-image' width='80' src='" + thumbnail + "' alt='recipe picture, link to recipe page'></a></div>";
          formatedText += "<div " + "class='dish-title-div'><a href='" + href + "' target='_blank'>" + item.title + "</a></div>";
          formatedText += "<div class='dish-ingredients-div'>Main ingredients: " + ingredient + "</div>";
        }
      );
  
      
        $("#results").html(formatedText);
      
      
        
      
    } 
  
  }
  
  
  
  
  function performSearch(event) {
  
    
    var request;
  
    
    event.preventDefault();
  
    
    if (request) {
        request.abort();
    }
    
    var $form = $(this);
  
    
    setFormDisabledProps(true);
  
    $("#search-results-heading").text("Searching ...");
    $("#results").text("");
  
    
  
    request = $.ajax({
        url: "https://cors-anywhere.herokuapp.com/" + "http://www.recipepuppy.com/api/",
        type: "GET",
        data: { i: $("#ingredients").val(), q: $("#contains").val() }
    });
  
    
  
    request.done(function (response, textStatus, jqXHR){
         formatSearchResults(response);  
        
    });
  
    
  
    request.fail(function (jqXHR, textStatus, errorThrown){
        $("#search-results-heading").text("An error occurred. Please try again.");
        $("#results").text("");
    });
  
    
  
    request.always(function () {
        
        setFormDisabledProps(false);
    });
  
  }
  
  
  
  function resetResults() {
    $("#search-results-heading").text("");
    $("#results").text("");
  }
  
  
  
  
  function sanitizeInputs() {
    var str = $("#ingredients").val();
    str = str.replace(/[^a-zA-Z 0-9,]/gim, "");
    str = str.trim();
    $("#ingredients").val(str);
  
    
    var str = $("#contains").val();
    str = str.replace(/[^a-zA-Z 0-9,]/gim, "");
    str = str.trim();
    $("#contains").val(str);
  }
  
  
  
  function setFormDisabledProps(statusToSet) {
      document.getElementById("ingredients").disabled = statusToSet;
      document.getElementById("contains").disabled = statusToSet;
      document.getElementById("resetButton").disabled = statusToSet;
      document.getElementById("searchButton").disabled = statusToSet;
  }
  
  
  
  
  function setNotFoundMessages() {
    $("#search-results-heading").text("No recipes found, please change search criteria.");
    $("#results").text("");
  }
  