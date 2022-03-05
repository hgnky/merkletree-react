import { InjectedConnector } from "@web3-react/injected-connector";

export const injected = new InjectedConnector({
    supportedChainIds: [97]
});

export const requestChangeNetwork = async (chainId) => {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainId }],
        });
    } catch (error) {
        if (error.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: chainId,
                            rpcUrl: getrpcURLWithChainId(chainId),
                        },
                    ],
                });
            } catch (addError) {
                console.error(addError);
            }
        }
        console.error(error);
    }
}

export const getrpcURLWithChainId = (id) => {
    if (parseInt(id) === 1) return "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    if (parseInt(id) === 137) return "https://polygon-rpc.com/"
    if (parseInt(id) === 43114) return "https://api.avax.network/ext/bc/C/rpc"
    if (parseInt(id) === 97) return "https://data-seed-prebsc-1-s1.binance.org:8545/";
}
