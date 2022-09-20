const checkResult = (value1, value2) => {
    if (value1 === "paper" && value2 === "scissors") {
      return 2;
    } else if (value1 === "paper" && value2 === "rock") {
      return 1;
    } else if (value1 === "scissors" && value2 === "rock") {
      return 2;
    } else if (value1 === "scissors" && value2 === "paper") {
      return 1;
    } else if (value1 === "rock" && value2 === "paper") {
      return 2;
    } else if (value1 === "rock" && value2 === "scissors") {
      return 1;
    }
    return 0;
  };

module.exports = {
    checkResult
}