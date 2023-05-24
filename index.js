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
    } else {
      console.error(`Button with ID "${id}" not found.`);
    }
  });
}

generateNavMenu();

let globalIdToken = null; // will store the idToken globally
let username;
let currentLanguage;
let currentSnippet;

function showComparison() {
  fetchData().then((data) => {
    content.innerHTML = `
          <label for="snippet1">Languages</label>
          <div class="select-wrapper">
            <select id="snippet1">
                ${Object.keys(data)
                  .map(
                    (lang) =>
                      `<optgroup label="${data[lang].name}">${data[
                        lang
                      ].snippets
                        .map(
                          (snippet, index) =>
                            `<option value="${lang}-${index}">${data[lang].name} - ${snippet.title}</option>`
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
                      `<optgroup label="${data[lang].name}">${data[
                        lang
                      ].snippets
                        .map(
                          (snippet, index) =>
                            `<option value="${lang}-${index}">${data[lang].name} - ${snippet.title}</option>`
                        )
                        .join('')}</optgroup>`
                  )
                  .join('')}
            </select>
          </div>
        <!--  <button id="compareBtn">Compare</button> -->
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

    // document
    //   .getElementById('compareBtn')
    //   .addEventListener('click', () => compare());

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
  console.log('fetch data');
  return fetch(
    'https://raw.githubusercontent.com/nickmincu/code-clash/main/data.json'
  )
    .then((response) => response.json())
    .catch((error) => console.error('Error fetching data:', error));
}

function showLanguage(language) {
  showComments();
  setActiveButton(language);
  console.log('show language: ' + language);
  fetchData().then((data) => {
    // console.log(data);
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
          <pre id="snippetCode">${langData.snippets[0].code}</pre>`;
    currentLanguage = langData.name;
    currentSnippet = langData.snippets[0].title;
    fetchComments(currentLanguage, currentSnippet);
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
      });
  });
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
      globalIdToken = result.idToken; // Save the JWT token
      username = email;
      loggedInState();
    })
    .catch((error) => {
      console.log('error', error);
      globalIdToken = email;
      loggedInState();
    });
}

function loggedInState() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('logoutContainer').style.display = 'block';
  document.getElementById('addComments').style.display = 'block';
}

function logoutUser() {
  globalIdToken = null;
  document.getElementById('loginForm').style.display = 'block';
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
    document.getElementById('commentBody').value = "";
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
