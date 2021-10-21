let btnSearch = document.getElementById('search_btn');
let urlList = document.getElementById('url_list');
let linkTitle = document.getElementById('link_title');



function getApi() 
{
    let szCharacter = "";
    let elmCity = null;
    let nIndex = 0;
    let szLinkName = "";
    let szLinkUrl = "";
    let nItems = 0;
    let elmList = null;
    let elmHref = null;
    let requestUrl = "";
 
    // Get the text entered by the user.  If none was entered alert the user about this issue.
    elmCity = document.getElementById("city_input");
    szCharacter = elmCity.value;
    szCharacter = szCharacter.trim();
    if (szCharacter.length === 0)
    {
        alert("***** Wikipedia API Look Up *****\r\n\r\nYou must enter a character!");
        return;
    }
 
    requestUrl = "https://en.wikipedia.org/w/api.php?&origin=*&action=opensearch&search=" + szCharacter + "_film";

    // Replace any space character with the text string "%20".
    requestUrl = requestUrl.replace(" ", "%20");

    // Use the URL for wikipedia.org
    //var requestUrl = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=Craig%20Noone&utf8=&format=json";
    //var requestUrl = "https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=Albert&format=json";
    //var requestUrl = "https://en.wikipedia.org/w/api.php?en.wikipedia.org/w/api.php?action=opensearch&search=Albert";

    fetch(requestUrl)
    .then(function (response) 
    {
        if (response.ok)
        {
            return response.json();
        }
        else
        {
            throw new Error(response.status);
        }
    })
  
    .then(function (data) 
    {
        console.log(data)

        linkTitle.innerHTML = "Wikipedia Film Links For " + szCharacter + ":";

        // Remove items from list.
        while( urlList.firstChild )
        {
            urlList.removeChild( urlList.firstChild );
        }

        // Test if any data returned.
        if (data.length === 0)
        {
            elmList = document.createElement("li");
            elmList.innerHTML = "No Result Found."
            urlList.appendChild(elmList);              
        }
        else
        {
            // Add list items.
            if (data.length >= 3)
            {
                nItems = data[1].length;

                if (nItems === 0)
                {
                  elmList = document.createElement("li");
                  elmList.innerHTML = "No Result Found."
                  urlList.appendChild(elmList);     
                }
                else
                {
                    for (nIndex = 0; nIndex < nItems; nIndex++)
                    {
                        szLinkName = data[1][nIndex];
                        szLinkUrl = data[3][nIndex]; 

                        elmList = document.createElement("li");
                        elmHref = document.createElement("a");
                        elmHref.setAttribute("href", szLinkUrl);
                        elmHref.setAttribute("target", "_blank");
                        elmHref.innerHTML = szLinkName;
                        elmList.appendChild(elmHref);
                        urlList.appendChild(elmList);
                    }
                }
            }    

        }
    })

    .catch(function (error) 
    {
        alert("***** Wikipedia API Look Up *****\r\n\r\nAPI Error.\r\n\r\nThe follow problem occurred:\r\n" + error);
        return (null);
    });   
}

btnSearch.addEventListener('click', getApi);
       