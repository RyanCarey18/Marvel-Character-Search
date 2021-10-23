const searchBtn = document.getElementById("btn");
let time = Date.now();
const publicKey = "c598176713a7f4af235c955e6ab2cdf5";
const privateKey = "21fe2681db8292d452bae0ffe9b07fb96a43fc39";
const infoDivEl = $("#char-body");
const comicDivEl = $("#comic-area");
const input = document.getElementById("input");
console.log(time);

function getHash(hero) {
  const hash = time + privateKey + publicKey;
  fetch("https://api.hashify.net/hash/md5/hex?value=" + hash)
    .then(function (data) {
      return data.json();
    })
    .then(function (md5) {
      genHash = md5.Digest;

      heroSearch(genHash, hero);
    });
}

function heroSearch(hash, hero) {
  fetch(
    "http://gateway.marvel.com/v1/public/characters?name=" +
      hero +
      "&apikey=" +
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
      renderCharData(data, hash);
    });
}

function renderCharData(data, hash) {
  const charName = data.data.results[0].name;
  const charDesc = data.data.results[0].description;
  const charComics = data.data.results[0].comics.available;
  const charSeries = data.data.results[0].series.available;
  const charStories = data.data.results[0].stories.available;
  //const charComicsUrl = data.data.results[0].comics.items;
  const charComicsUrl = data.data.results[0].comics.collectionURI;
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
  getComicData(charComicsUrl, hash);
}

function getComicData(url, hash) {
  fetch(url + "?apikey=" + publicKey + "&hash=" + hash + "&ts=" + time)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (data) {
      console.log(data);
      renderComics(data);
    });
}

function renderComics(data) {
  for (let i = 0; i < 5; i++) {
    const title = data.data.results[i].title;
    const pic =
      data.data.results[i].thumbnail.path +
      "." +
      data.data.results[i].thumbnail.extension;
    const description = data.data.results[i].description;
    const creators = data.data.results[i].creators.items;
    const characters = data.data.results[i].characters.items;

    const comicEl = $("<div>").addClass("col");
    const comicPicEl = $("<img>").addClass("col").attr("src", pic);
    const comicInfoEl = $("<div>").addClass("col");
    const comicTitleEl = $("<p>").text(title);
    const comicDescEl = $("<p>").text(description);
    const comicCharactersEl = $("<p>");
    for (let i = 0; i < characters.length; i++) {
      const character = $("<span>").text(characters[i].name + " ");
      comicCharactersEl.append(character);
    }

    comicInfoEl.append(comicTitleEl, comicDescEl, comicCharactersEl);
    comicEl.append(comicPicEl, comicInfoEl);
    comicDivEl.append(comicEl);
  }
}
searchBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const searchInput = document.getElementById("input").value.toLowerCase();
  getHash(searchInput);
});
