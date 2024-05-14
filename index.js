const axios = require('axios');

let token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjY5NzcwODgsImRpZCI6MjU4NjU3MjksImRldmljZSI6bnVsbCwiYWNjb3VudF9pZCI6ImFic29sMjI1LnRnIiwiZGV2aWNlX2lkIjoiZjFjNGE5NGUtN2QxYy00MWM0LWI5NGYtNDlmYTJkOWNkODI5IiwicGxhdGZvcm0iOiJ0ZWxlZ3JhbSIsInRpbWVzdGFtcCI6MTcxMzIzNDE5My4wLCJ2aWV3X29ubHkiOmZhbHNlfQ.z9T5Q4hovTdpCUarJFw2DXnJdJoJVQwOqV4CeFWnIVI';
let refToken = '';
async function getClaim() {
  try {
    const response = await axios.post(
      'https://api0.herewallet.app/api/v1/user/hot/action',
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(token);
    console.log('sukses klaim');
    // console.log(response.data.availableBalance);
  } catch (error) {
    console.log(error.response.data.message);
    console.log('belum waktunya klaim...');
    console.log(token);
  }
}



async function getBalance() {
  try {
    const response = await axios.get(
      'https://api0.herewallet.app/api/v1/rate/tokens/multichain',
      {
        headers: {
          Accept: '*/*',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Accept-Language': 'en-US,en;q=0.9',
          Authorization: token,
          Origin: 'https://tgapp.herewallet.app',
          Priority: 'u=1, i',
          Referer: 'https://tgapp.herewallet.app/',
          'Sec-Ch-Ua':
            '"Chromium";v="124", "Microsoft Edge";v="124", "Not-A.Brand";v="99", "Microsoft Edge WebView2";v="124"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        },
      }
    );
    console.log('balance : ', response.data.availableBalance);
    const endTimeUnix = response.data.farming.endTime;
    const endTimeDate = new Date(endTimeUnix);
    const now = new Date();

    const timeDifference = endTimeDate.getTime() - now.getTime();
    let timeDifferenceInMinutes = Math.ceil(timeDifference / (1000 * 60));
    const timerInterval = setInterval(() => {
      if (timeDifferenceInMinutes <= 0) {
        clearInterval(timerInterval);
        console.log('Waktu klaim telah tiba!');
        return;
      }

      console.log(`Sisa waktu klaim: ${timeDifferenceInMinutes} menit`);
      timeDifferenceInMinutes--;
    }, 60 * 60 * 1000);

    setTimeout(getClaim, timeDifference);
    console.log('Klaim selanjutnya :', timeDifferenceInMinutes, 'menit lagi');

    //ubah disini untuk waktu pengambilan refresh token
    const satuJamDalamMilidetik = 30 * 60 * 1000;
    // const satuJamDalamMilidetik = 5000;

    setTimeout(refreshToken, satuJamDalamMilidetik);
    console.log('Refresh token akan dipanggil setelah 30 menit');
    console.log(token);
    let countdownTime = satuJamDalamMilidetik;
    const refreshCountdownInterval = setInterval(() => {
      if (countdownTime <= 0) {
        clearInterval(refreshCountdownInterval);
        console.log('Refresh token telah dipanggil!');
        return;
      }

      const remainingMinutes = Math.floor(countdownTime / 60000); // 60000 milidetik = 1 menit
      if (countdownTime % 60000 === 0) {
        console.log(`Sisa waktu refresh token: ${remainingMinutes} menit`);
      }

      countdownTime -= 1000;
    }, 30 * 60 * 1000);
  } catch (error) {
    console.log('test token', token);
    console.log('error 3: ', error);
  }
}

async function refreshToken() {
  try {
    const response = await axios.post(
      'https://c2.rpc.fastnear.com/',
      {
        refresh: token,
      }
    );
    token = response.data.access;
    refToken = response.data.refresh;
    console.log(response.data);
    setTimeout(getBalance, 10000)
    getClaim();
  } catch (error) {
    console.log('error 4: ', error.response.data);
  }
}

getClaim();
