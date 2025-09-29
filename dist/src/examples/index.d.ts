/**
 * Examples Index
 * This file imports and exports all example functions from the organized test files
 */
import { tokenCreationExamples } from "./tests/tokenCreation.test";
import { nftCreationExamples } from "./tests/nftCreation.test";
import { nativeTransferExamples } from "./tests/nativeTransfer.test";
import { swapExamples } from "./tests/swap.test";
import { poolCreationExamples } from "./tests/poolCreation.test";
import { addLiquidityExamples } from "./tests/addLiquidity.test";
export declare const examples: {
    tokenCreation: {
        createTokenOnGorbchain: typeof import("./tests/tokenCreation.test").createTokenOnGorbchain;
        createTokenOnSolana: typeof import("./tests/tokenCreation.test").createTokenOnSolana;
        createTokenWithWallet: typeof import("./tests/tokenCreation.test").createTokenWithWallet;
        createTokenWithDualSigners: typeof import("./tests/tokenCreation.test").createTokenWithDualSigners;
        batchTokenCreation: typeof import("./tests/tokenCreation.test").batchTokenCreation;
        createTokenWithErrorHandling: typeof import("./tests/tokenCreation.test").createTokenWithErrorHandling;
        createTokenWithCustomUpdateAuthority: typeof import("./tests/tokenCreation.test").createTokenWithCustomUpdateAuthority;
        createTokenWithSimulation: typeof import("./tests/tokenCreation.test").createTokenWithSimulation;
    };
    nftCreation: {
        createNFTOnGorbchain: typeof import("./tests/nftCreation.test").createNFTOnGorbchain;
        createNFTWithWallet: typeof import("./tests/nftCreation.test").createNFTWithWallet;
        createNFTWithDualSigners: typeof import("./tests/nftCreation.test").createNFTWithDualSigners;
        batchNFTCreation: typeof import("./tests/nftCreation.test").batchNFTCreation;
        createNFTWithErrorHandling: typeof import("./tests/nftCreation.test").createNFTWithErrorHandling;
        createNFTWithCustomUpdateAuthority: typeof import("./tests/nftCreation.test").createNFTWithCustomUpdateAuthority;
        createNFTWithSimulation: typeof import("./tests/nftCreation.test").createNFTWithSimulation;
        createNFTOnSolanaMainnet: typeof import("./tests/nftCreation.test").createNFTOnSolanaMainnet;
        createNFTWithDetailedMetadata: typeof import("./tests/nftCreation.test").createNFTWithDetailedMetadata;
        createNFTWithRetry: typeof import("./tests/nftCreation.test").createNFTWithRetry;
    };
    nativeTransfer: {
        transferSOLSingleSigner: typeof import("./tests/nativeTransfer.test").transferSOLSingleSigner;
        transferSOLDualSigner: typeof import("./tests/nativeTransfer.test").transferSOLDualSigner;
        transferSOLWithWallet: typeof import("./tests/nativeTransfer.test").transferSOLWithWallet;
        transferSOLWithWalletAndAdmin: typeof import("./tests/nativeTransfer.test").transferSOLWithWalletAndAdmin;
        universalTransferExample: typeof import("./tests/nativeTransfer.test").universalTransferExample;
        batchNativeTransfers: typeof import("./tests/nativeTransfer.test").batchNativeTransfers;
        transferSOLWithErrorHandling: typeof import("./tests/nativeTransfer.test").transferSOLWithErrorHandling;
        transferSOLWithSimulation: typeof import("./tests/nativeTransfer.test").transferSOLWithSimulation;
        transferSOLWithRetry: typeof import("./tests/nativeTransfer.test").transferSOLWithRetry;
        transferSOLWithDifferentAmounts: typeof import("./tests/nativeTransfer.test").transferSOLWithDifferentAmounts;
    };
    swap: {
        swapTokenToToken: typeof import("./tests/swap.test").swapTokenToToken;
        swapSOLToToken: typeof import("./tests/swap.test").swapSOLToToken;
        swapTokenToSOL: typeof import("./tests/swap.test").swapTokenToSOL;
        swapWithDualSigner: typeof import("./tests/swap.test").swapWithDualSigner;
        swapWithWallet: typeof import("./tests/swap.test").swapWithWallet;
        swapWithWalletAndAdmin: typeof import("./tests/swap.test").swapWithWalletAndAdmin;
        universalSwapExample: typeof import("./tests/swap.test").universalSwapExample;
        batchTokenSwaps: typeof import("./tests/swap.test").batchTokenSwaps;
        swapTokensWithErrorHandling: typeof import("./tests/swap.test").swapTokensWithErrorHandling;
        swapTokensWithSimulation: typeof import("./tests/swap.test").swapTokensWithSimulation;
    };
    poolCreation: {
        createPoolSingleSigner: typeof import("./tests/poolCreation.test").createPoolSingleSigner;
        createPoolDualSigner: typeof import("./tests/poolCreation.test").createPoolDualSigner;
        createPoolWithWallet: typeof import("./tests/poolCreation.test").createPoolWithWallet;
        createPoolWithWalletAndAdmin: typeof import("./tests/poolCreation.test").createPoolWithWalletAndAdmin;
        universalPoolCreationExample: typeof import("./tests/poolCreation.test").universalPoolCreationExample;
        batchPoolCreations: typeof import("./tests/poolCreation.test").batchPoolCreations;
        createPoolWithErrorHandling: typeof import("./tests/poolCreation.test").createPoolWithErrorHandling;
        createPoolWithSimulation: typeof import("./tests/poolCreation.test").createPoolWithSimulation;
        createPoolWithRetry: typeof import("./tests/poolCreation.test").createPoolWithRetry;
        createPoolWithDifferentTokenPairs: typeof import("./tests/poolCreation.test").createPoolWithDifferentTokenPairs;
    };
    addLiquidity: {
        addLiquiditySingleSigner: typeof import("./tests/addLiquidity.test").addLiquiditySingleSigner;
        addLiquidityDualSigner: typeof import("./tests/addLiquidity.test").addLiquidityDualSigner;
        addLiquidityWithWallet: typeof import("./tests/addLiquidity.test").addLiquidityWithWallet;
        addLiquidityWithWalletAndAdmin: typeof import("./tests/addLiquidity.test").addLiquidityWithWalletAndAdmin;
        universalAddLiquidityExample: typeof import("./tests/addLiquidity.test").universalAddLiquidityExample;
        batchAddLiquidity: typeof import("./tests/addLiquidity.test").batchAddLiquidity;
        addLiquidityWithErrorHandling: typeof import("./tests/addLiquidity.test").addLiquidityWithErrorHandling;
        addLiquidityWithSimulation: typeof import("./tests/addLiquidity.test").addLiquidityWithSimulation;
        addLiquidityWithRetry: typeof import("./tests/addLiquidity.test").addLiquidityWithRetry;
        addLiquidityWithDifferentAmounts: typeof import("./tests/addLiquidity.test").addLiquidityWithDifferentAmounts;
    };
};
export { tokenCreationExamples, nftCreationExamples, nativeTransferExamples, swapExamples, poolCreationExamples, addLiquidityExamples, };
export declare function runAllExamples(): Promise<void>;
export declare const createTokenOnGorbchain: typeof import("./tests/tokenCreation.test").createTokenOnGorbchain, createTokenOnSolana: typeof import("./tests/tokenCreation.test").createTokenOnSolana, createTokenWithWallet: typeof import("./tests/tokenCreation.test").createTokenWithWallet, createTokenWithDualSigners: typeof import("./tests/tokenCreation.test").createTokenWithDualSigners, batchTokenCreation: typeof import("./tests/tokenCreation.test").batchTokenCreation, createTokenWithErrorHandling: typeof import("./tests/tokenCreation.test").createTokenWithErrorHandling, createTokenWithCustomUpdateAuthority: typeof import("./tests/tokenCreation.test").createTokenWithCustomUpdateAuthority, createTokenWithSimulation: typeof import("./tests/tokenCreation.test").createTokenWithSimulation;
export declare const createNFTOnGorbchain: typeof import("./tests/nftCreation.test").createNFTOnGorbchain, createNFTWithWallet: typeof import("./tests/nftCreation.test").createNFTWithWallet, createNFTWithDualSigners: typeof import("./tests/nftCreation.test").createNFTWithDualSigners, batchNFTCreation: typeof import("./tests/nftCreation.test").batchNFTCreation, createNFTWithErrorHandling: typeof import("./tests/nftCreation.test").createNFTWithErrorHandling, createNFTWithCustomUpdateAuthority: typeof import("./tests/nftCreation.test").createNFTWithCustomUpdateAuthority, createNFTWithSimulation: typeof import("./tests/nftCreation.test").createNFTWithSimulation, createNFTOnSolanaMainnet: typeof import("./tests/nftCreation.test").createNFTOnSolanaMainnet, createNFTWithDetailedMetadata: typeof import("./tests/nftCreation.test").createNFTWithDetailedMetadata, createNFTWithRetry: typeof import("./tests/nftCreation.test").createNFTWithRetry;
export declare const transferSOLSingleSigner: typeof import("./tests/nativeTransfer.test").transferSOLSingleSigner, transferSOLDualSigner: typeof import("./tests/nativeTransfer.test").transferSOLDualSigner, transferSOLWithWallet: typeof import("./tests/nativeTransfer.test").transferSOLWithWallet, transferSOLWithWalletAndAdmin: typeof import("./tests/nativeTransfer.test").transferSOLWithWalletAndAdmin, universalTransferExample: typeof import("./tests/nativeTransfer.test").universalTransferExample, batchNativeTransfers: typeof import("./tests/nativeTransfer.test").batchNativeTransfers, transferSOLWithErrorHandling: typeof import("./tests/nativeTransfer.test").transferSOLWithErrorHandling, transferSOLWithSimulation: typeof import("./tests/nativeTransfer.test").transferSOLWithSimulation, transferSOLWithRetry: typeof import("./tests/nativeTransfer.test").transferSOLWithRetry, transferSOLWithDifferentAmounts: typeof import("./tests/nativeTransfer.test").transferSOLWithDifferentAmounts;
export declare const swapTokenToToken: typeof import("./tests/swap.test").swapTokenToToken, swapSOLToToken: typeof import("./tests/swap.test").swapSOLToToken, swapTokenToSOL: typeof import("./tests/swap.test").swapTokenToSOL, swapWithDualSigner: typeof import("./tests/swap.test").swapWithDualSigner, swapWithWallet: typeof import("./tests/swap.test").swapWithWallet, swapWithWalletAndAdmin: typeof import("./tests/swap.test").swapWithWalletAndAdmin, universalSwapExample: typeof import("./tests/swap.test").universalSwapExample, batchTokenSwaps: typeof import("./tests/swap.test").batchTokenSwaps, swapTokensWithErrorHandling: typeof import("./tests/swap.test").swapTokensWithErrorHandling, swapTokensWithSimulation: typeof import("./tests/swap.test").swapTokensWithSimulation;
export declare const createPoolSingleSigner: typeof import("./tests/poolCreation.test").createPoolSingleSigner, createPoolDualSigner: typeof import("./tests/poolCreation.test").createPoolDualSigner, createPoolWithWallet: typeof import("./tests/poolCreation.test").createPoolWithWallet, createPoolWithWalletAndAdmin: typeof import("./tests/poolCreation.test").createPoolWithWalletAndAdmin, universalPoolCreationExample: typeof import("./tests/poolCreation.test").universalPoolCreationExample, batchPoolCreations: typeof import("./tests/poolCreation.test").batchPoolCreations, createPoolWithErrorHandling: typeof import("./tests/poolCreation.test").createPoolWithErrorHandling, createPoolWithSimulation: typeof import("./tests/poolCreation.test").createPoolWithSimulation, createPoolWithRetry: typeof import("./tests/poolCreation.test").createPoolWithRetry, createPoolWithDifferentTokenPairs: typeof import("./tests/poolCreation.test").createPoolWithDifferentTokenPairs;
export declare const addLiquiditySingleSigner: typeof import("./tests/addLiquidity.test").addLiquiditySingleSigner, addLiquidityDualSigner: typeof import("./tests/addLiquidity.test").addLiquidityDualSigner, addLiquidityWithWallet: typeof import("./tests/addLiquidity.test").addLiquidityWithWallet, addLiquidityWithWalletAndAdmin: typeof import("./tests/addLiquidity.test").addLiquidityWithWalletAndAdmin, universalAddLiquidityExample: typeof import("./tests/addLiquidity.test").universalAddLiquidityExample, batchAddLiquidity: typeof import("./tests/addLiquidity.test").batchAddLiquidity, addLiquidityWithErrorHandling: typeof import("./tests/addLiquidity.test").addLiquidityWithErrorHandling, addLiquidityWithSimulation: typeof import("./tests/addLiquidity.test").addLiquidityWithSimulation, addLiquidityWithRetry: typeof import("./tests/addLiquidity.test").addLiquidityWithRetry, addLiquidityWithDifferentAmounts: typeof import("./tests/addLiquidity.test").addLiquidityWithDifferentAmounts;
//# sourceMappingURL=index.d.ts.map