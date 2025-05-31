import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

/**
 * constructor(string baseUri, address admin)
 */
const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const baseUri = process.env.BASE_URI ?? "ipfs://<CID>/";

  await deploy("SoulboundBadge", {
    from: deployer,
    args: [baseUri, deployer], // <-- сначала URI, потом адрес
    log: true,
  });
};

export default func;
func.tags = ["Badge"];