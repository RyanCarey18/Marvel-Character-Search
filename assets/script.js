const searchBtn = document.getElementById("btn");
let time = Date.now();
const publicKey = "c598176713a7f4af235c955e6ab2cdf5";
const privateKey = "21fe2681db8292d452bae0ffe9b07fb96a43fc39";
const infoDivEl = $("#char-body");
console.log(time);

function getHash() {
  const hash = time + privateKey + publicKey;
  fetch("https://api.hashify.net/hash/md5/hex?value=" + hash)
    .then(function (data) {
      return data.json();
    })
    .then(function (md5) {
      genHash = md5.Digest;

      heroSearch(genHash);
    });
}

function heroSearch(hash) {
  fetch(
    "http://gateway.marvel.com/v1/public/characters?name=thor&apikey=" +
      publicKey +
      "&hash=" +
      hash +
      "&ts=" +
      time
  )
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (data) {
      console.log(data);
      renderPic(data);
      renderCharData(data);
    });
}

function renderCharData(data) {
  const charName = data.data.results[0].name;
  const charDesc = data.data.results[0].description;
  const charComics = data.data.results[0].comics.available;
  const charSeries = data.data.results[0].series.available;
  const charStories = data.data.results[0].stories.available;
  const charComicsUrl = data.data.results[0].comics.items;
  const extension = data.data.results[0].thumbnail.extension;
  const pic = data.data.results[0].thumbnail.path;
  const charDivEl = $("<div>").addClass("row");
  const charPicEl = $("<img>")
    .addClass("col")
    .attr("src", pic + "." + extension);
  const charBodyEl = $("<div>").addClass("col");
  const charNameEl = $("<p>").text(charName);
  const charDescEl = $("<p>").text(charDesc);
  const charMediaEl = $("<div>").addClass("row");
  const charComicEl = $("<p>").text("Number of Comics: " + charComics);
  const charSeriesEl = $("<p>").text("Number of Series: " + charSeries);
  const charStoriesEl = $("<p>").text("Number of Stories: " + charStories);

  charMediaEl.append(charComicEl, charSeriesEl, charStoriesEl);
  charBodyEl.append(charNameEl, charDescEl, charMediaEl);
  charDivEl.append(charPicEl, charBodyEl);
  infoDivEl.append(charDivEl);
}

function renderPic(data) {
  const extension = data.data.results[0].thumbnail.extension;
  const pic = data.data.results[0].thumbnail.path;
  $("#pic").attr("src", pic + "." + extension);
}
searchBtn.addEventListener("click", getHash);
