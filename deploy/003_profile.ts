import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

/**
 * Деплой Profile, если DEPLOY_PROFILE !== "false"
 */
const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  if (process.env.DEPLOY_PROFILE === "false") return;

  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("Profile", {
    from: deployer,
    args: [],
    log: true,
  });
};

export default func;
func.tags = ["Profile"];