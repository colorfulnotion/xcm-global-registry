# XCM Global Asset Registry (xcGAR)

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
# change to gar dir. To execute cmd, run: node garcmd [relaychain] [all]
cd gar

# generate polkadot xcGar
node garcmd polkadot

# generate kusama xcGar
node garcmd kusama
```

### Generate Single parachain (xc)Asset registry:
```
# To execute cmd, run: node garcmd [relaychain] [targetParaID]

# generate acala's (xc)Asset registry:
node garcmd polkadot 2000

# generate moonriver's (xc)Asset registry:
node garcmd kusama 2023
```

## Repo Structure
This repo has been organized as following:
```
xcm-global-registry~$ npm tree
├── LICENSE
├── README.md
├── gar
│   ├── assets
│   │   ├── kusama
│   │   │   ├── kusama_paraID_assets.json
│   │   │   └── ...
│   │   └── polkadot
│   │       ├── polkadot_paraID_assets.json
│   │       └── ...
│   ├── chains
│   │   ├── acala.js ...
│   │   ├── common_chainparser.js
│   │   ├── custom_parser_template.js
│   │   └── custom_chainparser ...
│   ├── endpoints.js
│   ├── garTool.js
│   ├── garcmd
│   ├── globalassetregistry.js
│   ├── publicEndpoints
│   │   ├── kusama_publicEndpoints.json
│   │   └── polkadot_publicEndpoints.json
│   ├── updateEndpoints
│   └── xcmConcept
│       ├── kusama_xcmConcept.json
│       └── polkadot_xcmConcept.json
├── node_modules
│   ├── packages...
├── package-lock.json
├── package.json
└── test.txt
```

### [Gar directory](https://github.com/colorfulnotion/xcm-global-registry/tree/main/gar/)
* [garcmd](https://github.com/colorfulnotion/xcm-global-registry/blob/main/gar/garcmd): command line tool for gar registry generation.
* [updateEndpoints](https://github.com/colorfulnotion/xcm-global-registry/blob/main/gar/updateEndpoints): command line tool for public endpoint generation.
* [garTool](https://github.com/colorfulnotion/xcm-global-registry/blob/main/gar/garTool.js): Stand-alone library forked from [polkaholic](https://github.com/colorfulnotion/polkaholic) to supports various data transformation
* [globalassetregistry](https://github.com/colorfulnotion/xcm-global-registry/blob/main/gar/globalassetregistry): main driver for on-chain crawling + local read/write tasks


### [Chains directory](https://github.com/colorfulnotion/xcm-global-registry/tree/main/gar/chains)
* [common_chainparser](https://github.com/colorfulnotion/xcm-global-registry/blob/main/gar/chains/common_chainparser.js) - Implements common registry parsing logics sahred among different parachains.
* [custom_parser_template](https://github.com/colorfulnotion/xcm-global-registry/blob/main/gar/chains/custom_parser_template.js) - Fork this template to create new custom parser for a project. Usually parachain teams deployed identical pallets on both production and canary networks, therefore the same custom parser can be used for both Polkadot and Kusama parachain. The custom parser must implement {`fetchGar`, `fetchXcGar`}. Optional augmentation {`automatic on-chain inferring`, `manualRegistry`} can be included to include chain-specific xcGar coverage, but it's not strictly required.

If custom parser is not specified, the parachain will be parsed using generic parser; (xc)Assets will likely be missing if parachain does not have use commonly recognizable `pallet:storage` selection for thier registry. More: see detailed tutorial of [how to implement a custom parser](todo..) here

### [Assets directory](https://github.com/colorfulnotion/xcm-global-registry/tree/main/gar/assets)  
* `relaychain_paraID_assets.json`: In this directory, you can find each parachain's (xc)Assets covered by the chainParser, which is then used to power [XCM Global Asset Registry](https://github.com/colorfulnotion/xcm-global-registry/tree/main/gar/xcmConcept)  - aggregated at relaychain level.

Ideally, Parachain-specific Assest Regsitry will enable teams/contributors examine any given parachain and quickly identify missing asset.

### [xcmConcept directory](https://github.com/colorfulnotion/xcm-global-registry/tree/main/gar/xcmConcept)  
* `relaychain_xcmConcept.json`: In this directory, you can find global xcm asset registry aggregated at relaychain level. Currently only support polkadot/kusama but can be easily extended to include westend and rococo.  

### [PublicEndpoints directory](https://github.com/colorfulnotion/xcm-global-registry/tree/main/gar/assets)
* `relaychain_publicEndpoints.json`: A list public parachain endpointss generated by [updateEndpoints](https://github.com/colorfulnotion/xcm-global-registry/blob/main/gar/updateEndpoints) - organized at relaychain level

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


## Current Project Status

As of this commit, [xcGar](https://github.com/colorfulnotion/xcm-global-registry/tree/main/gar/xcmConcept) is currently compiled with:

```
22 polkadot-parachain supported endpoints.
 9 polkadot-parachain does not have public endpoints/is unreachable.
 6 polkadot-parachain pending for verification

