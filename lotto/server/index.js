const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const { BASE_URL, PORT } = require("./constants");

app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message: "다음 링크에서 로또 회차별 당첨정보를 확인할 수 있습니다.",
    link: `http://localhost:${PORT}/lotto/{회차번호}`,
  });
});

app.get("/lotto/:round", (req, res) => {
  const { round } = req.params;
  const winningLotto = {
    winningNumbers: [],
    bonus: null
  };
  axios
    .get(`${BASE_URL}?method=getLottoNumber&drwNo=${round}`)
    .then(({ data }) => {
      if (data.returnValue === "fail") {
        return res.json({ message: "잘못된 회차입니다." });
      }
      Object.keys(data)
        .filter(key => key.startsWith("drwtNo"))
        .forEach(key => winningLotto.winningNumbers.push(data[key]));
      winningLotto.winningNumbers = winningLotto.winningNumbers.sort((num1, num2) => num1 - num2);
      winningLotto.bonus = data.bnusNo;
      return res.json(winningLotto);
    })
    .catch(err => console.error(err));
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} 에서 서버 가동중...`);
});
