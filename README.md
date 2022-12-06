# Global Asset Registry (GAR)

Generating Global Asset Registry:
* (1) Spin up git action to crawl assetRegistry + xcAssetRegistry [Note: these are twi different things]. Then store it in JSON file
* (2) Aggregate and publish registry keyed by XcmInteriorKey

Bridge Monitoring:
* (1) Load published GAR record from above
* (2) Monitor Total Issuance by tallying `para:paraID` =>  `0x70617261`  and `sibl:paraID` => `0x7369626c`
