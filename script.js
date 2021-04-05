'use strict';

const timesContainer = document.querySelector('#times-container');
const weatherContainer = document.querySelector('#weather-container');
const control = document.querySelector('#control');
const pausePlay = document.querySelector('#pause-play');
const videoBackground = document.querySelector('#video-back');
const timeDisplay = document.querySelector('#timeDisplay');

const rain = new Audio('./res/rain.mp3');
const beach = new Audio('./res/beach.mp3');
const wind = new Audio('./res/wind.mp3');
const music = new Audio('./res/Debussy-Clair de Lune.mp3');
const beep = new Audio('./res/beep.mp3');
beep.volume = 0.3;

const audioArr = [
    { 
        audio: rain,
        type: 'rain'
    }, 

    { 
        audio: beach,
        type: 'beach' 
    },

    { 
        audio: wind,
        type: 'wind' 
    }, 

    { 
        audio: music,
        type: 'music' 
    }
];

//to be in seconds
let time;
//actual timer using setInterval()
let timer;
//flag to check if timer is running
let isTimerRunning;
//current background video
let currentBackground = 'rain';

const setTimer = (duration) => {
    time = duration;

    //updating front end
    if(duration === 60) timeDisplay.textContent = '1:00';
    if(duration === 300) timeDisplay.textContent = '5:00';
    if(duration === 600) timeDisplay.textContent = '10:00';
};

const startTimer = () => {
    const tick = () => {
      const min = String(Math.trunc(time / 60)).padStart(1, '0');
      const seconds = String(time % 60).padStart(2, '0');
  
      //in each call, update the remaining time to UI
      timeDisplay.textContent = `${min}:${seconds}`;
  
      //if 0 seconds, stop timer and play sound effect
      if(time === 0){
        beep.play();
        stopAllAudio();
        changeIcon(false);
        clearInterval(timer); 
      }
  
      //decrement by 1 second
      time -= 1;
    };

    isTimerRunning = true;
  
    //call the timer every second 
    tick();
    timer = setInterval(tick, 1000);
};

const stopTimer = () => {
    isTimerRunning = false;
    clearInterval(timer);
};

const changeIcon = (toPlaying) => {
    if(toPlaying === true) {
        pausePlay.setAttribute('href', './res/symbol-defs.svg#icon-controller-paus');
    } else {
        pausePlay.setAttribute('href', './res/symbol-defs.svg#icon-play');
    }
};

const playAudio = (background) => {
    let currentAudio = audioArr.find(curr => curr.type === background);
    currentAudio.audio.play();
};

const stopAllAudio = () => {
    audioArr.map(curr => curr.audio.pause());
};


    
timesContainer.addEventListener('click', (e) => {
    stopAllAudio();

    //if timer is running, clear the timer; will be set to another time below
    if(timer && time != 0){
        stopTimer();
    }

    //if '2 Minutes' button was clicked
    if (e.target.classList.contains('btn-timer--1min')){
        setTimer(60);
        changeIcon(false);
    } 

    //if '5 Minutes' button was clicked
    if (e.target.classList.contains('btn-timer--5min')){
        setTimer(300);
        changeIcon(false);
    } 

    //if '10 Minutes' button was clicked
    if (e.target.classList.contains('btn-timer--10min')){
        setTimer(600);
        changeIcon(false);
    } 
});

//event propagation triggering parent element
control.addEventListener('click', () => {
    //if time is a falsy value - e.g. 0 or undefined; do nothing
    if(!time) return;

    if(isTimerRunning) {
        beep.play();
        changeIcon(false);
        stopTimer();
        stopAllAudio();
    } else {
        beep.play();
        startTimer();
        changeIcon(true);
        playAudio(currentBackground);  
    }
});

weatherContainer.addEventListener('click', (e) => {
    if(e.target.closest('.btn-weather--rain') || e.target.classList.contains('btn-weather--rain')) {
        videoBackground.setAttribute('src', './res/background-video-rain.mp4');
        currentBackground = 'rain';
        stopAllAudio();
        playAudio(currentBackground);
    }
        
    if(e.target.closest('.btn-weather--beach') || e.target.classList.contains('btn-weather--beach')) {
        videoBackground.setAttribute('src', './res/background-video-beach.mp4');
        currentBackground = 'beach';
        stopAllAudio();
        playAudio(currentBackground);
    }

    if(e.target.closest('.btn-weather--wind') || e.target.classList.contains('btn-weather--wind')) {
        videoBackground.setAttribute('src', './res/background-video-wind.mp4');
        currentBackground = 'wind';
        stopAllAudio();
        playAudio(currentBackground);
    }
   
    if(e.target.closest('.btn-weather--music') || e.target.classList.contains('btn-weather--music')) {
        videoBackground.setAttribute('src', './res/background-music.mp4');
        currentBackground = 'music';
        stopAllAudio();
        playAudio(currentBackground);
    }
});