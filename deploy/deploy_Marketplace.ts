import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit, MichelsonMap } from '@taquito/taquito';
import marketplace from '../contracts/Marketplace.json';
import * as dotenv from 'dotenv'
console.log(__dirname);
dotenv.config(({path:__dirname+'/.env'}))

const rpc: string | undefined = process.env.RPC.toString() || undefined; 
const pk: string | undefined = process.env.PK.toString() || undefined;
console.log("RPC :" + rpc);
console.log("PK : " + pk);
const Tezos = new TezosToolkit(rpc);
const signer = new InMemorySigner(pk);
Tezos.setProvider({ signer: signer })


let counter = 0
let whitelist = [];
let files = new MichelsonMap();
let sales = new MichelsonMap();
let owner = "tz1PRoqjLQezi2sJkA2RTxNddLzajrvmknVW";

// type storage is record [
//     whitelist: set(address);
//     owner: address;
//     counter: token_id;
//     sales: map(token_id, listed_sale);
//     files : map(token_id, map(database_id, string));
// ]

async function orig() {

    const store = {
        'whitelist' : whitelist,
        'files' : files,
        'sales' : sales,
        'counter': counter,
        'owner' : owner
    }

    try {
        const originated = await Tezos.contract.originate({
            code: marketplace,
            storage: store,
        })
        console.log(`Waiting for marketplace contract ${originated.contractAddress} to be confirmed...`);                                          
        await originated.confirmation(2);
        console.log('confirmed nft: ', originated.contractAddress);


    } catch (error: any) {
        console.log(error)
    }
}


orig();