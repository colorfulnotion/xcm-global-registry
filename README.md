# XCM Global Asset Registry (GAR)

## Asset Registry
Substrate asset registry pallet {e.g `assets`, `tokens`, `currencies` pallet} are maximally flexible and are not designed with cross-chain functionality in mind - it does not require all parachains to use the same “local” ids (or symbols) to represent a cross-chain asset.

For example, KSM has 10+ different local representation among paracains:

| Chain      | CurrencyID |
| ----------- | ----------- |
| [Khala](https://khala.polkaholic.io/blocks/shiden)      | [0](https://polkaholic.io/asset/22004/0)       |
| [Shiden](https://shiden.polkaholic.io/blocks/shiden)   | [340282366920938463463374607431768211455](https://polkaholic.io/asset/22007/340282366920938463463374607431768211455)        |
| [Moonriver](https://moonriver.polkaholic.io/blocks/shiden)   | [42259045809535163221576417993425387648](https://polkaholic.io/asset/22023/42259045809535163221576417993425387648)        |
| [Robonomics](https://robonomics.polkaholic.io/blocks/shiden)   | [4294967295](https://polkaholic.io/asset/22048/4294967295)        |
| [Calamari](https://calamari.polkaholic.io/blocks/shiden)      | [12](https://polkaholic.io/asset/22084/12)       |
| [Parallel Heiko](https://parallel-heiko.polkaholic.io/blocks/shiden)      | [100](https://polkaholic.io/asset/22085/100)       |
| [Basilisk](https://basilisk.polkaholic.io/blocks/shiden)   | [1](https://polkaholic.io/asset/22090/1)        |
| [Kiko](https://polkaholic.io/blocks/shiden)   | [100](https://polkaholic.io/asset/22107/100)        |
| [Mangata](https://mangata.polkaholic.io/blocks/shiden)      | [4](https://polkaholic.io/asset/22110/4)       |
| [Listen](https://listen.polkaholic.io/blocks/shiden)   | [2](https://polkaholic.io/asset/22118/2)        |

Even if all parachains agree to use the same local symbol, the asset registry alone is not sufficient enough to link the xc asset together.  
Taking Statemine's USDT for example. same local symbolscan be added (and actually have been added) by anyone to its asset registry to potentially fool the unsuspected community:
| Symbol      | Name | CurrencyID |
| ----------- | -----| ----------|
USDt | Tether USDT | 1984 |
USDt | Tether USDT | 19840 |
USDT | USDT | 11 |

## XCM Multilocation
So how does polkadot unify the same asset across different parachains? Answer : [multilocation](https://wiki.polkadot.network/docs/learn-xcm). Yet, multilocation are also designed to be maximally flexible - In xcmV2, cross-chain assets can be specified in a combination of {`Parachain`, `PalletInstance`, `GeneralIndex`, `GeneralKey`}, coupled with `x0`/`x1`/`x2`/.../`x7` struct. And each parachins has a different pallet for xcm asset registry.

## Lack of Global Asset Registry (GAR)
Thus parachain engineers, dapp developers and analytics providers are currently faced with a “Tower of Babel” to align asset registry and XCM asset registry and associated weights/fees - multichain dapp developers (including Polkaholic.io) are required to independently develop this mapping just to performe seemly simple task like transferring “KSM” from one chain to another.  

In our opinion, it’s counter-productive to require multichain app developers to read obscured fee constants in N parachains to support their multi-chain dapps and be faced with such friction.  

In our work in Polkaholic.io XCM Indexing, we have developed a useful API that attempts to address the Tower of Babel:
* [snapshot here for all Polkadot Xcm Assets](https://api.polkaholic.io/xcm/multilocation/polkadot)
*  [snapshot here for all Kusama Xcm Assets](https://api.polkaholic.io/xcm/multilocation/kusama)

Based on our own data, we believe it already covers as much as 90% of the cross-chain transferable assets and over 97% of the XCM Transfer activities in Polkadot + Kusama at present. However, we believe that the recipe for this dataset construction should be managed not by one “trusted” team but with:

## GAR Initiatives
* (A) _Open Source Data Generation_ (automated Github Action) - Given Input: Polkadot + Kusama WSEndpoints from polkadot.js apps, augmented with a polkadot.toml file containing details of how to process the (xc)asset registry of each parachain
    * Step 1: Crawl assetRegistry + xcAssetRegistry and store it in JSON file
    * Step 2: Aggregate and publish registry keyed by XcmInteriorKey

* (b) Joint Collaboration -
    * Having *Open Source Data Generation* managed by parachain teams who solve problems with their own (xcm) asset registry and their parachain partners.

The data generation process is technically simple, but we cant stress enough the importance of joint collaboration - currently many parachain chains are largely building their own 'xcm-tools' independently of one another and only trying to cover a subset of the xcm registry problem.

Together, we can do much betterm, and quicker. Here the expectation is to collaborate for the common good/maximal impacts:
* When parachains or dapp developers see errors in step 1/2, they submit PRs because their community depends on the output  
* Parachain reviewers from the affected teams will approve the PR
* Updates to the repo’s output dataset.
* Data pipelining

We can only succeed if parachain’s possess high reactivity (< 12-24 hrs) here and are not bottlenecked by a central reviewer.

It may be desired to:
* Augment each asset in the result with a “pageRank” type reflecting degree of support by parachains, such that dapp developers can threshold on this attribute, where more parachains supporting an asset will apply
* Augment standardized/custom "weight/fee" information
* Augment with bridge monitoring
* Rapidly adapt to XCMv3 changes - when universal location is introduced

## Call for Contributors

We seek $125K/quarterly budget in 2023 to support:
* 20% Colorful Notion (Q1/Q2)
* 10% Some other team (Q3) [elected by 10-12, with primary implementer]
* 10% Some other team (Q4) [elected by 10-12]
* 10% Open bounty request(e.g. non-fungible assets)  [proposed by 10-12 ]
* 50% Support 10-12 parachain developers + on a quarterly basis [below]

We seek 10-12 parachain developers + on-going bounty request to maintain this very simple but extensible registry.  Ideally:
* You should be involved in your parachains (xc)asset registry, have debugged XCM transfers with at least 2+ other parachains, and can speak to how you can represent your fees in 2023 if you’re going non-standard in some way.
* You are comfortable signing up for debugging a pretty simple Javascript dataflow processing problem for your own parachain a couple of times in 2023.  
* You will contribute up to 100 hours/yr from each parachain to support this effort, specifically how things may change with:
    * XCMv3 changes – GlobalConsensus
    * ERC20/721/1155 + PSP22/34/37
    * Kusama/Polkadot bridges
    * Snowfork Ethereum bridge
    * Remote execution “Transact” support
    * [something else you and your team think is important]

Contributors will be invited to a “Polkadot XCM Global Asset Registry” telegram group.
Contributors will be held to communities' [Code of Conduct](https://github.com/paritytech/polkadot/blob/master/CODE_OF_CONDUCT.md).

## Contributors:
* Michael Chung <michael@colorfulnotion.com> - Initial Primary Architect and Implementer
* Sourabh Niyogi <sourabh@colorfulnotion.com> - Initial Secondary Architect and Implementer
* [You, the parachain developers]
