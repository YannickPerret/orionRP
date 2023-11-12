const generateNumber = () => {
  //generate 5 random numbers and return them as a string with starting 555
  let number = "555";
  for (let i = 0; i < 5; i++) {
    number += Math.floor(Math.random() * 10);
  }
  return number;
};

module.exports = generateNumber;
