//const CONTRACT_ADDRESS = "0xCc90ce8AB3d4F8905164D3b256e259A039D9CFBd"; //Rinkeby
const CONTRACT_ADDRESS = "0xe0645f828401eF68696371e682F9254EA3988b91"; //Ganache

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
