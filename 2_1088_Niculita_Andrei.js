
let listVideo = document.querySelectorAll(".video-list .vid");
let listVideo2 = document.querySelector(".video-list");
let mainVideo = document.querySelector(".main-video video");
let title = document.querySelector(".main-video .title");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let requestId;
let effect = "normal";
let rotateDeg = 0;
let containerVideoBar = document.querySelector(".containerVideoBar");
let mainVideoCustomPlayer = document.getElementById("mainVideo");
let playPauseBtn = document.querySelector(".play-pause i");
let videoTimeline = document.querySelector(".video-timeline");
let videoDuration = document.querySelector(".video-duration");
let progressBar = document.querySelector(".progress-bar");
let skipBackward = document.querySelector(".skip-backward i");
let skipForward = document.querySelector(".skip-forward i");
let volumeBtn = document.querySelector(".volume i");
let volumeSlider = document.querySelector(".left input");
let currentVidTime = document.querySelector(".current-time");
let speedBtn = document.querySelector(".playback-speed span");
let speedOptions = document.querySelector(".speed-options");
let container = document.querySelector("container");
let picInPicBtn = document.querySelector(".pic-in-pic span");
let fullscreenBtn = document.querySelector(".fullscreen i");
let timer;
let btnSortbyName = document.getElementById("btnPlayPause");
let btnUpload=document.getElementById("btnupload");

let mainVideoContainer=document.querySelector(".main-video");


document.body.style.background="url('media/backgroundGry.webp')";



document.getElementById("btnNormal").addEventListener("click", () => (effect = "normal"));
document.getElementById("btnGrayscale").addEventListener("click", () => (effect = "grayscale"));

document.getElementById("btnRotation").addEventListener("click", () => {
  rotateDeg += 180;
  canvas.style.transform = "rotate(" + rotateDeg + "deg)";
});

document.getElementById("btnEmboss").addEventListener("click", () => (effect = "emboss"));
document.getElementById("btnRedscale").addEventListener("click", () => (effect = "redscale"));



mainVideo.addEventListener("loadedmetadata", () => {
  var divMainVideo = mainVideoContainer.offsetHeight;
  listVideo2.style.height=divMainVideo+"px";
  mainVideoContainer.addEventListener("resize",function() {
    listVideo2.style.height=divMainVideo+"px";
  });
  canvas.width = mainVideo.videoWidth;
  canvas.height = mainVideo.videoHeight;
});

mainVideo.addEventListener("pause", () => {
  cancelAnimationFrame(requestId);
});

mainVideo.addEventListener("play", () => {
  updateCanvas();
});

function updateCanvas() {
  context.drawImage(mainVideo, 0, 0);
  let subtitlesButton = document.getElementsByClassName("subtitlesbtn");


  switch (effect) {
    case "normal":
      mainVideo.style.display = "block";
      subtitlesButton[0].style.display="block";

      break;
    case "grayscale":
      mainVideo.style.display = "none";
   
      subtitlesButton[0].style.display="none";

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const average = Math.round((r + g + b) / 3);

        data[i] = data[i + 1] = data[i + 2] = average;
      }
      context.putImageData(imageData, 0, 0);
      break;
    case "redscale":
      mainVideo.style.display = "none";
      subtitlesButton[0].style.display="none";
      const imageData3 = context.getImageData(0,0,canvas.width,canvas.height);
      const data2 = imageData3.data;
      for (let i = 0; i < data2.length; i += 4) {
        const r = data2[i];
        const g = data2[i + 1];
        const b = data2[i + 2];

        const average = Math.round((r + g + b) / 3);

        data2[i] = average + 300;
        data2[i + 1] = average;
        data2[i + 2] = average;
      }
      context.putImageData(imageData3, 0, 0);
      break;
    case "emboss":
      mainVideo.style.display = "none";
      subtitlesButton[0].style.display="none";
      context.drawImage(
        mainVideo,
        0,
        0,
        mainVideo.clientWidth,
        mainVideo.clientHeight
      );
      const imageData2 = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
      const pixels = imageData2.data;
      const imgDataWidth = imageData2.width;

      for (let i = 0; i < pixels.length; i++) {
        if (i % 4 != 3) {
          pixels[i] =
            127 + 2 * pixels[i] - pixels[i + 4] - pixels[i + imgDataWidth * 4];
        }
      }
      context.putImageData(imageData2, 0, 0);

      break;
  }

  requestId = requestAnimationFrame(() => updateCanvas()); // permite sa programati o functie care sa fie apelata inainte de devopsirea video-ului
}

