export const bridgeModules = new Set([
  'base_bridge',
  'linea_bridge',
  'scroll_bridge',
  'zora_bridge',
  'zksync_bridge',
  'relay_bridge_from_eth',
  'relay_bridge_to_eth',
]);

export const depositModules = new Set([
  'blast_deposit',
  'blur_deposit',
  'etherfi_deposit',
  'swell_deposit',
  'wrap_eth',
  'zksync_lite_deposit',
]);

export const mintModules = new Set(['mint_zerion_dna', 'mint_scaling_lens']);
