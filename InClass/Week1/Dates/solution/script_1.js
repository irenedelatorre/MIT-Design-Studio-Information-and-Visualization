//Select #date and write the current date

var currentDate = new Date();

// date in an standard format
document.getElementById("date").innerHTML = currentDate.toDateString();


// select #time and write the current time
var hour = currentDate.getHours();
var minutes = currentDate.getMinutes();
var seconds = currentDate.getSeconds();

var currentHour = "" + hour + ":" + minutes + ":" + seconds;

document.getElementById("time").innerHTML = currentHour;


//select #year and write your birth year
var myBirthday = new Date("21 October 1987");

var birthYear = myBirthday.getFullYear();

document.getElementById("year").innerHTML = birthYear;





// select #difference and write how many days are left until your next birthday
// round the number to remove the decimals
var birthdayThisYear = new Date ((myBirthday.getMonth()+1) + "/" + myBirthday.getDate() + "/" + currentDate.getFullYear());
var difference = birthdayThisYear - currentDate;
var differenceInDays = Math.floor(difference / (1000*3600*24));

if (differenceInDays <0){
    differenceInDays = -1 * differenceInDays;
}

// console.log(birthdayThisYear);
//
// console.log(differenceInDays);

document.getElementById("difference").innerHTML = differenceInDays;