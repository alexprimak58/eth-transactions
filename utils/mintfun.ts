import axios from 'axios';

export async function submitTx(address: string, hash: string, chainId = 1) {
  axios
    .post('https://mint.fun/api/mintfun/submit-tx', {
      address: address,
      chainId: chainId,
      hash: hash,
      isAllowlist: false,
      source: 'projectPage',
    })
    .then(function (response) {})
    .catch(function (error) {
      console.log(error);
    });
}
