//const CONTRACT_ADDRESS = "0xCc90ce8AB3d4F8905164D3b256e259A039D9CFBd"; //Rinkeby
const CONTRACT_ADDRESS = "0x5Ef81F9583650B786D8F5cE05bc2c9d5E63BAb3c"; //Ganache

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
    criticalRate: characterData.criticalRate.toNumber(),
  };
};

export { CONTRACT_ADDRESS, transformCharacterData };
