//const CONTRACT_ADDRESS = "0xCc90ce8AB3d4F8905164D3b256e259A039D9CFBd"; //Rinkeby
const CONTRACT_ADDRESS = "0x4c4D8D97E0A07Dc9ef1FC620105320586B490357"; //Ganache

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
};

export { CONTRACT_ADDRESS, transformCharacterData };
