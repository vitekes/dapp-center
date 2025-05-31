import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

/**
 * Деплой DonationContract и добавление его в trusted-список SoulboundBadge.
 * ENV:
 *   THRESHOLDS — пороги в ETH, через запятую (по умолчанию "0.01,0.1,0.5,1,5")
 */
const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { ethers, deployments, getNamedAccounts } = hre;
  const { deploy, execute } = deployments;
  const { deployer } = await getNamedAccounts();

  const badge = await deployments.get("SoulboundBadge");

  const thresholds = (process.env.THRESHOLDS ?? "0.01,0.1,0.5,1,5")
      .split(",")
      .map(ethers.parseEther);

  const donation = await deploy("DonationContract", {
    from: deployer,
    args: [badge.address, deployer, thresholds],
    log: true,
  });

  // Делаем контракт доверенным в SoulboundBadge
  await execute(
      "SoulboundBadge",
      { from: deployer, log: true },
      "setTrusted",
      donation.address,
      true
  );
};

export default func;
func.tags = ["Donation"];
func.dependencies = ["Badge"];