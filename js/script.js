
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load Google streetview
    var streetStr = $('#street').val();
    var cityStr = $('#city').val()
    var address = streetStr + ", " + cityStr;

    $greeting.text('So, you want to live at ' + address + '?')

    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=800x300&location=' + address + '';

    $body.append('<img class="bgimg" src="' + streetviewUrl + '">')

    //Start New York Times AJAX request
    var nytimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=2fb66a3e37d0469a876e1d25383ade90';

    //send ajax dynamic ajax request for articles related to the user's requested city
    $.getJSON(nytimesUrl, function(data) {

        $nytHeaderElem.text('New York Times Articles About ' + cityStr);
        //iterate through the first 3 news articles
        articles = data.response.docs;
        for (var i = 0; i < 4; i++) {
            var article = articles[i];
            //append the articles to the body of the page in an unordered list
            $nytElem.append('<li class="article">' +
                '<a href="' + article.web_url + '">' + article.headline.main + '</a>' +
                '<p>' + article.snippet + '</p>' +
                '</li>');
        };
   }).error(function(e){
        $nytHeaderElem.text('New York Times Articles could not be loaded')

        })

   //Start Wikipedia AJAX request
   var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';

   //set timer for 8 seconds to print error message if ajax request fails
   var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text('Failed to load wikipedia resources');}, 8000);

   //send ajax request for wikipedia articles related to the user's requested city
   $.ajax({
    url: wikiUrl,
    dataType: "jsonp",
    success: function( response ) {
        var articleList = response[1];

        //iterate through the articles listed in the reponse
        for (var i = 0; i < articleList.length; i++) {
            articleStr = articleList[i];
            var url = 'http://en.wikipedia.org/wiki/' + articleStr;
            $wikiElem.append('<li><a href="' + url + '">' +
                articleStr + '</a></li>');
        };
        //cancel error timer for ajax request timeout
        clearTimeout(wikiRequestTimeout);
    }
   })



    return false;
};

$('#form-container').submit(loadData);