Supported: polkadot endpoints[22] [
  'polkadot-0',    'polkadot-1000',
  'polkadot-2000', 'polkadot-2002',
  'polkadot-2004', 'polkadot-2006',
  'polkadot-2011', 'polkadot-2012',
  'polkadot-2013', 'polkadot-2019',
  'polkadot-2021', 'polkadot-2026',
  'polkadot-2030', 'polkadot-2031',
  'polkadot-2032', 'polkadot-2034',
  'polkadot-2035', 'polkadot-2037',
  'polkadot-2039', 'polkadot-2043',
  'polkadot-2046', 'polkadot-2052'
]
Missing polkadot endpoints[9]
'polkadot-2008',
  'polkadot-2027',
  'polkadot-2040',
  'polkadot-2053',
  'polkadot-2055',
  'polkadot-2056',
  'polkadot-2058',
  'polkadot-2090',
  'polkadot-2092'
]
Unverified polkadot endpoints[6] [
  'polkadot-1001',
  'polkadot-2007',
  'polkadot-2048',
  'polkadot-2051',
  'polkadot-2086',
  'polkadot-2091'
]
```

```
32 kusama-parachain supported endpoints.
9  kusama-parachain does not have public endpoints/is unreachable.
6  kusama-parachain pending for verification

Supported: kusama endpoints[32] [
  'kusama-0',    'kusama-1000', 'kusama-2000',
  'kusama-2001', 'kusama-2004', 'kusama-2007',
  'kusama-2011', 'kusama-2012', 'kusama-2015',
  'kusama-2023', 'kusama-2048', 'kusama-2084',
  'kusama-2085', 'kusama-2087', 'kusama-2088',
  'kusama-2090', 'kusama-2092', 'kusama-2095',
  'kusama-2096', 'kusama-2100', 'kusama-2101',
  'kusama-2102', 'kusama-2105', 'kusama-2106',
  'kusama-2110', 'kusama-2113', 'kusama-2114',
  'kusama-2115', 'kusama-2118', 'kusama-2119',
  'kusama-2121', 'kusama-2222'
]
Missing kusama endpoints[6] [
  'kusama-2024',
  'kusama-2223',
  'kusama-2224',
  'kusama-2229',
  'kusama-2233',
  'kusama-2245'
]
Unverified kusama endpoints[8] [
  'kusama-1001',
  'kusama-2107',
  'kusama-2116',
  'kusama-2123',
  'kusama-2124',
  'kusama-2125',
  'kusama-2129',
  'kusama-2236'
]
```

xcGAR Currently covers 30 [xcAssets](https://github.com/colorfulnotion/xcm-global-registry/tree/main/gar/xcmConcept/polkadot_xcmConcept.json) on Polkadot:

| xcmInteriorKey                                                                                            | Symbol     | paraID | decimals |
|-----------------------------------------------------------------------------------------------------------|------------|--------|----------|
| [{"network":"polkadot"},"here"]                                                                           | DOT        |      0 |       10 |
| [{"network":"polkadot"},{"parachain":1000},{"palletInstance":50},{"generalIndex":1984}]                   | USDT       |   1000 |        6 |
| [{"network":"polkadot"},{"parachain":2000},{"generalKey":"0x0000"}]                                       | ACA        |   2000 |       12 |
| [{"network":"polkadot"},{"parachain":2000},{"generalKey":"0x02f4c723e61709d90f89939c1852f516e373d418a8"}] | APE        |   2000 |       18 |
| [{"network":"polkadot"},{"parachain":2000},{"generalKey":"0x0001"}]                                       | aUSD       |   2000 |       12 |
| [{"network":"polkadot"},{"parachain":2000},{"generalKey":"0x0254a37a01cd75b616d63e0ab665bffdb0143c52ae"}] | DAI        |   2000 |       18 |
| [{"network":"polkadot"},{"parachain":2000},{"generalKey":"0x040d000000"}]                                 | lcDOT      |   2000 |       10 |
| [{"network":"polkadot"},{"parachain":2000},{"generalKey":"0x0003"}]                                       | LDOT       |   2000 |       10 |
| [{"network":"polkadot"},{"parachain":2000},{"generalKey":"0x0207df96d1341a7d16ba1ad431e2c847d978bc2bce"}] | USDC       |   2000 |        6 |
| [{"network":"polkadot"},{"parachain":2000},{"generalKey":"0x02c80084af223c8b598536178d9361dc55bfda6818"}] | WBTC       |   2000 |        8 |
| [{"network":"polkadot"},{"parachain":2000},{"generalKey":"0x025a4d6acdc4e3e5ab15717f407afe957f7a242578"}] | WETH       |   2000 |       18 |
| [{"network":"polkadot"},{"parachain":2002}]                                                               | CLV        |   2002 |       18 |
| [{"network":"polkadot"},{"parachain":2004},{"palletInstance":10}]                                         | GLMR       |   2004 |       18 |
| [{"network":"polkadot"},{"parachain":2006}]                                                               | ASTR       |   2006 |       18 |
| [{"network":"polkadot"},{"parachain":2011}]                                                               | EQ         |   2011 |        9 |
| [{"network":"polkadot"},{"parachain":2011},{"generalKey":"0x657164"}]                                     | EQD        |   2011 |        9 |
| [{"network":"polkadot"},{"parachain":2012},{"palletInstance":6},{"generalIndex":200100017}]               | cDOT-10/17 |   2012 |       10 |
| [{"network":"polkadot"},{"parachain":2012},{"palletInstance":6},{"generalIndex":200060013}]               | cDOT-6/13  |   2012 |       10 |
| [{"network":"polkadot"},{"parachain":2012},{"palletInstance":6},{"generalIndex":200070014}]               | cDOT-7/14  |   2012 |       10 |
| [{"network":"polkadot"},{"parachain":2012},{"palletInstance":6},{"generalIndex":200080015}]               | cDOT-8/15  |   2012 |       10 |
| [{"network":"polkadot"},{"parachain":2012},{"palletInstance":6},{"generalIndex":200090016}]               | cDOT-9/16  |   2012 |       10 |
| [{"network":"polkadot"},{"parachain":2012},{"generalKey":"0x50415241"}]                                   | PARA       |   2012 |       12 |
| [{"network":"polkadot"},{"parachain":2012},{"generalKey":"0x73444f54"}]                                   | sDOT       |   2012 |       10 |
| [{"network":"polkadot"},{"parachain":2030},{"generalKey":"0x0104"}]                                       | BNC        |   2030 |       12 |
| [{"network":"polkadot"},{"parachain":2030},{"generalKey":"0x0900"}]                                       | vDOT       |   2030 |       10 |
| [{"network":"polkadot"},{"parachain":2030},{"generalKey":"0x0403"}]                                       | vsDOT      |   2030 |       10 |
| [{"network":"polkadot"},{"parachain":2032},{"generalKey":"0x0001"}]                                       | IBTC       |   2032 |        8 |
| [{"network":"polkadot"},{"parachain":2032},{"generalKey":"0x0002"}]                                       | INTR       |   2032 |       10 |
| [{"network":"polkadot"},{"parachain":2035}]                                                               | PHA        |   2035 |       12 |
| [{"network":"polkadot"},{"parachain":2046},{"palletInstance":5}]                                          | RING       |   2046 |       18 |

And 44 [xcAssets](https://github.com/colorfulnotion/xcm-global-registry/tree/main/gar/xcmConcept/kusama_xcmConcept.json) on Kusama:

| xcmInteriorKey                                                                                          | symbol  | paraID | decimals |
|---------------------------------------------------------------------------------------------------------|---------|--------|----------|
| [{"network":"kusama"},"here"]                                                                           | KSM     |      0 |       12 |
| [{"network":"kusama"},{"parachain":1000},{"palletInstance":50},{"generalIndex":16}]                     | ARIS    |   1000 |        8 |
| [{"network":"kusama"},{"parachain":1000},{"palletInstance":50},{"generalIndex":8}]                      | RMRK    |   1000 |       10 |
| [{"network":"kusama"},{"parachain":1000},{"palletInstance":50},{"generalIndex":1984}]                   | USDT    |   1000 |        6 |
| [{"network":"kusama"},{"parachain":2000},{"generalKey":"0x024bb6afb5fa2b07a5d1c499e1c3ddb5a15e709a70"}] | DAI     |   2000 |       18 |
| [{"network":"kusama"},{"parachain":2000},{"generalKey":"0x0080"}]                                       | KAR     |   2000 |       12 |
| [{"network":"kusama"},{"parachain":2000},{"generalKey":"0x0081"}]                                       | KUSD    |   2000 |       12 |
| [{"network":"kusama"},{"parachain":2000},{"generalKey":"0x0083"}]                                       | LKSM    |   2000 |       12 |
| [{"network":"kusama"},{"parachain":2000},{"generalKey":"0x021f3a10587a20114ea25ba1b388ee2dd4a337ce27"}] | USDCet  |   2000 |        6 |
| [{"network":"kusama"},{"parachain":2000},{"generalKey":"0x0266291c7d88d2ed9a708147bae4e0814a76705e2f"}] | wBTC    |   2000 |        8 |
| [{"network":"kusama"},{"parachain":2000},{"generalKey":"0x02ece0cc38021e734bef1d5da071b027ac2f71181f"}] | wETH    |   2000 |       18 |
| [{"network":"kusama"},{"parachain":2000},{"generalKey":"0x0254e183e533fd3c6e72debb2d1cab451d017faf72"}] | wUSDT   |   2000 |        6 |
| [{"network":"kusama"},{"parachain":2001},{"generalKey":"0x0001"}]                                       | BNC     |   2001 |       12 |
| [{"network":"kusama"},{"parachain":2001},{"generalKey":"0x0104"}]                                       | vKSM    |   2001 |       12 |
| [{"network":"kusama"},{"parachain":2001},{"generalKey":"0x0404"}]                                       | VSvsKSM |   2001 |       12 |
| [{"network":"kusama"},{"parachain":2001},{"generalKey":"0x0207"}]                                       | ZLK     |   2001 |       18 |
| [{"network":"kusama"},{"parachain":2004}]                                                               | PHA     |   2004 |       12 |
| [{"network":"kusama"},{"parachain":2007}]                                                               | SDN     |   2007 |       18 |
| [{"network":"kusama"},{"parachain":2012}]                                                               | CSM     |   2012 |       12 |
| [{"network":"kusama"},{"parachain":2015},{"generalKey":"0x54454552"}]                                   | TEER    |   2015 |       12 |
| [{"network":"kusama"},{"parachain":2016}]                                                               | SKU     |   2016 |       18 |
| [{"network":"kusama"},{"parachain":2023},{"palletInstance":10}]                                         | MOVR    |   2023 |       18 |
| [{"network":"kusama"},{"parachain":2024},{"generalKey":"0x657164"}]                                     | EQD     |   2024 |        9 |
| [{"network":"kusama"},{"parachain":2024}]                                                               | GENS    |   2024 |        9 |
| [{"network":"kusama"},{"parachain":2048}]                                                               | XRT     |   2048 |        9 |
| [{"network":"kusama"},{"parachain":2084}]                                                               | KMA     |   2084 |       12 |
| [{"network":"kusama"},{"parachain":2085},{"generalKey":"0x484b4f"}]                                     | HKO     |   2085 |       12 |
| [{"network":"kusama"},{"parachain":2085},{"generalKey":"0x734b534d"}]                                   | sKSM    |   2085 |       12 |
| [{"network":"kusama"},{"parachain":2088},{"generalKey":"0x0001"}]                                       | AIR     |   2088 |       18 |
| [{"network":"kusama"},{"parachain":2090},{"generalKey":"0x00000000"}]                                   | BSX     |   2090 |       12 |
| [{"network":"kusama"},{"parachain":2092},{"generalKey":"0x000b"}]                                       | KBTC    |   2092 |        8 |
| [{"network":"kusama"},{"parachain":2092},{"generalKey":"0x000c"}]                                       | KINT    |   2092 |       12 |
| [{"network":"kusama"},{"parachain":2095}]                                                               | QTZ     |   2095 |       18 |
| [{"network":"kusama"},{"parachain":2096},{"generalKey":"0x020000000000000000"}]                         | BIT     |   2096 |       18 |
| [{"network":"kusama"},{"parachain":2096},{"generalKey":"0x000000000000000000"}]                         | NEER    |   2096 |       18 |
| [{"network":"kusama"},{"parachain":2102},{"generalKey":"0x50434855"}]                                   | PCHU    |   2102 |       18 |
| [{"network":"kusama"},{"parachain":2105},{"palletInstance":5}]                                          | CRAB    |   2105 |       18 |
| [{"network":"kusama"},{"parachain":2106},{"palletInstance":10}]                                         | LIT     |   2106 |       12 |
| [{"network":"kusama"},{"parachain":2107},{"generalKey":"0x4b49434f"}]                                   | KICO    |   2107 |       14 |
| [{"network":"kusama"},{"parachain":2110},{"generalKey":"0x00000000"}]                                   | MGX     |   2110 |       18 |
| [{"network":"kusama"},{"parachain":2114}]                                                               | TUR     |   2114 |       10 |
| [{"network":"kusama"},{"parachain":2118},{"generalKey":"0x4c54"}]                                       | LT      |   2118 |       12 |
| [{"network":"kusama"},{"parachain":2121},{"generalKey":"0x0096"}]                                       | IMBU    |   2121 |       12 |
| [{"network":"kusama"},{"parachain":2125},{"generalIndex":0}]                                            | TNKR    |   2125 |       12 |

## 2023 Roadmap / Open Bounty Program

A partial list of what we can hope to achieve using GAR in 2023:
* Rapidly adapt to XCMv3/... changes
* Augment standardized/custom "weight/fee" information
* Support MultiLocation users, e.g. DEXes, bridge monitors, APIs, Cross-Chain Indexers
* Augment each asset in the result with a “pageRank” type reflecting degree of support by parachains, such that dapp developers can threshold on this attribute, where more parachains supporting an asset will apply
* [something else you and your team think is important]

## Funding / Call for Contributors

We (a collective of people working on this project) seek $125K/quarterly budget in 2023 to support:
* 20% Colorful Notion (Q1/Q2 2023)
* 50% 10-12 parachain developers + on a quarterly basis [below]
* 10% Some other team (Q3 2023) [elected by 10-12, with primary implementer as tie-breaker]
* 10% Some other team (Q4 2023) [elected by 10-12, with primary implementer as tie-breaker]
* 10% Open bounty request [proposed by 10-12]

We seek 10-12 parachain developers + additional developers request to maintain this very simple but extensible XCM Global Asset registry.  Ideally:
* You should be involved in your parachains (xc)asset registry, have debugged XCM transfers with at least 2+ other parachains, and can speak to how you can represent your fees in 2023 if you’re going non-standard in some way.
* You are comfortable signing up for debugging a pretty simple Javascript dataflow processing problem for your own parachain a couple of times in 2023.  
* You will contribute up to 100 hours/yr from each parachain to support this effort, specifically how things may change with:
    * XCMv3 changes – GlobalConsensus
    * ERC20/721/1155 + PSP22/34/37
    * Kusama/Polkadot bridges
    * Snowfork Ethereum bridge
    * Remote execution “Transact” support
    * [something else you and your team think is important]

Contributors will be invited to a “Polkadot XCM Global Asset Registry” Telegram group.
Contributors will be held to the [Polkadot communities' Code of Conduct](https://github.com/paritytech/polkadot/blob/master/CODE_OF_CONDUCT.md).

## Funding

Funding may be from Treasury (of Polkadot/Kusama or parachains, Web3F, or other sponsors).    

## Contributors:

**To indicate your interest, please submit a PR:**
1. Adding your name/email and any ideas you have on this project
2. if you wish to contribute significantly more than 25 hours/quarter (or significantly less)
3. if you do or do not wish to be paid, mark "non-paid volunteer".  All paid volunteers will be compensated at 100 USDT.

* Michael Chung <michael@colorfulnotion.com> - Initial Primary Architect and Implementer (paid volunteer in Q1/Q2 2023)
* Sourabh Niyogi <sourabh@colorfulnotion.com> - Initial Secondary Implementer/Coordinator (paid volunteer in Q1/Q2 2023)
