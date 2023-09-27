/* Validate Split String Message */
exports.validateSplitStringMessage = async (splitStringMessage, subStringMessage) => {

    return splitStringMessage
      .filter(element => subStringMessage !== element)
      .map(element => {
        const countNumber = Number(element.substring(0, 2));
        if (!isNaN(element) && countNumber !== 0) {
          return countNumber;
        } else {
          throw new Error('❌ Invalid number format');
        }
      });
  }
  
  
  /*  Shuffle Array By Chat GPT */
  exports.shuffleArray = async (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  /* Create Maximum Table */
  exports.createTable = async (countTable, arrayTableLength) => {
    if (arrayTableLength > countTable) {
        return;
    }
    let arrTable = []
    for (let index = 0; index <= countTable; index++) {
  
        arrTable[index] = {
            members: []
        }
    }
    return arrTable;
  }