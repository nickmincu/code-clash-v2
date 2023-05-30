// Import stylesheets
import './style.css';

// Write Javascript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = `<h2>Programming Languages Comparison</h2>`;

function generateNavMenu() {
  fetchData().then((data) => {
    const navList = document.createElement('ul');
    var i = 0;
    Object.keys(data).forEach((lang) => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = '#';
      link.textContent = data[lang].name;
      link.id = lang;
      if (i == 0) {
        link.className += 'active';
      }
      i++;
      link.addEventListener('click', () => {
        showLanguage(lang);
        // setActiveButton(lang);
      });

      listItem.appendChild(link);
      navList.appendChild(listItem);
    });

    const spacer = document.createElement('li');
    const span = document.createElement('span');
    span.className = 'spacer';
    span.textContent = '·';
    spacer.appendChild(span);
    navList.appendChild(spacer);

    const compareListItem = document.createElement('li');
    const compareLink = document.createElement('a');
    compareLink.href = '#';
    compareLink.textContent = 'Compare';
    compareLink.id = 'compare';
    compareLink.addEventListener('click', () => {
      showComparison();
      setActiveButton('compare');
    });
    compareListItem.appendChild(compareLink);
    navList.appendChild(compareListItem);

    document.querySelector('nav').appendChild(navList);
  });
}

function setActiveButton(buttonId) {
  const buttons = [
    'javascript',
    'dotnet',
    'java',
    'python',
    'ruby',
    'cpp',
    'rust',
    'compare',
  ];

  buttons.forEach((id) => {
    const button = document.getElementById(id);
    if (button) {
      if (id === buttonId) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    }
    // else {
    //   console.log(`Button with ID "${id}" not found.`);
    // }
  });
}

generateNavMenu();

let globalIdToken = null; // will store the idToken globally
let username;
let currentLanguage;
let currentSnippet;

async function fetchFavorites(username) {
  if (username === undefined) {
    return [];
  }
  const response = await fetch(
    `https://codeclashserver20230524010610.azurewebsites.net/Favorites/get?username=${encodeURIComponent(
      username
    )}`
  );
  const favorites = await response.json();
  return favorites;
}

