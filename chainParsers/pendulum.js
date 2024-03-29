const xcmgarTool = require("../xcmgarTool");
const ChainParser = require("./common_chainparser");

/*
Support chains
polkadot-2094|pendulum
kusama-2124|amplitude
*/

module.exports = class PendulumParser extends ChainParser {

    parserName = 'Pendulum';

    //change [garPallet:garPallet] to the location where the asset registry is located.  ex: [assets:metadata]
    garPallet = 'assetRegistry';
    garStorage = 'metadata';

    //change [xcGarPallet:xcGarStorage] to the location where the xc registry is located.  ex: [assetManager:assetIdType]
    xcGarPallet = 'assetRegistry'
    xcGarStorage = 'metadata'

    /*
    Not every parachain has published its xc Asset registry. But we
    can still augment xcAsset registry by inferring.

    To augment the xcAsset by parsing, please provide an array of xcm extrinsicIDs
    containing the xcAsset asset you try to cover:

    augment = {
        'relaychain-paraID': [{
            paraID: 'paraID',
            extrinsicIDs: ['extrinsicID']
        }]
    }
    */

    /*
    Parachain usually does not publish native asset in its own xc registry.
    Allow team to polish xcRegistry using the following format:

    manualRegistry = {
        "relaychain-paraID": [{
            asset: {
                "Token": "currencyID"
            },
            xcmV1Standardized: [{"network":"relaychain"},{"parachain":paraID},{palletInstance/generalKey/generalIndex...}],
        }]
    }
    */
    augment = {}
    manualRegistry = {
        "polkadot-2094": [{
            asset: {
                "Token": "PEN"
            },
            xcmInteriorKey: '[{"network":"polkadot"},{"parachain":2094},{"palletInstance":10}]'
        }],
        'kusama-2124': [{
            asset: {
                "Token": "AMPE"
            },
            xcmInteriorKey: '[{"network":"kusama"},{"parachain":2124},{"palletInstance":10}]'
        }]
    }

    isXcRegistryAvailable = true

    //step 1: parse gar pallet, storage for parachain's asset registry
    async fetchGar(chainkey) {
        // implement your gar parsing function here.
        await this.processPendulumGar(chainkey)
    }

    //step 2: parse xcGar pallet, storage for parachain's xc asset registry
    async fetchXcGar(chainkey) {
        if (!this.isXcRegistryAvailable) {
            // skip if xcGar parser is unavailable
            console.log(`[${chainkey}] ${this.parserName} xcGar NOT IMPLEMENTED - SKIP`)
            return
        }
        // implement your xcGar parsing function here.
        await this.processPendulumXcGar(chainkey)
    }

    //step 3: Optional augmentation by providing (a) a list xcm extrinsicIDs or (b) known xcmInteriorKeys-assets mapping
    async fetchAugments(chainkey) {
        //[Optional A] implement your augment parsing function here.
        await this.processPendulumAugment(chainkey)
        //[Optional B ] implement your manual registry here.
        await this.processPendulumManualRegistry(chainkey)
    }

    // Implement Pendulum gar parsing function here
    async processPendulumGar(chainkey) {
        console.log(`[${chainkey}] ${this.parserName} custom GAR parser`)
        //step 0: use fetchQuery to retrieve gar registry at the location [assets:garStorage]
        let a = await super.fetchQuery(chainkey, this.garPallet, this.garStorage, 'GAR')
        if (a) {
            // step 1: use common Asset pallet parser func available at generic chainparser.
            let assetList = this.processGarAssetPallet(chainkey, a)
            // step 2: load up results
            for (const assetChainkey of Object.keys(assetList)) {
                let assetInfo = assetList[assetChainkey]
                let standardizedAssetChainkey = this.unpadCurrencyID(assetChainkey)
                this.manager.setChainAsset(chainkey, standardizedAssetChainkey, assetInfo)
            }
        }
    }

    unpadCurrencyID(assetChainkey, prefixType = 'XCM'){
        let updatedAssetChainkey = assetChainkey
        let [assetUnparsed, chainkey] = xcmgarTool.parseAssetChain(assetChainkey)
        try {
            let asset = JSON.parse(assetUnparsed)
            let assetID = asset.Token
            if (assetID[prefixType]!= undefined){
                let updatedAssetID = assetID
                updatedAssetChainkey = xcmgarTool.makeAssetChain(JSON.stringify(updatedAssetID), chainkey)
            }
        } catch (e){
            console.log(`unpadCurrencyID err`, e)
        }
        return updatedAssetChainkey
    }

    // Implement Pendulum xcgar parsing function here
    async processPendulumXcGar(chainkey) {
        console.log(`[${chainkey}] ${this.parserName} custom xcGAR parser`)
        let pieces = chainkey.split('-')
        let relayChain = pieces[0]
        let paraIDSource = pieces[1]
        //step 0: use fetchQuery to retrieve xc registry at the location [assetManager:assetIdType]
        let a = await super.fetchQuery(chainkey, this.xcGarPallet, this.xcGarStorage, 'xcGAR')
        if (!a) return
        if (a) {
            // step 1: use common XcmAssetIdType parser func available at generic chainparser.
            let [xcAssetList, assetIDList, updatedAssetList, unknownAsset] = await this.processXcmAssetsRegistryAssetMetadata(chainkey, a)
            console.log(`custom xcAssetList=[${Object.keys(xcAssetList)}], updatedAssetList=[${Object.keys(updatedAssetList)}], unknownAsset=[${Object.keys(unknownAsset)}], assetIDList=[${Object.keys(assetIDList)}]`, xcAssetList)
            // step 2: load up results
            for (const xcmInteriorKey of Object.keys(xcAssetList)) {
                let xcmAssetInfo = xcAssetList[xcmInteriorKey]
                let assetID = assetIDList[xcmInteriorKey]
                this.manager.setXcmAsset(xcmInteriorKey, xcmAssetInfo, chainkey)
                // update global xcRegistry to include assetID used by this parachain
                this.manager.addXcmAssetLocalCurrencyID(xcmInteriorKey, paraIDSource, assetID, chainkey)
            }
            for (const assetChainkey of Object.keys(updatedAssetList)) {
                let assetInfo = updatedAssetList[assetChainkey]
                this.manager.setChainAsset(chainkey, assetChainkey, assetInfo, true)
            }
        }
    }

    // Implement Pendulum manual registry function here
    async processPendulumManualRegistry(chainkey) {
        console.log(`[${chainkey}] ${this.parserName} manual`)
        let pieces = chainkey.split('-')
        let relayChain = pieces[0]
        let paraIDSource = pieces[1]
        let manualRecs = this.manualRegistry[chainkey]
        this.processManualRegistry(chainkey, manualRecs)
    }

    // Implement Pendulum Augment function here
    async processPendulumAugment(chainkey) {
        console.log(`[${chainkey}] ${this.parserName} custom augmentation`)
        let pieces = chainkey.split('-')
        let relayChain = pieces[0]
        let paraIDSource = pieces[1]
        let recs = this.augment[chainkey]
        // step 0: fetch specified extrinsics
        let augmentedExtrinsics = await this.fetchAugmentedExtrinsics(chainkey, recs)
        for (const augmentedExtrinsic of augmentedExtrinsics) {
            console.log(`augmentedExtrinsic`, augmentedExtrinsic)
            // step 1: use common xTokens parser func available at generic chainparser.
            let augmentedMap = this.processOutgoingXTokens(chainkey, augmentedExtrinsic)
            // step 2: load up results
            for (const xcmInteriorKey of Object.keys(augmentedMap)) {
                let augmentedInfo = augmentedMap[xcmInteriorKey]
                let assetID = augmentedInfo.assetID
                let assetChainkey = augmentedInfo.assetChainkey
                this.manager.addXcmAssetLocalCurrencyID(xcmInteriorKey, paraIDSource, assetID, chainkey)
                let cachedAssetInfo = this.manager.getChainAsset(assetChainkey)
                if (cachedAssetInfo) {
                    cachedAssetInfo.xcmInteriorKey = xcmInteriorKey
                    this.manager.setChainAsset(chainkey, assetChainkey, cachedAssetInfo)
                }
            }
        }
    }
}