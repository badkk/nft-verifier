import React,{ useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout, Image, Statistic } from 'antd';
import GoogleMapReact from 'google-map-react';
import * as styles from './nftverifier.module.css';
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { typesBundleForPolkadot } = require('@crustio/type-definitions');
const { Header, Content, Footer } = Layout;

/**
 * Parse object into JSON object
 * @param {Object} o any object
 */
function parseObj(o) {
    return JSON.parse(JSON.stringify(o));
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function NFTVerifier() {
    const [crustReps, setCrustReps] = useState(0); 
    const cid = useQuery().get('cid');

    useEffect(() => { 
        async function getCrustReps() {
            try {
                // 1. Try connect to Crust Network
                const chain = new ApiPromise({
                    provider: new WsProvider('wss://rpc.crust.network'),
                    typesBundle: typesBundleForPolkadot
                });
                await chain.isReadyOrError;
    
                // 2. Query on-chain file data
                const maybeFileInfo = parseObj(await chain.query.market.files(cid));
                if (maybeFileInfo) {
                    const replicaCount = maybeFileInfo.reported_replica_count;
                    if (replicaCount === 0) {
                        console.log(`⚠️  ${cid} is pending...`);
                    } else {
                        console.log(`✅  ${cid} is picked, replicas: ${replicaCount}`);
                    }
                    setCrustReps(replicaCount);
                } else {
                    console.error(`🗑  ${cid} is not existed or already expired`);
                }
    
                // 3. Disconnect with chain
                chain.disconnect();
            } catch (e) {
                console.error(`Query status failed with ${e}`);
            } finally {
                // Add error handling
            }
        };

        getCrustReps();
    });

    const markers = [];
    for (let i = 0; i < crustReps; i ++) {
        markers.push(
            <div 
            lat={Math.random()*180-90} 
            lng={Math.random()*360-180}
            className={styles.marker}
            />
        )
    }
    return (
        cid ?
        <Layout className='layout'>
            <Header className={styles.header}>
                📦 NFT Verifier
            </Header>
            <Content className={styles.content}>
                <div className={styles.map}>
                    <GoogleMapReact
                        defaultCenter={{lat: 60, lng: 30}}
                        defaultZoom={1}
                    >
                    {markers}
                    </GoogleMapReact>
                </div>
                <div className={styles.info}>
                    <Image
                    src={'https://crustipfs.xyz/ipfs/'+cid}
                    className={styles.nft}
                    />
                    <Statistic title='IPFS CID' value={cid}/>
                    <Statistic title='Crust Replicas' value={crustReps === 0 ? 'Loading' : crustReps}/>
                    <Statistic title='Arweave Replicas' value='Comming soon'/>
                    <Statistic title='Filecoin Replicas' value='Comming soon'/>
                </div>
            </Content>
            <Footer className={styles.footer}>
                NFT Verifier ©2021 Created by Crust Network
            </Footer>
        </Layout>
        :
        <>Please provide your NFT metadatas</>
    )
}
 
export default NFTVerifier;