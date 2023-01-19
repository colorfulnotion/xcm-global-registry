# XCM Global Asset Registry

## TL;DR
This XCM Global Asset Registry repo is a data processing algorithm to aggregate multiple on-chain asset registries into one XCM Global Asset Registry.  

* Input: known [RPC endpoints](https://github.com/colorfulnotion/xcm-global-registry/tree/main/assets) from relaychains (Polkadot/Kusama/Rococo/..) and its parachains.

* Output: one [[global registry](https://github.com/colorfulnotion/xcm-global-registry/tree/main/xcmgar)] containing all xcAsset across parachains and [[local (xc)Assets registry](https://github.com/colorfulnotion/xcm-global-registry/tree/main/assets/polkadot)] per each parachain.

As of mid-January 2023, xcgar covers 55+ chains with 30 xcAssets on Polkadot and 44 on Kusama. This is a work in progress and needs contributions from parachain teams to be successful. Data is updated weekly to daily.

Target use cases: multichain dapps, chain analytics in the Substrate ecosystem.

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

### Implement Custom Parser:
Follow the [tutorial](https://github.com/colorfulnotion/xcm-global-registry/blob/main/chains/README.md) to spin up a custom parser under 30min.

## How it works
*TL;DR verison*:
* Given a relaychain, retrieve a list of its parachains (paraIDs) on-chain.
* Use polkadot.js's [public endpoint registry](https://github.com/polkadot-js/apps/blob/master/packages/apps-config/src/endpoints/) to spin up crawlers for every reachable parachains(paraIDs).
* Every crawler will go through a 3-step process to:
  * Step 1 - Fetch its Asset registry on-chain   
  * Step 2 - Fetch its XCM Registry on-chain.
  * Step 3 - [optional] Augment the XCM result from previous step
* Aggregate multiple parachains' XCM Registry into one map keyed by the standardized multilocation

For more details (including design choice), see the doc [here](https://github.com/colorfulnotion/xcm-global-registry/blob/main/DETAILS.md).

## Goal: Filling the lack of XCM Global Asset Registry

Substrate Engineers, dapp developers and analytics providers are currently faced with a "Tower of Babel" to align each parachain's asset registry and XCM asset registry and associated weights/fees. Multichain dapp developers (including multi-chain indexers like [Polkaholic.io](https://polkaholic.io)) are required to independently develop this mapping just to initiate seemly simple XCM tasks like transferring “KSM” or "USDT" from one chain to another or indexing XCM transfers.   In our opinion, it’s counter-productive to require multichain app developers to independently piece this together, and futhermore, read fee constants in N parachains to support their multi-chain dapps and be faced with so much friction.  

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

## Contributors:

**To indicate your interest, please submit a PR:**
1. Adding your name/email and any ideas you have on this project
2. if you wish to contribute significantly more than 25 hours/quarter (or significantly less)
3. if you do or do not wish to be paid, mark "non-paid volunteer".  All paid volunteers will be compensated at 100 USDT.

* Michael Chung <michael@colorfulnotion.com> - Initial Primary Architect and Implementer
* Sourabh Niyogi <sourabh@colorfulnotion.com> - Initial Secondary Implementer/Coordinator