//drag and drop

let files = [];
button = document.querySelector(".top button");
form = document.querySelector("form");
container2 = document.querySelector(".container2");
text = document.querySelector(".inner");
input = document.querySelector("form input");

btnUpload.addEventListener("click", () => input.click());
input.addEventListener("change", () => {
  let file = input.files;

  for (let i = 0; i < file.length; i++) {
    files.push(file[i]);
  }
  form.reset();
  insertNewVideo();
});

//#region  DRAG & DROP Video
function dropHandler(ev) {
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    [...ev.dataTransfer.items].forEach((file, i) => {
      const currentFile = file.getAsFile();

      if (
        currentFile.type !== "video/mp4" &&
        currentFile.type !== "video/webm"
      ) {
        console.error(
          "Error: Invalid file type. Only MP4 and WEBM video formats are allowed."
        );
        return;
      }

      if (!/^[a-z0-9._-]+$/i.test(currentFile.name)) {
        console.error(
          "Error: Invalid file name. File name can only contain letters, numbers, dots, underscores, and dashes."
        );
        return;
      }

      files.push(currentFile);
      insertNewVideo();
    });
  } else {
    [...ev.dataTransfer.files].forEach((file, i) => {
      if (currentFile.type !== "video/mp4" && file.type !== "video/webm") {
        console.error(
          "Error: Invalid file type. Only MP4 and WEBM video formats are allowed."
        );
        return;
      }
      if (!/^[a-z0-9._-]+$/i.test(file.name)) {
        console.error(
          "Error: Invalid file name. File name can only contain letters, numbers, dots, underscores, and dashes."
        );
        return;
      }

      files.push(file);
      insertNewVideo();
    });
  }
}

function dragOverHandler(ev) {
  ev.preventDefault();
}

//#endregion


let videoList = [
  {
    name: "Avatar: The way of water.mp4",
    src: "http://127.0.0.1:5503/media/avatar-trailer.mp4",
  },
];

function sortVideosByDuration(videos) {
  videos.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });
}

btnSortbyName.addEventListener("click", () => {
  sortVideosByDuration(videoList);
  displayVideo();
});

let MainVideoObject = {
  name: title.innerText,
  src: mainVideo.src,
  index: 0,
};

function displayToMain(index) {

  const subtitlesButton = document.getElementsByClassName("subtitlesbtn");
  
  const videoSubtitles = mainVideo.textTracks[0];


  if(index != 0) {
    subtitlesButton[0].style.display="none";
    videoSubtitles.mode = "disabled";

  }
  else {
    subtitlesButton[0].style.display="inline";
    videoSubtitles.mode = "showing";


  }


  effect = "normal";

  playPauseBtn.classList.replace("fa-pause", "fa-play");

  mainVideo.src = videoList[index].src;
  title.innerHTML = videoList[index].name;

  MainVideoObject.name = title.innerText;
  MainVideoObject.src = mainVideo.src;
  MainVideoObject.index = index;
}

function startPreview(event) {
  const video = event.target;
  video.muted = true;
  video.currentTime = 1;
  video.playbackRate = 0.5;
  video.play();
}

function stopPreview(event) {
  const video = event.srcElement;
  video.currentTime = 0;
  video.playbackRate = 1;
  video.muted = false;
  video.pause();
}

function displaySubtitles() {
  const subtitlesButton = document.getElementsByClassName("subtitlesbtn");
  const videoSubtitles = mainVideo.textTracks[0];


  if (videoSubtitles.mode == "showing") {
    subtitlesButton[0].style.backgroundColor = "#fff";
    subtitlesButton[0].style.color = "#000";
    videoSubtitles.mode = "disabled";
  } else {
    subtitlesButton[0].style.backgroundColor = "#000";
    subtitlesButton[0].style.color = "#fff";

    videoSubtitles.mode = "showing";
  }
}

function displayVideo() {

  let otherVideo = videoList?.map((video, index) => {
    return `<div class="vid" onclick="displayToMain(${index}) ">
              <video src="${
                video.src
              }" alt="video" onmouseover="startPreview(event)" onmouseleave="stopPreview(event)"></video>
              <h3 class="title">0${index + 1}. ${video.name}</h3>
              <span onclick="deleteVideo(${index})">&times;</span>
          </div>`;
  });

  let HTMLVideoList = document.getElementById("videoList");

  HTMLVideoList.innerHTML = "";

  otherVideo.forEach((video) => {
    HTMLVideoList.innerHTML += video;
  });
}

