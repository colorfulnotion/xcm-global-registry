const xcmgarTool = require("../xcmgarTool");
const ChainParser = require("./common_chainparser");

/*
Fork this template to create new custom parser. And replace all [Sample] in this
file with para name

Support chains
[polkadot-2046|darwinia]
[kusama-2105|crab]
*/

module.exports = class DarwiniaParser extends ChainParser {

    parserName = 'Darwinia';

    //change [garPallet:garPallet] to the location where the asset registry is located.  ex: [assets:metadata]
    garPallet = 'assets';
    garStorage = 'metadata';

    //change [xcGarPallet:xcGarStorage] to the location where the xc registry is located.  ex: [assetManager:assetIdType]
    xcGarPallet = 'assetManager'
    xcGarStorage = 'assetIdType'

    augment = {}
    manualRegistry = {
        "polkadot-2046": [{
            asset: {
                "Token": "RING"
            },
            xcmInteriorKey: '[{"network":"polkadot"},{"parachain":2046},{"palletInstance":5}]'
        }],
        'kusama-2105': [{
            asset: {
                "Token": "MOVR"
            },
            xcmInteriorKey: '[{"network":"kusama"},{"parachain":2105},{"palletInstance":5}]'
        }]
    }

    isXcRegistryAvailable = true

    //step 1: parse gar pallet, storage for parachain's asset registry
    async fetchGar(chainkey) {
        // implement your gar parsing function here.
        await this.processDarwiniaGar(chainkey)
    }

    //step 2: parse xcGar pallet, storage for parachain's xc asset registry
    async fetchXcGar(chainkey) {
        if (!this.isXcRegistryAvailable) {
            // skip if xcGar parser is unavailable
            console.log(`[${chainkey}] ${this.parserName} xcGar NOT IMPLEMENTED - SKIP`)
            return
        }
        // implement your xcGar parsing function here.
        await this.processDarwiniaXcGar(chainkey)
    }

    //step 3: Optional augmentation by providing (a) a list xcm extrinsicIDs or (b) known xcmInteriorKeys-assets mapping
    async fetchAugments(chainkey) {
        //[Optional A] implement your augment parsing function here.
        await this.processDarwiniaAugment(chainkey)
        //[Optional B ] implement your manual registry here.
        await this.processDarwiniaManualRegistry(chainkey)
    }

    // Implement Darwinia gar parsing function here
    async processDarwiniaGar(chainkey) {
        console.log(`[${chainkey}] ${this.parserName} custom GAR parser`)
        //step 0: use fetchQuery to retrieve gar registry at the location [assets:garStorage]
        let a = await super.fetchQuery(chainkey, this.garPallet, this.garStorage, 'GAR')
        if (a) {
            // step 1: use common Asset pallet parser func available at generic chainparser.
            let assetList = this.processGarAssetPallet(chainkey, a)
            // step 2: load up results
            for (const assetChainkey of Object.keys(assetList)) {
                let assetInfo = assetList[assetChainkey]
                this.manager.setChainAsset(chainkey, assetChainkey, assetInfo)
            }
        }
    }

    // Implement Darwinia xcgar parsing function here
    async processDarwiniaXcGar(chainkey) {
        console.log(`[${chainkey}] ${this.parserName} custom xcGAR parser`)
        let pieces = chainkey.split('-')
        let relayChain = pieces[0]
        let paraIDSource = pieces[1]
        //step 0: use fetchQuery to retrieve xc registry at the location [assetManager:assetIdType]
        var a = await super.fetchQuery(chainkey, this.xcGarPallet, this.xcGarStorage, 'xcGAR')
        if (!a) return
        if (a) {
            // step 1: use common XcmAssetIdType parser func available at generic chainparser.
            let [xcAssetList, assetIDList, updatedAssetList, unknownAsset] = await this.processXcmAssetIdType(chainkey, a)
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

    // Implement Darwinia manual registry function here
    async processDarwiniaManualRegistry(chainkey) {
        console.log(`[${chainkey}] ${this.parserName} manual`)
        let pieces = chainkey.split('-')
        let relayChain = pieces[0]
        let paraIDSource = pieces[1]
        let manualRecs = this.manualRegistry[chainkey]
        this.processManualRegistry(chainkey, manualRecs)
    }

    // Implement Darwinia Augment function here
    async processDarwiniaAugment(chainkey) {
        return
    }
}