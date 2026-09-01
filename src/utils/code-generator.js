const letterCode = async (letter_code, month, year, sequence) => {
    const nextSequenceNumber = sequence + 1;
    const sequencePadded = String(nextSequenceNumber).padStart(3, '0');
    const romawiNumber = {1:'I',2:'II',3:'III',4:'IV',5:'V',6:'VI',7:'VII',8:'VIII',9:'IX',10:'X',11:'XI',12:'XII'};
    const romMonth = romawiNumber[month];
    
    return `${sequencePadded}/${letter_code}/${romMonth}-${year}`;
}

module.exports = {letterCode};