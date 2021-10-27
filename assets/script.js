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
  if (hero === "spiderman" || hero === "spider man" || hero === "spider-man") {
    url = "http://gateway.marvel.com/v1/public/characters/1009610?";
  } else {
    url = "http://gateway.marvel.com/v1/public/characters?name=" + hero + "&";
  }
  fetch(url + "apikey=" + publicKey + "&hash=" + hash + "&ts=" + time)
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
  $("#char-pic").attr("src", pic + "." + extension);
  $("#char-name").text(charName);
  $("#marvel-desc").text(charDesc);
  $("#numCom").text("Number of Comics: " + charComics);
  $("#numSer").text("Number of Series: " + charSeries);
  $("#numStor").text("Number of Stories: " + charStories);

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
      renderComics(data, hash);
    });
}

function renderComics(data, hash) {
  comicDivEl.empty();
  for (let i = 0; i < 5; i++) {
    const title = data.data.results[i].title;
    const pic =
      data.data.results[i].thumbnail.path +
      "." +
      data.data.results[i].thumbnail.extension;
    const description = data.data.results[i].description;
    //const creators = data.data.results[i].creators.items;
    const characters = data.data.results[i].characters.items;
    const comicEl = $("<div>").addClass("col");
    const comicPicEl = $("<img>").addClass("col").attr("src", pic);
    const comicInfoEl = $("<div>").addClass("col");
    const comicTitleEl = $("<p>").text(title);
    const comicDescEl = $("<p>").text(description);
    const comicCharactersEl = $("<p>");
    for (let i = 0; i < characters.length; i++) {
      const url = characters[i].resourceURI;
      const character = $("<button>").text(characters[i].name).attr("url", url);
      character.click(function (e) {
        $("html").scrollTop(0);
        fetch(url + "?apikey=" + publicKey + "&hash=" + hash + "&ts=" + time)
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
      });
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
