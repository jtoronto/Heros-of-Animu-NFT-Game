import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import myEpicGame from "../../utils/MyEpicGame.json";
import "./Arena.css";
import LoadingIndicator from "../LoadingIndicator";
import ImageWithLoadingIndicator from "../ImageWithLoadingIndicator/ImageWithLoadingIndicator";
import { use } from "chai";

/*
 * We pass in our characterNFT metadata so we can a cool card in our UI
 */
const Arena = ({ characterNFT, setCharacterNFT }) => {
  // State
  const [gameContract, setGameContract] = useState(null);
  const [boss, setBoss] = useState(null);
  const [attackState, setAttackState] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState("");
  const [characterHealthBoostLevels, setCharacterHealthBoostLevels] = useState(
    []
  );
  // UseEffects
  const healthPricePerUnit = 0.01;
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      setGameContract(gameContract);
    } else {
      console.log("Ethereum object not found");
    }
    calculateHealthBoostLevels();
  }, []);

  useEffect(() => {
    /*
     * Setup async function that will get the boss from our contract and sets in state
     */
    const fetchBoss = async () => {
      const bossTxn = await gameContract.getBigBoss();
      console.log("Boss:", bossTxn);
      setBoss(transformCharacterData(bossTxn));
    };

    /*
     * Setup logic when this event is fired off
     */
    const onAttackComplete = (newBossHp, newPlayerHp) => {
      const bossHp = newBossHp.toNumber();
      const playerHp = newPlayerHp.toNumber();

      console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

      /*
       * Update both player and boss Hp
       */
      setBoss((prevState) => {
        return { ...prevState, hp: bossHp };
      });

      setCharacterNFT((prevState) => {
        return { ...prevState, hp: playerHp };
      });
      calculateHealthBoostLevels();
    };

    if (gameContract) {
      fetchBoss();
      gameContract.on("AttackComplete", onAttackComplete);
    }
    return () => {
      if (gameContract) {
        gameContract.off("AttackComplete", onAttackComplete);
      }
    };
  }, [gameContract]);

  const popToast = (text) => {
    setToastText(text);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setToastText("");
    }, 5000);
  };

  const runAttackAction = async () => {
    try {
      if (gameContract) {
        setAttackState("attacking");
        console.log("Attacking boss...");
        const attackTxn = await gameContract.attackBoss();
        await attackTxn.wait();
        console.log("attackTxn:", attackTxn);
        setAttackState("hit");
        popToast(`💥 ${boss.name} was hit for ${characterNFT.attackDamage}!`);
      }
    } catch (error) {
      console.error("Error attacking boss:", error);
      setAttackState("");
    }
  };

  const calculateHealthBoostLevels = () => {
    //Calculate 25%
    const level1 = parseInt((characterNFT.maxHp - characterNFT.hp) * 0.25);
    const level2 = parseInt((characterNFT.maxHp - characterNFT.hp) * 0.5);
    const level3 = parseInt(characterNFT.maxHp - characterNFT.hp);
    console.log("Calculated health boost levels", level1, level2, level3);
    setCharacterHealthBoostLevels([level1, level2, level3]);
  };

  const revivePlayerNFT = async () => {
    try {
      if (gameContract) {
        console.log("Attempt revive Character");
        await gameContract.revivePlayerNFT({
          value: ethers.utils.parseEther(".005"),
        });
        gameContract.on("PlayerRevived", (newPlayerHP) => {
          console.log("Player revived");
          popToast(`${characterNFT.name} was revived! 🏨`);

          setCharacterNFT((prevState) => {
            let playerHP = newPlayerHP.toNumber();
            return { ...prevState, hp: playerHP };
          });

          gameContract.off("PlayerRevived");
        });
      }
    } catch (error) {
      console.error("Error reviving character", error);
    }
  };

  const boostPlayerNFTHealth = async (selection) => {
    console.log("Health boost selected");
    try {
      if (gameContract) {
        const healthRequested = characterHealthBoostLevels[selection];
        console.log("Attempt boost health by", healthRequested);
        let price = healthRequested * healthPricePerUnit;
        await gameContract.purchaseHealth(healthRequested, {
          value: ethers.utils.parseEther(price.toString()),
        });
        gameContract.on("HealthBoosted", (newPlayerHP) => {
          console.log(`Health boosted: ${newPlayerHP} hp`);
          popToast(`Health boosted: ${newPlayerHP} hp 💊`);

          setCharacterNFT((prevState) => {
            let playerHP = newPlayerHP.toNumber();
            return { ...prevState, hp: playerHP };
          });
          calculateHealthBoostLevels();
          gameContract.off("HealthBoosted");
        });
      }
    } catch (error) {
      console.error("Error boosting health", error);
    }
  };

  return (
    <div className="arena-container">
      {showToast && (
        <div id="toast" className="show">
          <div id="desc">{toastText}</div>
        </div>
      )}
      {/* Boss */}
      {boss && (
        <div className="boss-container">
          <div className={`boss-content ${attackState}`}>
            <h2>🔥 {boss.name} 🔥</h2>
            <div className="image-content">
              <ImageWithLoadingIndicator
                src={`https://cloudflare-ipfs.com/ipfs/${boss.imageURI}`}
                alt={`Boss ${boss.name}`}
              />
              {/* <img
                src={`https://cloudflare-ipfs.com/ipfs/${boss.imageURI}`}
                alt={`Boss ${boss.name}`}
              /> */}
              <div className="health-bar">
                <progress value={boss.hp} max={boss.maxHp} />
                <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
              </div>
            </div>
          </div>
          <div className="attack-container">
            <button className="cta-button" onClick={runAttackAction}>
              {`💥 Attack ${boss.name}`}
            </button>
            {attackState === "attacking" && (
              <div className="loading-indicator">
                <LoadingIndicator />
                <p>Attacking ⚔️</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Replace your Character UI with this */}
      {characterNFT && (
        <div className="players-container">
          <div className="player-container">
            <h2>Your Character</h2>
            <div className="player">
              <div className="image-content">
                <h2>{characterNFT.name}</h2>
                <ImageWithLoadingIndicator
                  src={`https://cloudflare-ipfs.com/ipfs/${characterNFT.imageURI}`}
                  alt={`Character ${characterNFT.name}`}
                />
                <div className="health-bar">
                  <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                  <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
                </div>
              </div>
              <div className="stats">
                <h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
              </div>
            </div>
            <div className="healthBoostButtonDiv">
              {characterNFT.hp == 0 && (
                <button className="reviveButton" onClick={revivePlayerNFT}>
                  {`Revive Character: 0.005 Eth`}
                </button>
              )}
              {characterNFT.hp < characterNFT.maxHp && characterNFT.hp != 0 && (
                <React.Fragment>
                  <button
                    className="healthBoostButton"
                    onClick={() => {
                      boostPlayerNFTHealth(0);
                    }}
                  >
                    {`Boost health 25%`}
                    <br />
                    {characterHealthBoostLevels[0] * healthPricePerUnit} {`eth`}
                  </button>
                  <button
                    className="healthBoostButton"
                    onClick={() => {
                      boostPlayerNFTHealth(1);
                    }}
                  >
                    {`Boost health 50%`}
                    <br />
                    {characterHealthBoostLevels[1] * healthPricePerUnit} {`eth`}
                  </button>
                  <button
                    className="healthBoostButton"
                    onClick={() => {
                      boostPlayerNFTHealth(2);
                    }}
                  >
                    {`Boost health to max %`}
                    <br />
                    {characterHealthBoostLevels[2] * healthPricePerUnit} {`eth`}
                  </button>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Arena;