function showComparison() {
  fetchData().then(async (data) => {
    // Fetch favorite snippets
    const favorites = await fetchFavorites(username);
    console.log(favorites);

    // Function to check if a snippet is a favorite
    const isFavorite = (languageName, snippetTitle) => {
      return favorites.some(
        (favorite) =>
          favorite.language === languageName &&
          favorite.snippetName === snippetTitle
      );
    };

    content.innerHTML = `
      <label for="snippet1">Languages</label>
      <div class="select-wrapper">
        <select id="snippet1">
            ${Object.keys(data)
              .map(
                (lang) =>
                  `<optgroup label="${data[lang].name}">${data[lang].snippets
                    .map(
                      (snippet, index) =>
                        `<option value="${lang}-${index}">${
                          data[lang].name
                        } - ${snippet.title}${
                          isFavorite(data[lang].name, snippet.title) ? ' ★' : ''
                        }</option>`
                    )
                    .join('')}</optgroup>`
              )
              .join('')}
        </select>
      </div>
      <!-- <label for="snippet2"> vs</label> -->
      <div class="select-wrapper">
        <select id="snippet2">
            ${Object.keys(data)
              .map(
                (lang) =>
                  `<optgroup label="${data[lang].name}">${data[lang].snippets
                    .map(
                      (snippet, index) =>
                        `<option value="${lang}-${index}">${
                          data[lang].name
                        } - ${snippet.title}${
                          isFavorite(data[lang].name, snippet.title) ? ' ★' : ''
                        }</option>`
                    )
                    .join('')}</optgroup>`
              )
              .join('')}
        </select>
      </div>
      <div id="comparisonResult"></div>
    `;

    function compare() {
      const [lang1, snippetIndex1] = document
        .getElementById('snippet1')
        .value.split('-');
      const [lang2, snippetIndex2] = document
        .getElementById('snippet2')
        .value.split('-');

      if (lang1 === lang2 && snippetIndex1 === snippetIndex2) {
        document.getElementById('comparisonResult').innerHTML =
          '<p>Please choose two different snippets.</p>';
      } else {
        document.getElementById('comparisonResult').innerHTML = `
          <h3>${data[lang1].name} vs ${data[lang2].name}</h3>
          <table>
              <tr>
                  <th>Attribute</th>
                  <th>${data[lang1].name}</th>
                  <th>${data[lang2].name}</th>
              </tr>
              <tr>
                  <td>Performance</td>
                  <td>${data[lang1].performance}</td>
                  <td>${data[lang2].performance}</td>
              </tr>
              <tr>
                  <td>Ease of Use</td>
                  <td>${data[lang1].ease_of_use}</td>
                  <td>${data[lang2].ease_of_use}</td>
              </tr>
              <tr>
                  <td>Popularity</td>
                  <td>${data[lang1].popularity}</td>
                  <td>${data[lang2].popularity}</td>
              </tr>
              <tr>
                  <td>Community Support</td>
                  <td>${data[lang1].community_support}</td>
                  <td>${data[lang2].community_support}</td>
              </tr>
          </table>

                  <h3>Code Snippet Comparison</h3>
                  <h4>${data[lang1].name} - ${data[lang1].snippets[snippetIndex1].title}</h4>
                  <pre>${data[lang1].snippets[snippetIndex1].code}</pre>
                  <h4>${data[lang2].name} - ${data[lang2].snippets[snippetIndex2].title}</h4>
                  <pre>${data[lang2].snippets[snippetIndex2].code}</pre>
              `;
      }
      hideComments();
      //fetchComments('', '');
    }

    const secondLanguageKey = Object.keys(data)[1];
    const secondLanguageFirstChoiceIndex =
      data[secondLanguageKey].snippets.length;

    const comboBox1 = document.getElementById('snippet1');
    comboBox1.selectedIndex = 2;
    const comboBox2 = document.getElementById('snippet2');
    comboBox2.selectedIndex =
      secondLanguageFirstChoiceIndex + comboBox1.selectedIndex;

    comboBox1.addEventListener('change', () => compare());
    comboBox2.addEventListener('change', () => compare());

    compare();

    //document.getElementById('compareBtn').click();
  });
}

function fetchData() {
  // we need to get this from github (the only exception) because stackblitz doesnt allow static resources.
  return fetch(
    'https://raw.githubusercontent.com/nickmincu/code-clash-v2/main/data.json'
  )
    .then((response) => response.json())
    .catch((error) => console.error('Error fetching data:', error));
}

function showLanguage(language) {
  showComments();
  setActiveButton(language);
  //console.log('show language: ' + language);
  fetchData().then((data) => {
    //console.log(data);
    const langData = data[language];
    content.innerHTML = `
          <h2>${langData.name}</h2>
          <p>${langData.description}</p>
          <a class="pretty_link" href="${
            langData.wiki
          }" target="_blank">Wikipedia link</a>
          <p>Performance: ${langData.performance}</p>
          <p>Ease of use:${langData.ease_of_use}</p>
          <p>Popularity: ${langData.popularity}</p>
          <p>Community Support: ${langData.community_support}</p>
          <label for="snippet">Choose a code snippet:</label>
          <div class="select-wrapper">
          <select id="snippet">
              ${langData.snippets
                .map(
                  (snippet, index) =>
                    `<option value="${index}">${snippet.title}</option>`
                )
                .join('')}
          </select>
          </div>
          <div>
          <button id="favoritesBtn" title="Bookmark on/off" class="star">☆</button><pre id="snippetCode">${
            langData.snippets[0].code
          }</pre>
          </div>`;

    currentLanguage = langData.name;
    currentSnippet = langData.snippets[0].title;
    fetchComments(currentLanguage, currentSnippet);
    favoritesButtonLogic(username, currentLanguage, currentSnippet);

    document
      .getElementById('snippet')
      .addEventListener('change', function (event) {
        const snippetIndex = event.target.value;        
        document.getElementById('snippetCode').innerText =
          langData.snippets[snippetIndex].code;
        // get the comments for the language and snippet
        currentLanguage = langData.name;
        currentSnippet = langData.snippets[snippetIndex].title;
        fetchComments(currentLanguage, currentSnippet);
        favoritesButtonLogic(username, currentLanguage, currentSnippet);
      });
  });
}

