// Import stylesheets
import './style.css';

// Button elements
const btnClose = document.getElementById('btnClose');

// Profile elements
const name = document.getElementById('name');
const email = document.getElementById('email');
const gender = document.getElementById('gender');
const like = document.getElementById('like');
const pictureUrl = document.getElementById('pictureUrl');

async function main() {
  // Initialize LIFF app)
  await liff.init({
    liffId: 'xxxxx',
  });

  getUserProfile();
}

main();

async function getUserProfile() {
  const profile = await liff.getProfile();
  let uid = profile.userId;

  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get('uid');
  if (idParam) {
    uid = idParam;
  }
  const url = `https://xxxxx/register-info?uid=${uid}`;
  const response = await fetch(url, { method: 'GET' });
  const result = await response.json();
  const userResult = JSON.parse(result.userObject);
  pictureUrl.src = userResult.pictureUrl;
  name.innerHTML = '<b>Name:</b> ' + userResult.name;
  email.innerHTML = '<b>Email:</b> ' + userResult.email;
  gender.innerHTML = '<b>Gender:</b> ' + userResult.gender;
  like.innerHTML = '<b>Like Count:</b> ' + userResult.like;
}

btnClose.onclick = () => {
  liff.closeWindow();
};
