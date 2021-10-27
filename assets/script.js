// JQuery ready function: Code placed inside ready function so will be executed when the page is ready.
$(document).ready(function()
{
  // Elements added by for Wikipedia.
  let wikiParagraph =  document.getElementById('wiki-desc');   
  let wikiLink =  document.getElementById('wiki-link');   

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

    let searchInput = document.getElementById("input").value.toLowerCase();

    searchInput = searchInput.trim();

    // If no character name was entered then display the JQuery Modal Dialog Box.
    if (searchInput.length === 0)
    {
        // Used the JQuery Modal Dialog Box with the following options.
        $(function () {
            $('#dialog').text('You must enter a Marvel Character!');
            $('#dialog').dialog(
                { title: "Marvel Comics", 
                  buttons: [ { text: "Ok", click: function() { $( this ).dialog( "close" ); } } ] }
             );
          });
        return;
    }

    getHash(searchInput);

    // Added call to get WikiPageID
    getWikiPageID(searchInput);
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Function: getWikiPageID - This function will call the Wikipedia API to get the page ID for the page that match the page text passed in
  // the PARSE command.  This command is done four times, examples for "Ant Man" character shown below:
  //
  // 1. "Ant_Man_(Marvel_Comics)"
  // 2. "Ant_Man_(comics)"
  // 3. "Ant_Man_(character)"
  // 4. "Ant_Man"
  // 
  // If a parse object is returned then the function GetWikiData is called passing in the Page Id value and the character name.
  // If a parse object is never returned then the function WikiPageNotFound is called.
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
  function getWikiPageID(szCharacter)
  {

      let requestUrl = "";
      let page_response = null;
      let page_data = null;
      let page_response2 = null;
      let page_data2 = null;
      let page_response3 = null;
      let page_data3 = null;
      let page_response4 = null;
      let page_data4 = null;                        
      let szWikiName = szCharacter.replace(/ /gi, "_"); 
    
      ///////////////////////////////////////////////////////////////////////////////////////
      // Perform a PARSE action.  Looking for szWikiName + "_(Marvel_Comics)".
      //////////////////////////////////////////////////////////////////////////////////////
      requestUrl = "https://en.wikipedia.org/w/api.php?origin=*&action=parse&prop=text&redirects=1&page=";
      requestUrl += szWikiName + "_(Marvel_Comics)&format=json";
  
      // Replace any space character with the text string "%20".
      requestUrl = requestUrl.replace(/ /gi, "%20");

      fetch(requestUrl)

      // Get the page response.
      .then(function (page_response) 
      {
          if (page_response.ok)
          {
              return page_response.json();
          }
          else
          {
              // If the response was not ok then throw an error.
              throw new Error(page_response.status);
          }
      })
  
      // Get the page data.
      .then(function (page_data) 
      {
          if (page_data.parse != undefined)
          {
              GetWikiData(page_data.parse.pageid, szCharacter);
          }
          else
          {
              ///////////////////////////////////////////////////////////////////////////////////////
              // Perform a PARSE action.  Looking for szWikiName + "_(comics)"".
              //////////////////////////////////////////////////////////////////////////////////////                
              requestUrl = "https://en.wikipedia.org/w/api.php?origin=*&action=parse&prop=text&redirects=1&page=";
              requestUrl += szWikiName + "_(comics)&format=json";
          
              // Replace any space character with the text string "%20".
              requestUrl = requestUrl.replace(/ /gi, "%20");
      
              fetch(requestUrl)
      
              // Get the page response.
              .then(function (page_response2) 
              {
                  if (page_response2.ok)
                  {
                      return page_response2.json();
                  }
                  else
                  {
                      // If the response was not ok then throw an error.
                      throw new Error(page_response2.status);
                  }
              })
          
              // Get the page data.
              .then(function (page_data2) 
              {
                  if (page_data2.parse != undefined)
                  {
                      GetWikiData(page_data2.parse.pageid, szCharacter);
                  }
                  else
                  {
                      ///////////////////////////////////////////////////////////////////////////////////////
                      // Perform a PARSE action.  Looking for szWikiName + "_(character)".
                      //////////////////////////////////////////////////////////////////////////////////////                        
                      requestUrl = "https://en.wikipedia.org/w/api.php?origin=*&action=parse&prop=text&redirects=1&page=";
                      requestUrl += szWikiName + "_(character)&format=json";
                  
                      // Replace any space character with the text string "%20".
                      requestUrl = requestUrl.replace(/ /gi, "%20");
              
                      fetch(requestUrl)
              
                      // Get the page response.
                      .then(function (page_response3) 
                      {
                          if (page_response3.ok)
                          {
                              return page_response3.json();
                          }
                          else
                          {
                              // If the response was not ok then throw an error.
                              throw new Error(page_response3.status);
                          }
                      })
                  
                      // Get the page data.
                      .then(function (page_data3) 
                      {
                          // If a parse object was not returned then call function to display page not found.
                          if (page_data.parse != undefined)
                          {
                              GetWikiData(page_data3.parse.pageid, szCharacter);
                          }   
                          else                         
                          {          
                              ///////////////////////////////////////////////////////////////////////////////////////
                              // Perform a PARSE action.  Looking for szWikiName.
                              //////////////////////////////////////////////////////////////////////////////////////                                                      
                              requestUrl = "https://en.wikipedia.org/w/api.php?origin=*&action=parse&prop=text&redirects=1&page=";
                              requestUrl += szWikiName + "&format=json";
                          
                              // Replace any space character with the text string "%20".
                              requestUrl = requestUrl.replace(/ /gi, "%20");
                    
                              fetch(requestUrl)
                      
                              // Get the page response.
                              .then(function (page_response4) 
                              {
                                  if (page_response4.ok)
                                  {
                                      return page_response4.json();
                                  }
                                  else
                                  {
                                      // If the response was not ok then throw an error.
                                      throw new Error(page_response4.status);
                                  }
                              })
                          
                              // Get the page data.
                              .then(function (page_data4) 
                              {
                                  // If a parse object was not returned then call function to display page not found.
                                  if (page_data4.parse != undefined)
                                  {
                                      GetWikiData(page_data4.parse.pageid, szCharacter);
                                  }
                                  else
                                  {
                                      WikiPageNotFound(szCharacter, "");
                                      return (null);
                                  }
                              })

                              // Caught error for list, call routine to display Wiki List Not Found.
                              .catch(function (error) 
                              {
                                  WikiPageNotFound(szCharacter, error.message);
                                  return (null);
                              })   
                          }
                      })    
                          
                      // Caught error for list, call routine to display Wiki List Not Found.
                      .catch(function (error) 
                      {
                          WikiPageNotFound(szCharacter, error.message);
                          return (null);
                      })
                  }
              })

              // Caught error for list, call routine to display Wiki List Not Found.
              .catch(function (error) 
              {
                  WikiPageNotFound(szCharacter, error.message);
                  return (null);
              }) 
          }
      })

      // Caught Wiki Page Content error, call routine to display Wiki Page Not Found.           
      .catch(function (error) 
      {
          WikiPageNotFound(szCharacter, error.message);
          return (null);
      });                  
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Function: GetWikiData - This function will get the text from the top section of the page and a link to the page.
  //
  // PageId - The Id value for the page.
  // szCharacter - The character name that the user typed in.
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function GetWikiData(PageId, szCharacter)
  {
      let nIndex = 0;
      let szLinkName = "";
      let szLinkUrl = "";
      let nItems = 0;
      let requestUrl = "";
      let content_response = null;
      let content_data = null;
      let list_response = null;
      let list_data = null;
      let bLinksAdded = false;    
      let szSearch = ""; 
    
      ////////////////////////////////////////////////////////////////////////////////////////
      // Using query action to get the top section of the page.  Passing in the PageId value.
      ////////////////////////////////////////////////////////////////////////////////////////
      requestUrl = "https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=extracts&exintro&explaintext&redirects=1&format=json&pageids=" + PageId;

      // Replace any space character with the text string "%20".
      requestUrl = requestUrl.replace(/ /gi, "%20");

      fetch(requestUrl)

      // Get the content response.
      .then(function (content_response) 
      {
          if (content_response.ok)
          {
              return content_response.json();
          }
          else
          {
              // If the response was not ok, then throw an error. 
              throw new Error(content_response.status);
          }
      })
      
      // Get the content data.
      .then(function (content_data) 
      {
          // Search the text for "comic", if not found then call function to display wiki page not found.
          if (content_data.query.pages[PageId].extract.toLowerCase().search("comic") == -1)
          {
              WikiPageNotFound(szCharacter, "");
              return;                
          }

          // Update the Wiki Paragraph Title Text with the Character Name entered by the user.  Get and display the Paragraph Text.
          //paragraphTitle.innerHTML = szCharacter;
          wikiParagraph.innerHTML = content_data.query.pages[PageId].extract;

          // Set the search string to the title of the page so we will find this link.
          szSearch = content_data.query.pages[PageId].title;

          //////////////////////////////////////////////////////////////////////////////////////////////////////////////
          // Using opensearch action - Getting list of link names and url's.
          //////////////////////////////////////////////////////////////////////////////////////////////////////////////
          requestUrl = "https://en.wikipedia.org/w/api.php?&origin=*&action=opensearch&search=" + szSearch;
              
          // Replace any space character with the text string "%20".
          requestUrl = requestUrl.replace(/ /gi, "%20");

          fetch(requestUrl)

          // Get the list response.
          .then(function (list_response) 
          {
              if (list_response.ok)
              {
                  return list_response.json();
              }
              else
              {
                  // if list response not ok, then throw an error.
                  throw new Error(list_response.status);
              }
          })
  
          // Get the list data.
          .then(function (list_data) 
          {
              // Remove the all the attributes for the wiki link.
              wikiLink.removeAttribute("href");
              wikiLink.removeAttribute("target");
              wikiLink.innerHTML = "";
            
              if (list_data.length > 0)
              {
                  // Add list items.
                  if (list_data.length >= 3)
                  {
                      nItems = list_data[1].length;
                    
                      if (nItems > 0)
                      {
                          // Loop through the list items.
                          for (nIndex = 0; nIndex < nItems; nIndex++)
                          {
                              szLinkName = list_data[1][nIndex];
                              szLinkUrl = list_data[3][nIndex]; 

                              // Find the link that matches the title of the page.
                              // This is the only one we want to display.
                              if (szLinkName.toLowerCase() === szSearch.toLowerCase())
                              {
                                  bLinksAdded = true;
                                  wikiLink.setAttribute("href", szLinkUrl);
                                  wikiLink.setAttribute("target", "_blank");
                                  wikiLink.innerHTML = szLinkName;
                              }
                          }
                      }
                  }       
              }
          })
          
          // Caught error for list, call routine to display Wiki List Not Found.
          .catch(function (error) 
          {
              WikiListNotFound(szCharacter, error.message);
              return (null);
          })   
      })
    
      // Caught Wiki Page Content error, call routine to display Wiki Page Not Found.           
      .catch(function (error) 
      {
          WikiPageNotFound(szCharacter, error.message);
          return (null);
      })
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Function: WikiPageNotFound:
  // szCharacterName: String that contains the marvel character name.
  // szMessage: String that contains an error message, maybe an empty string.
  //
  // This function will display the message the the Wiki Page Was Not Found in the Wiki page paragraph element.
  // It will also display the error message if one is passed into this routine.
  // It will add one element to the list element stating that the Wiki Links were not found.
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function WikiPageNotFound(szCharacterName, szMessage)
  {
      let szTemp = "";        

      // Add the Character name and message to the paragraph.
      szTemp = "Wikipedia Page Not Found."

      if (szMessage.length != 0)
      {
          szTemp += "<br><br>The following problem occurred:<br>" + szMessage;       
      }
      wikiParagraph.innerHTML = szTemp;

      // Remove the all the attributes for the wiki link.
      wikiLink.removeAttribute("href");
      wikiLink.removeAttribute("target");
      wikiLink.innerHTML = "";      
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Function: WikiListNotFound:
  // szCharacterName: String that contains the marvel character name.
  // szMessage: String that contains an error message, maybe an empty string.
  //
  // This function will display the message the the Wiki Links Were Not Found in the List element.
  // It will also display the error message if one is passed into this routine.
  //    
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function WikiListNotFound(szCharacterName, szMessage)
  {
      // Remove the all the attributes for the wiki link.
      wikiLink.removeAttribute("href");
      wikiLink.removeAttribute("target");
      wikiLink.innerHTML = "";      
  }
});