let favBtnHandle;

function favoritesButtonLogic(user, language, snippetName) {
  // favorites
  const favoritesBtn = document.getElementById('favoritesBtn');

  // hide the bookmark button if the username is not defined (when is not logged in)
  if (favoritesBtn) {
    if (username === undefined) {
      favoritesBtn.style.display = 'none';
    } else favoritesBtn.style.display = 'block';
  }

  async function fetchIsBtnFavorite() {
    const response = await fetch(
      'https://codeclashserver20230524010610.azurewebsites.net/Favorites/isfavorite',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json-patch+json' },
        body: JSON.stringify({
          username: user,
          language: language,
          snippetName: snippetName,
        }),
      }
    );

    if (response.ok && (await response.json())) {
      favoritesBtn.classList.add('yellow');
    } else favoritesBtn.classList.remove('yellow');
  }

  async function toggleBtnStar() {
    const url = favoritesBtn.classList.contains('yellow')
      ? 'https://codeclashserver20230524010610.azurewebsites.net/Favorites/remove'
      : 'https://codeclashserver20230524010610.azurewebsites.net/Favorites/add';

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json-patch+json' },
      body: JSON.stringify({
        username: user,
        language: language,
        snippetName: snippetName,
      }),
    });

    if (response.ok) {
      favoritesBtn.classList.toggle('yellow');
    }
  }
  fetchIsBtnFavorite();

  if (favBtnHandle != undefined && favoritesBtn) {
    // remove the previously assigned event handler
    favoritesBtn.removeEventListener('click', favBtnHandle);
  }

  favBtnHandle = () => {
    toggleBtnStar();
    //  favoritesBtn.removeEventListener('click', handleClick);
  };

  if (favoritesBtn) {
    favoritesBtn.addEventListener('click', favBtnHandle);
  }

  // end favorites
}

document.addEventListener('DOMContentLoaded', function () {
  const content = document.getElementById('content');
});

document
  .querySelector('.hamburger-menu')
  .addEventListener('click', function () {
    document.querySelector('nav').classList.toggle('show-menu');
  });

// load the initial language page

showLanguage('javascript');

document
  .getElementById('loginForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    loginUser(email, password);
  });

document
  .getElementById('signupForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    signupUser(event);
  });

document.getElementById('signup').addEventListener('click', function () {
  signupState();
});

document.getElementById('logoutButton').addEventListener('click', function () {
  logoutUser();
});

function fetchComments(language, snippet) {
  const encodedSnippet = encodeURIComponent(snippet);
  fetch(
    `https://codeclashserver20230524010610.azurewebsites.net/Comments/get?language=${language.replace(
      '++',
      'plusplus'
    )}&snippet=${encodedSnippet}`
  )
    .then((response) => response.json())
    .then((json) => displayComments(json))
    .catch((error) => console.error('Error:', error));
}

function displayComments(comments) {
  const commentsList = document.getElementById('commentsList');
  commentsList.innerHTML = '';

  comments.forEach((comment) => {
    const item = document.createElement('div');
    item.classList.add('comment-item');

    const header = document.createElement('h4');
    header.textContent = `${comment.username} (${new Date(
      comment.dateTime
    ).toLocaleDateString()})`;
    item.appendChild(header);

    const body = document.createElement('div');
    body.classList.add('comment-body');
    body.textContent = comment.commentBody;
    item.appendChild(body);

    commentsList.appendChild(item);
  });
}

