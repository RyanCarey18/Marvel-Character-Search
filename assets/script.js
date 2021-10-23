const searchBtn = document.getElementById("btn");
let time = Date.now();
const publicKey = "c598176713a7f4af235c955e6ab2cdf5";
const privateKey = "21fe2681db8292d452bae0ffe9b07fb96a43fc39";

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
    "http://gateway.marvel.com/v1/public/characters?name=storm&apikey=" +
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
    });
}

function renderPic(data) {
  const extension = data.data.results[0].thumbnail.extension;
  const pic = data.data.results[0].thumbnail.path;
  $("#pic").attr("src", pic + "." + extension);
}
searchBtn.addEventListener("click", getHash);
