## Current Project Status

(keep it here for now. remove later)

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