function loginUser(email, password) {
  var myHeaders = new Headers();
  myHeaders.append('authority', 'www.googleapis.com');
  myHeaders.append('accept', '*/*');
  myHeaders.append('accept-language', 'en-US,en;q=0.9');
  myHeaders.append('content-type', 'application/json');
  myHeaders.append(
    'sec-ch-ua',
    '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"'
  );
  myHeaders.append('sec-ch-ua-mobile', '?0');
  myHeaders.append('sec-ch-ua-platform', '"Windows"');
  myHeaders.append('sec-fetch-dest', 'empty');
  myHeaders.append('sec-fetch-mode', 'cors');
  myHeaders.append('sec-fetch-site', 'cross-site');

  myHeaders.append(
    'Access-Control-Allow-Origin',
    'https://js-b7vvkk.stackblitz.io'
  );
  myHeaders.append('Access-Control-Allow-Credentials', 'true');

  myHeaders.append(
    'user-agent',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
  );
  myHeaders.append(
    'x-client-data',
    'CIa2yQEIpbbJAQipncoBCKeAywEIlKHLAQiFoM0BCIenzQEIxqrNAQ=='
  );
  myHeaders.append('x-client-version', 'Chrome/JsCore/7.8.1/FirebaseCore-web');

  var raw = JSON.stringify({
    email: email,
    password: password,
    returnSecureToken: true,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  fetch(
    'https://nocors.intelpro.app/www.googleapis.com:443/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCvgi15qvHrBSTR83IQJzoVyzdOtLpzFWU',
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result.error) {
        throw new Error(result.error.message);
      }
      globalIdToken = result.idToken; // Save the JWT token
      username = email;
      loggedInState();
    })
    .catch((error) => {
      console.log('error', error);
      alert(error);
      //globalIdToken = email;
      //loggedInState();
      logoutUser();
    });
}

function signupUser(event) {
  console.log('here' + event);
  event.preventDefault();

  const email = document.getElementById('emailsignup').value;
  const password1 = document.getElementById('password1').value;
  const password2 = document.getElementById('password2').value;
  const url =
    'https://nocors.intelpro.app/www.googleapis.com:443/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyCvgi15qvHrBSTR83IQJzoVyzdOtLpzFWU';

  if (password1 !== password2) {
    alert('The passwords do not match.');
    return;
  }

  if (password1.length < 6) {
    alert('WEAK_PASSWORD : Password should be at least 6 characters');
    return;
  }

  const payload = {
    email: email,
    password: password1,
    //returnSecureToken: true,
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      //origin: 'https://js-b7vvkk.stackblitz.io',
    },
    body: JSON.stringify(payload),
    redirect: 'follow',
  })
    .then((response) => {
      console.log(response);
      //globalIdToken = result.idToken; // Save the JWT token
      //username = email;
      logoutUser();
      // handle after successful submission
      alert('Signup successful!');
    })
    .catch((error) => {
      console.error(error);
      alert(
        'Something went wrong. Maybe the email is already registered? Please try again later.'
      );
    });
}

function loggedInState() {
  document.getElementById('loginContainer').style.display = 'none';
  document.getElementById('signupContainer').style.display = 'none';
  document.getElementById('logoutContainer').style.display = 'block';
  document.getElementById('addComments').style.display = 'block';
  favoritesButtonLogic(username, currentLanguage, currentSnippet);
}

function logoutUser() {
  globalIdToken = null;
  username = undefined;
  document.getElementById('loginContainer').style.display = 'block';
  document.getElementById('signupContainer').style.display = 'none';
  document.getElementById('logoutContainer').style.display = 'none';
  document.getElementById('addComments').style.display = 'none';
  if (document.getElementById('favoritesBtn')) {
    document.getElementById('favoritesBtn').style.display = 'none';
  }
}

function signupState() {
  document.getElementById('loginContainer').style.display = 'none';
  document.getElementById('signupContainer').style.display = 'block';
  document.getElementById('logoutContainer').style.display = 'none';
  document.getElementById('addComments').style.display = 'none';
}

function showComments() {
  document.getElementById('comments').style.display = 'block';
  if (globalIdToken != null) {
    document.getElementById('addComments').style.display = 'block';
  }
}

function hideComments() {
  document.getElementById('comments').style.display = 'none';
  document.getElementById('addComments').style.display = 'none';
}

document
  .getElementById('commentForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    const commentBody = document.getElementById('commentBody').value;
    addComment(commentBody);
    document.getElementById('commentBody').value = '';
  });

function addComment(commentBody) {
  const url =
    'https://codeclashserver20230524010610.azurewebsites.net/Comments/add';
  const data = {
    username: username,
    language: currentLanguage.replace('++', 'plusplus'),
    snippetName: currentSnippet,
    commentBody: commentBody,
  };
  console.log(JSON.stringify(data));

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      console.log('Comment added:' + commentBody);
      console.log(response);
    })
    .then(() => {
      fetchComments(currentLanguage, currentSnippet);
    })
    .catch((error) => console.error('Error:', error));
}
