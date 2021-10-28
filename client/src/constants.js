//const CONTRACT_ADDRESS = "0xCc90ce8AB3d4F8905164D3b256e259A039D9CFBd"; //Rinkeby
const CONTRACT_ADDRESS = "0x79aA699a689Ec199999E31ad77A75c0aD2f099e9"; //Ganache

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
