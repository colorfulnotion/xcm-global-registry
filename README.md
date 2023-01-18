# XCM Global Asset Registry

## TL;DR
This XCM Global Asset Registry (xcgar) repo is a data processing algorithm to aggregate multiple on-chain asset registries into one XCM Global Asset Registry.  

* Input: known [RPC endpoints](https://github.com/colorfulnotion/xcm-global-registry/tree/main/assets) from relaychains (Polkadot/Kusama/Rococo/..) and its parachains.

* Output: one [global registry](https://github.com/colorfulnotion/xcm-global-registry/tree/main/xcmgar) containing all xcAsset across parachains: [ ... ] and [local (xc)Assets registry](https://github.com/colorfulnotion/xcm-global-registry/tree/main/assets/polkadot) per each parachain.

As of mid-January 2023, xcgar covers 55+ chains with 30 xcAssets on Polkadot and 44 on Kusama. This is a work in progress and needs contributions from parachain teams to be successful. Data is updated weekly to daily.

Target use cases: multichain dapps, chain analytics in the Substrate ecosystem.

## Filling the lack of XCM Global Asset Registry

Engineers, dapp developers and analytics providers are currently faced with a "Tower of Babel" to align each parachain's asset registry and XCM asset registry and associated weights/fees. Multichain dapp developers (including multi-chain indexers like [Polkaholic.io](https://polkaholic.io)) are required to independently develop this mapping just to initiate seemly simple XCM tasks like transferring “KSM” or "USDT" from one chain to another or indexing XCM transfers.   In our opinion, it’s counter-productive to require multichain app developers to independently piece this together, and futhermore, read fee constants in N parachains to support their multi-chain dapps and be faced with so much friction.  

In our work in Polkaholic.io XCM Indexing, we have developed a useful API [[Polkaholic.io Multilocation Tool]](https://polkaholic.io/multilocation) that attempts to address the Tower of Babel. We believe this already covers as much as 90% of the cross-chain transferable assets and over 97% of the XCM Transfer USD volume in Polkadot + Kusama at present.  However, we believe that the recipe for this dataset construction should be managed not by one "trusted" team but with:
* (A) _Open Source Data Generation_ (automated Github Action) - Given Input: Polkadot + Kusama WSEndpoints from polkadot.js apps, augmented with a polkadot.toml file containing details of how to process the (xc)asset registry of each parachain
    * Step 1: Crawl assetRegistry + xcAssetRegistry and store it in JSON file
    * Step 2: Aggregate and publish registry keyed by `XcmInteriorKey`

* (B) Joint Collaboration -
    * Having *Open Source Data Generation* managed by parachain teams who model their own (xcm) asset registry and fees accurately when working their parachain partners.

The data generation process is technically simple, but we cant stress enough the importance of joint collaboration - currently many parachain chains are largely building their own 'xcm-tools' independently of one another and only trying to cover a subset of the xcm global asset registry problem.  

Key Use cases for the XCM Global Asset Registry (GAR):
* Powering XCM Transfer dapps with `Multilocation`
* Parachain Bridge Monitoring
* Statemine DEX Aggregator
* Cross-chain Price Quote Mechanism that have `MultiLocation`

Together, we can do much better, and be more reactive to any incompleteness and inaccuracy, because simply put, 90-97% is not good enough to   Here the expectation is to collaborate for the common good/maximal impact:
* When parachains or dapp developers see errors in step 1/2, they submit PRs because their community depends on the output  
* Parachain reviewers from the affected teams will approve the PR, with special attention to how the registry changes  with any change.
* Updates to the repo’s output dataset
* Data pipelining with Github actions

We can only succeed if parachains possess high reactivity (< 12-24 hrs) here and are not bottlenecked by a central reviewer, and data quality is either at 100%, or the data contains 100% reliable social proof data that users can understand.

## Install
To get started, clone this repo:
```
git clone git@github.com:colorfulnotion/xcm-global-registry.git && cd xcm-global-registry
```
And install all dependencies, [python3](https://www.python.org/downloads/) may be required:
```
npm install
```
## Quick Start

### Generate Global XCM Asset Regsitry:
```
# To execute cmd, run: node xcmgarcli [relaychain] [all]

# generate polkadot xcGar
node xcmgarcli polkadot

# generate kusama xcGar
node xcmgarcli kusama
```

### Generate Single parachain (xc)Asset registry:
```
# To execute cmd, run: node xcmgarcli [relaychain] [targetParaID]

# generate acala's (xc)Asset registry:
node xcmgarcli polkadot 2000

# generate moonriver's (xc)Asset registry:
node xcmgarcli kusama 2023
```

## Repo Structure
This repo has been organized as following:
```
xcm-global-registry~$tree

├── LICENSE
├── README.md
├── assets
│   ├── kusama
│   │   ├── kusama_paraID_assets.json
│   │   └── ...
│   └── polkadot
│       ├── polkadot_0_assets.json
│       └── ...
├── chains
│   ├── common_chainparser.js
│   ├── custom_parser_template.js
│   └── custom_chainparser ...
├── endpoints.js
├── node_modules
│   ├── packages...
├── package-lock.json
├── package.json
├── publicEndpoints
│   ├── kusama_publicEndpoints.json
│   └── polkadot_publicEndpoints.json
├── test.txt
├── updateEndpoints
├── xcmgar
│   ├── kusama_xcmgar.json
│   └── polkadot_xcmgar.json
├── xcmgar.js
├── xcmgarcli.js
└── xcmgarTool.js
```

### [Main Directory](https://github.com/colorfulnotion/xcm-global-registry/tree/main/)
* [xcmgarcli](https://github.com/colorfulnotion/xcm-global-registry/blob/main/xcmgarcli): command line tool for xc gar registry generation.
* [updateEndpoints](https://github.com/colorfulnotion/xcm-global-registry/blob/main/updateEndpoints): command line tool for public endpoint generation.
* [xcmgarTool](https://github.com/colorfulnotion/xcm-global-registry/blob/main/garTool.js): Stand-alone library forked from [polkaholic](https://github.com/colorfulnotion/polkaholic) to supports various data transformation
* [xcmgar](https://github.com/colorfulnotion/xcm-global-registry/blob/main/xcmgar.js): main driver for on-chain crawling + local read/write tasks


### [Chains directory](https://github.com/colorfulnotion/xcm-global-registry/tree/main/chains)
* [common_chainparser](https://github.com/colorfulnotion/xcm-global-registry/blob/main/chains/common_chainparser.js) - Implements common registry parsing logics sahred among different parachains.
* [custom_parser_template](https://github.com/colorfulnotion/xcm-global-registry/blob/main/chains/custom_parser_template.js) - Fork this template to create new custom parser for a project. Usually parachain teams deployed identical pallets on both production and canary networks, therefore the same custom parser can be used for both Polkadot and Kusama parachain. The custom parser must implement {`fetchGar`, `fetchXcGar`}. Optional augmentation {`automatic on-chain inferring`, `manualRegistry`} can be included to include chain-specific xcGar coverage, but it's not strictly required.

If custom parser is not specified, the parachain will be parsed using generic parser; (xc)Assets will likely be missing if parachain does not have use commonly recognizable `pallet:storage` selection for thier registry. More: see detailed tutorial of [how to implement a custom parser](todo..) here

### [Assets directory](https://github.com/colorfulnotion/xcm-global-registry/tree/main/assets)  
* `relaychain_paraID_assets.json`: In this directory, you can find each parachain's (xc)Assets covered by the chainParser, which is then used to power [XCM Global Asset Registry](https://github.com/colorfulnotion/xcm-global-registry/tree/main/xcmgar)  - aggregated at relaychain level.

Ideally, Parachain-specific Assest Regsitry will enable teams/contributors examine any given parachain and quickly identify missing asset.

### [XCMGAR directory](https://github.com/colorfulnotion/xcm-global-registry/tree/main/xcmgar)  
* `relaychain_xcmConcept.json`: In this directory, you can find global xcm asset registry aggregated at relaychain level. Currently only support polkadot/kusama but can be easily extended to include westend and rococo.  

### [PublicEndpoints directory](https://github.com/colorfulnotion/xcm-global-registry/tree/main/assets)
* `relaychain_publicEndpoints.json`: A list public parachain endpointss generated by [updateEndpoints](https://github.com/colorfulnotion/xcm-global-registry/blob/main/updateEndpoints) - organized at relaychain level

## Design Choice

*Disclaimer: as initial implementer, I've made some arbitrary decisions just to get the system working. I welcome all feedbacks & criticism to make this project maximally usable. Thank you - mkchungs*

| Glossary   |      Defined As      |  Example |  Rationale/Use case |
|----------|:-------------|:-------------|:------|
| chainkey |  `relaychain-paraID` | polkadot-1000 |chainkey is used to identify a parachain within relaychain and potentially across different relaychains in the future |
| fullchainkey |  <code>relaychain-paraID&#124;projectID</code> | polkadot-1000&#124;statemint | fullchainkey is used as filter within common parser. The projectID portion makes the codeblock more readable for human (other developers)|
| xcmInteriorkey |  `'[{“network”:"relaychain"},{parachain:"paraID"}, {palletInstance/generalKey/generalIndex: 'val'}, ...]'` | '[{"network":"polkadot"},{"parachain":1000},{"palletInstance":50},{"generalIndex":1984}]' | xcmInteriorkey is used to identify a xcAsset within relaychain and potentially across different relaychains in the future. Specifically, (1) The network {polkadot, kusama, named:byte} has been added to the front to support global registry.  (2) X1/X2/.../X7 has been convered to flat array for easier serialization. |
| garLocation |  `garPallet:garStorage` | assets:metadata | garLocation is where a parachain's asset registry is located on-chain `api.query[garPallet][garStorage]`.  |
| xcGarLocation |  `xcGarPallet:xcGarStorage` | assetManager:assetIdType | xcGarLocation is where a parachain's xcm registry is located on-chain `api.query[xcGarPallet][xcGarStorage]`. |
| fetchGar |  `SampleParser.fetchGar()` | AcalaParser.fetchGar() | step 1 of registry crawling - Parsing parachain’s asset Registry using result from `garLocation`. Parsing logic is independent of querying data on-chain and can be categorized into certain common garParser in common_parser. |
| fetchXcGar |  `SampleParser.fetchXcGar()` | AcalaParser.fetchXcGar() | step 2 of registry crawling - Parsing parachain’s xc Registry using result from `xcGarLocation`. Can be categorized into certain common xcgarParser in common_parser. |
| fetchAugments |  `SampleParser.fetchAugments()` | AcalaParser.fetchAugments() | step 3 of registry crawling - since on-chain registry are not perfact, Augmentation step allows us to improve registry coverage by auto-inferring xcmInteriorkey via certain extrinsics or by manually including some known asset<->xcmInteriorkey mapping |


## Contributors:

**To indicate your interest, please submit a PR:**
1. Adding your name/email and any ideas you have on this project
2. if you wish to contribute significantly more than 25 hours/quarter (or significantly less)
3. if you do or do not wish to be paid, mark "non-paid volunteer".  All paid volunteers will be compensated at 100 USDT.

* Michael Chung <michael@colorfulnotion.com> - Initial Primary Architect and Implementer
* Sourabh Niyogi <sourabh@colorfulnotion.com> - Initial Secondary Implementer/Coordinator