displayVideo();

let video = ``;

const insertNewVideo = () => {
  files.forEach((e, i) => {
    videoList.push({
      name: e.name,
      src: URL.createObjectURL(e),
    });
  });
  files = [];

  displayVideo();
};

const deleteVideo = (index) => {
  videoList.splice(index, 1);

  displayVideo();
};

//Custom video player

playPauseBtn.addEventListener("click", () => {
  if (mainVideo.paused) {
    mainVideo.play();
  } else mainVideo.pause();
});

mainVideo.addEventListener("play", () => {
  playPauseBtn.classList.replace("fa-play", "fa-pause");
});

mainVideo.addEventListener("pause", () => {
  playPauseBtn.classList.replace("fa-pause", "fa-play");
});

const formatTime = (time) => {
  let seconds = Math.floor(time % 60);
  let minutes = Math.floor(time / 60) % 60;
  let hours = Math.floor(time / 3600);

  seconds = seconds < 10 ? `0${seconds}` : seconds;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  hours = hours < 10 ? `0${hours}` : hours;

  if (hours == 0) {
    return `${minutes}:${seconds}`;
  }
  return `${hours}:${minutes}:${seconds}`;
};

mainVideo.addEventListener("timeupdate", (e) => {
  let { currentTime, duration } = e.target;
  let percent = (currentTime / duration) * 100;
  progressBar.style.width = `${percent}%`;
  currentVidTime.innerText = formatTime(currentTime);

  if (mainVideo.currentTime == mainVideo.duration) {
    if (MainVideoObject.index === videoList.length - 1) {
      mainVideo.src = videoList[0].src;
      title.innerHTML = videoList[0].name;
      MainVideoObject.index = 0;
    } else {
      mainVideo.src = videoList[MainVideoObject.index + 1].src;
      title.innerHTML = videoList[MainVideoObject.index + 1].name;
      MainVideoObject.index++;
    }
    mainVideo.play();
  }
});

videoTimeline.addEventListener("click", (e) => {
  let timelineWidth = videoTimeline.clientWidth;
  mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
});

skipBackward.addEventListener("click", () => {
  mainVideo.currentTime -= 10;
});
skipForward.addEventListener("click", () => {
  mainVideo.currentTime += 10;
});

volumeBtn.addEventListener("click", () => {
  if (!volumeBtn.classList.contains("fa-volume-high")) {
    mainVideo.volume = 0.5;

    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
  } else {
    mainVideo.volume = 0.0;
    volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
  }
  volumeSlider.value = mainVideo.volume;
});
volumeSlider.addEventListener("input", (e) => {
  mainVideo.volume = e.target.value;
  if (e.target.value == 0) {
    volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
  } else {
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
  }
});

speedBtn.addEventListener("click", () => {
  speedOptions.classList.toggle("show");
});

speedOptions.querySelectorAll("li").forEach((option) => {
  option.addEventListener("click", () => {
    mainVideo.playbackRate = option.dataset.speed;
    speedOptions.querySelector(".active").classList.remove("active");
    option.classList.add("active");
  });
});
document.addEventListener("click", (e) => {
  if (
    e.target.tagName !== "SPAN" ||
    e.target.className !== "material-symbols-rounded"
  ) {
  }
});


picInPicBtn.addEventListener("click", () => {
  mainVideo.requestPictureInPicture();
});


fullscreenBtn.addEventListener("click", () => {
  toggleFullScreen(mainVideo);
  
  
});
function toggleFullScreen(videoElement) {
  if (!document.fullscreenElement) {
    videoElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};



mainVideo.addEventListener("loadeddata", (e) => {
  videoDuration.innerText = formatTime(e.target.duration);
});


const hideControls = () => {
  if (mainVideo.paused) return;
  timer = setTimeout(() => {
    containerVideoBar.classList.remove("show-controls");
  }, 3000);
};
hideControls();

containerVideoBar.addEventListener("mousemove", () => {
  containerVideoBar.classList.add("show-controls");
  clearTimeout(timer);
  hideControls();
});


const video2 = document.querySelectorAll(".video-list");
