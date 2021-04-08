var rurl="http://api.openweathermap.org/data/2.5/forecast?appid=bdf0854466178764bfbed03dad31a9b4&units=metric&q="
var sevenDayF = "https://api.openweathermap.org/data/2.5/onecall?&appid=bdf0854466178764bfbed03dad31a9b4&units=metric&exclude=minutely,hourly&"
var imgbase="http://openweathermap.org/img/wn/"
var urlParams = new URLSearchParams(window.location.search);
var pagebase = location.protocol + '//' + location.host + location.pathname
var city = urlParams.get('city');

var cities=[]
var storedCities = JSON.parse(localStorage.getItem('cities'));
if (storedCities){
    checkcity=false
    for(i of storedCities){
        if (city.toLowerCase() != i.toLowerCase()){
            cities.push(i)
        }
    }
    cities.push(city);
}else{
    cities.push(city)
}
localStorage.setItem("cities",JSON.stringify(cities))
var storageCities=$(document.createElement('ul')).addClass("list-group");
var listgroup=$("#currentcities").append(storageCities);
for(c of cities){
   var liItem= $(document.createElement('li')).addClass("list-group-item");
   var atag=$(document.createElement('a')).attr("href",pagebase+"?city="+c).text(c);
   listgroup.append(liItem.append(atag));
}
$("#search_button").on("click",function(){
    var city = $("#city_search").val();
    window.location=pagebase+"?city="+city
    cities.push(city);
});
    rURL=rurl+city
    $.get(rURL, function() {}).done(function(citydata) { 
        var lnlo="lat="+citydata.city.coord.lat+"&lon="+citydata.city.coord.lon
        
        $.get(sevenDayF+lnlo, function() {}).done(function(data) { 
            var uvclass;
            console.log(data.current.uvi);
            if(parseFloat(data.current.uvi) < 2.00){
                uvclass="badge badge-success"
            }else if( parseFloat(data.current.uvi) < 5.00 ){
                uvclass="badge badge-warning"
            }else if(parseFloat(data.current.uvi) > 5.00){
                uvclass="badge badge-danger"
            }
            console.log(imgbase+data.current.weather[0].icon+'@2x.png');
            var current=$(document.createElement('div'));
            city='<h2>'+citydata.city.name+'&nbsp;<img src="'+imgbase+data.current.weather[0].icon+'@2x.png" /></h2>'
            // city='<h2>'+citydata.city.name+'</h2>'
            date='<h3>'+moment(data.current.dt,"X").format("dddd, MMMM Do YYYY")+'</h3>'
            temp='<h4><span>Temperature:</span> '+parseInt(data.current.temp)+' &#176;C</h4>'
            humidity='<h4><span>Humidity:</span> '+data.current.humidity+'%</h4>'
            windSpeed='<h4><span>Wind Speed:</span> '+data.current.wind_speed+'KM/H</h4>'
            uvi='<h4><span>UV Index:</span><span class="'+uvclass+'">'+data.current.uvi+'</span></h4>'
            $("#current").append(current.addClass("col-md-12 card shadow").append(city,date,temp,humidity,windSpeed,uvi))
            var day_cont=$(sevenday);
            for(day of data.daily){
                var daydiv=$(document.createElement('div')).addClass("col-md-3 card sevenday shadow text-white bg-primary mb-3");
                date='<h3>'+moment(day.dt,"X").format("dddd")+'</h3><span class="datexsmall">'+moment(day.dt,"X").format("MMMM Do YYYY")+'</span>'
                img='&nbsp;<img src="'+imgbase+day.weather[0].icon+'@2x.png" /><br>'
                temp='<h4><span>Temperature:</span> '+parseInt(day.temp.day)+' &#176;C</h4>'
                humidity='<h4><span>Humidity:</span> '+day.humidity+'%</h4>'
                day_cont.append(daydiv.append(date,img,temp,humidity))
            }
        });
    });


