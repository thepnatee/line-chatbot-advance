// Import stylesheets
import './style.css';

// Button elements
const btnRegister = document.getElementById('btnRegister');
const btnClose = document.getElementById('btnClose');

// Profile elements
const pictureUrl = document.getElementById('pictureUrl');
const txtEmail = document.getElementById('txtEmail');
const txtName = document.getElementById('txtName');
const rdGender = document.getElementById('rdGender');

async function main() {
  // Initialize LIFF app)
  await liff.init({
    liffId: 'xxxxx',
  });

  getUserProfile();
  if (!liff.isLoggedIn()) {
    liff.login();
  }
}

main();

async function getUserProfile() {
  const profile = await liff.getProfile();
  pictureUrl.src = profile.pictureUrl;
  txtName.value = profile.displayName;
  txtEmail.value = liff.getDecodedIDToken().email;
}

async function sendMsg() {
  if (
    liff.getContext().type !== 'none' &&
    liff.getContext().type !== 'external'
  ) {
    await liff.sendMessages([
      {
        type: 'text',
        text: 'ลงทะเบียนเรียบร้อยแล้ว',
      },
    ]);
  }
}

btnRegister.onclick = async () => {
  const url =
    'https://xxxxx/register-register';
  const body = {
    name: txtName.value,
    email: txtEmail.value,
    gender: rdGender.value,
    token: liff.getIDToken(),
  };
  console.log('body', body);
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();
  console.log('result', result);
  sendMsg();
  alert('สำเร็จ');
  liff.closeWindow();
};

btnClose.onclick = () => {
  liff.closeWindow();
};
