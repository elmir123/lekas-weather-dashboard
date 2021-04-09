//api to get city long and lat coordinates
var rurl="http://api.openweathermap.org/data/2.5/forecast?appid=bdf0854466178764bfbed03dad31a9b4&units=metric&q="
//api url to the 7 day api
var sevenDayF = "https://api.openweathermap.org/data/2.5/onecall?&appid=bdf0854466178764bfbed03dad31a9b4&units=metric&exclude=minutely,hourly&"
//weather image base url
var imgbase="http://openweathermap.org/img/wn/"
//get parameters from the url
var urlParams = new URLSearchParams(window.location.search);
//get pagebase url
var pagebase = location.protocol + '//' + location.host + location.pathname
//city parameter value
var city = urlParams.get('city');

//setting the cities array
var cities=[]
//inital push the city to the cities array
if (city){
    cities.push(city) 
}
// get stored items in cities
var storedCities = JSON.parse(localStorage.getItem('cities'));
//time interval
setInterval(function(){
    $("#time").text(moment().format("dddd, MMMM Do YYYY, hh:mm:ss"))
},1000)
//iterate over cities to build link list
if (storedCities){
    for(i of storedCities){
        if (city){
            if (city.toLowerCase() != i.toLowerCase()){
                cities.push(i)
            }
        }else{
            cities.push(i)
        }
    }
}
//store cities again to the storage
localStorage.setItem("cities",JSON.stringify(cities))
//create ul element
var storageCities=$(document.createElement('ul')).addClass("list-group");
//append  lists
var listgroup=$("#currentcities").append(storageCities);
//cities iteration to create a links
for(c of cities){
   var liItem= $(document.createElement('li')).addClass("list-group-item");
   var atag=$(document.createElement('a')).attr("href",pagebase+"?city="+c).text(c);
   listgroup.append(liItem.append(atag));
}
//search cities
$("#search_button").on("click",function(){
    var city = $("#city_search").val();
    window.location=pagebase+"?city="+city
    cities.push(city);
});
//city handling
if (city){
    $(".daylycard").show();
    rURL=rurl+city
    $.get(rURL, function() {}).done(function(citydata) { 
        var lnlo="lat="+citydata.city.coord.lat+"&lon="+citydata.city.coord.lon
        
        $.get(sevenDayF+lnlo, function() {}).done(function(data) { 
            var uvclass;
            //handle the uvi coloring
            console.log(data.current.uvi);
            if(parseFloat(data.current.uvi) < 2.00){
                uvclass="badge badge-success"
            }else if( parseFloat(data.current.uvi) < 5.00 ){
                uvclass="badge badge-warning"
            }else if(parseFloat(data.current.uvi) > 5.00){
                uvclass="badge badge-danger"
            }
            //build current div and text
            var current=$(document.createElement('div'));
            city='<h2>'+citydata.city.name+'&nbsp;<img src="'+imgbase+data.current.weather[0].icon+'@2x.png" /></h2>'
            // city='<h2>'+citydata.city.name+'</h2>'
            date='<h3>'+moment(data.current.dt,"X").format("dddd, MMMM Do YYYY")+'</h3>'
            temp='<h4><span>Temperature:</span> '+parseInt(data.current.temp)+' &#176;C</h4>'
            humidity='<h4><span>Humidity:</span> '+data.current.humidity+'%</h4>'
            windSpeed='<h4><span>Wind Speed:</span> '+data.current.wind_speed+'KM/H</h4>'
            uvi='<h4><span>UV Index:</span><span class="'+uvclass+'">'+data.current.uvi+'</span></h4>'
            $("#current").append(current.addClass("col-md-12 card shadow").append(city,date,temp,humidity,windSpeed,uvi))
            //build the 7 day forcast
            var day_cont=$(sevenday);
            //set first item to today other will have day of the week
            var first_item=true
            for(day of data.daily){
                var daydiv=$(document.createElement('div')).addClass("col-md-3 col-5 card sevenday shadow text-white bg-primary mb-3");
                if (first_item){
                    date='<h3>Today</h3><span class="datexsmall">'+moment(day.dt,"X").format("MMMM Do YYYY")+'</span>'
                }else{
                    date='<h3>'+moment(day.dt,"X").format("dddd")+'</h3><span class="datexsmall">'+moment(day.dt,"X").format("MMMM Do YYYY")+'</span>'
                }
                first_item=false
                img='&nbsp;<img src="'+imgbase+day.weather[0].icon+'@2x.png" /><br>'
                temp='<h4><span>Temperature:</span> '+parseInt(day.temp.day)+' &#176;C</h4>'
                humidity='<h4><span>Humidity:</span> '+day.humidity+'%</h4>'
                day_cont.append(daydiv.append(date,img,temp,humidity))
            }
        });
    });
}

