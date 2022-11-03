const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherForcastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const API_KEY = "e04f18ef1ad87add3bfd2e2ef27043ad";
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    var hourin12hrformat;
    if (hour > 12) {
        hourin12hrformat = hour - 12;
    } else {
        hourin12hrformat = hour;
    };
    if (hourin12hrformat < 10) {
        hourin12hrformat = "0" + hourin12hrformat;
    }
    var minutes = time.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    var ampm;
    if (hour >= 12) {
        ampm = "PM";
    } else {
        ampm = "AM";
    };                                                                     //${ampm}

    timeEl.innerHTML = hourin12hrformat + ":" + minutes + `<span id="am-pm">${ampm}</span>`;
    dateEl.innerHTML = days[day - 1] + ", " + date + " " + months[month - 1];  //change month-1 to month


}, 1000);

getWeather();
function getWeather() {
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success);
        //using object destructuring
        let {latitude, longitude } = success.coords;
        // let Latitude = success.coords.latitude;
        // let longitude = success.coords.longitude;
        console.log(latitude);
        console.log(longitude);

        //calling api                                                                                            //use &units=metric to change unit into metric and temp into celsuis
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data); //weather of given lat&long
            showWeatherdata(data); //call function here only to access the data
        })
    })

};

function showWeatherdata (data) {
    let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;
    // console.log(humidity, pressure, wind_speed);

   //Just to make approximation of temp, ignore 72-77
    var count=0;
    var i=data.current.temp;
    for(var j=1; j<i;j++){
        count++;
    }
    console.log(i);
    currentWeatherItemsEl.innerHTML =
    `
    <div class="weather-item">
    <div><b>Temperature&nbsp;&nbsp;</b></div>
    <div><b>${count}&#176;C</b></div>
    </div>
    <div class="weather-item"> 
    <div>Humidity</div>
    <div>${humidity}%</div>
    </div>
    <div class="weather-item">
    <div>Pressure</div>
    <div>${pressure}</div>
    </div>
    <div class="weather-item">
    <div>Wind speed</div>
    <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
    <div>Sunrise</div>
    <div>${window.moment(sunrise*1000).format(`HH:mm a`)}</div>
    </div>
    <div class="weather-item">
    <div>Sunset</div>
    <div>${window.moment(sunset*1000).format(`HH:mm a`)}</div>
    </div>`;

    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat+" N "+data.lon;
    var otherdayforecast=``;

    data.daily.forEach((element, index)=>{
        if(index == 0) {
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${element.weather[0].icon}@4x.png" alt="weathr-icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(element.dt*1000).format(`ddd`)}</div>
                <div class="temp">Night - ${element.temp.night}&#176;C</div>
                <div class="temp">Day - ${element.temp.day}&#176;C</div>
            </div>
            `;
        } else {
            
            otherdayforecast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(element.dt*1000).format(`ddd`)}</div>
                <img src="http://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png" alt="weathr-icon" class="w-icon">
                <div class="temp">Night - ${element.temp.night}&#176;C</div>
                <div class="temp">Day - ${element.temp.day}&#176;C</div>                    
            </div> `;
            
        }
    })

    weatherForcastEl.innerHTML = otherdayforecast;


}



//Promise
//example 1:
/*
let p = new Promise((resolve,reject) => {
    let a =1+1;
    if(a= 2){
        resolve("Success");
    } else{
        reject("Failed");
    };
});

p.then((message)=> {
    console.log("This is in the then : "+message);
}).catch((message)=>{
    console.log("This is in the catch : "+message);
});
*/
//example2 2:
/*
function func1(){
    return new Promise(function (resolve,reject){
        const error = true;
        if(!error){
            console.log("Function : Your promise is resolved");
            resolve();  //if you want to pass any value you can pass here inside resolve function.
        } else {
            console.log("Function : Your promise is not resolved");
            reject("Sorry not fulfilled");//Value passed as string.
        }
    });
};
func1().then(()=>{
    console.log("Ayush: Thanks for resolving.")
}).catch(function(error){
    console.log("Ayush: Sad. Reason : "+error);
});
*/