const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
  const gameContract = await gameContractFactory.deploy(
    ["Saitama", "Mumen Rider", "All Might"], // Names
    [
      "QmSqFqxAC3rygcQ1WLuy9utarM6Dqn7TgCYxvgwSN4n3B1", // Images
      "QmQpmPHdARDV48DZ5NSXT7YLAxToug263gdxsRTf7n52jk",
      "QmYk5BYM6iqPFJS4o6idTEAkZBDvGaWi4KkW9df5mfvMyh",
    ],
    [100, 75, 300], // HP values
    [50, 25, 478], // Attack damage values
    "Orochimaru", //Boss name
    "QmW59w63AAZCeYScFTxc6Mt48bc8m379rzmBhyMgYtzQwi", //Boss image
    10000, //Boss HP
    50 //Boss attack damage
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);
  // let txn;
  // // We only have three characters.
  // // an NFT w/ the character at index 2 of our array.
  // txn = await gameContract.mintCharacterNFT(2);
  // await txn.wait();

  // txn = await gameContract.attackBoss();
  // await txn.wait();

  // txn = await gameContract.attackBoss();
  // await txn.wait();
  // Get the value of the NFT's URI.
  let returnedTokenUri = await gameContract.tokenURI(1);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
