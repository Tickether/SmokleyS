import styles from '@/styles/Memberships.module.css'
import { NextPage } from 'next'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useEffect, useState } from 'react'
import { Network, Alchemy } from 'alchemy-sdk';
import { formatEther } from 'viem'
import { Product } from '@/models/models'
import Products from '.'


const Memberships : NextPage = () => {

    const {address, isConnected} = useAccount()

    const [ownedMembership, setOwnedMembership] = useState<any[]>([])
    const [memberToken, setMemberToken] = useState<number>(0)
    const [connected, setConnected] = useState<boolean>(false)

    const [subsMonth, setSubsMonth] = useState<number>(1)
    const [MaxMonthlySubs, setMaxMonthlySubs] = useState<number>(0)

    const [userOf, setUserOf] = useState<string>('0x0000000000000000000000000000000000000000')
    const [userExpires, setUserExpires] = useState<number>(0)
    const [UserExpiresDate, setUserExpiresDate] = useState<string>('')
    
    const [etherPrice, setEtherPrice] = useState<string>('')
    const [latestPrice, setLatestPrice] = useState<bigint>(BigInt(0))

    const [membership, setMembership] = useState<boolean>(false);


    console.log(ownedMembership)
    
    useEffect(() => {
        if (isConnected && typeof isConnected === 'boolean') {
            setConnected((true))
        } if (!isConnected && typeof isConnected === 'boolean') {
            setConnected((false))
        }
    },[isConnected])

    useEffect(() => {
        if ( ownedMembership.length === 1 ) {
            const memberKey : Product = ownedMembership[0]
            setMemberToken((memberKey.tokenId))
        }
    },[ownedMembership])
    
    

    useEffect(() => {
        const fetchData = async () => {
        const settings = {
            apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
            network: Network.ETH_SEPOLIA,
        };

        const alchemy = new Alchemy(settings);

        try {
            const nfts = await alchemy.nft.getNftsForOwner(address!, { contractAddresses: ['0x7C2A9525818B0c1589885de370323B1B385224D1'] });
            console.log(nfts.ownedNfts[0])
            setOwnedMembership(nfts.ownedNfts);
        } catch (error) {
            console.error('Failed to fetch owned NFTs:', error);
        }
        };

        fetchData();
    }, [address, membership]);

    const contractReadMembership = useContractRead({
        address: "0x7C2A9525818B0c1589885de370323B1B385224D1",
        abi: [
            {
                name: 'membership',
                inputs: [{ internalType: "address", name: "", type: "address" }],
                outputs: [{ internalType: "bool", name: "", type: "bool" }],
                stateMutability: 'view',
                type: 'function',
            },    
        ],
        functionName: 'membership',
        args: [(address!)],
        chainId: 11155111,
        watch: true,
    })
    useEffect(() => {
        if (contractReadMembership?.data! && typeof contractReadMembership.data === 'boolean' ) {
            setMembership((contractReadMembership?.data!))
            //console.log((contractReadMembership?.data!))
        }
    },[contractReadMembership?.data!])

    const contractReadFee = useContractRead({
        address: "0x7C2A9525818B0c1589885de370323B1B385224D1",
        abi: [
            {
              name: 'getLatestPrice',
              inputs: [],
              outputs: [{ internalType: "int256", name: "", type: "int256" }],
              stateMutability: 'view',
              type: 'function',
            },    
        ],
        functionName: 'getLatestPrice',
        chainId: 11155111,
        watch: true,
    })
    useEffect(() => {
        if (contractReadFee?.data! && typeof contractReadFee.data === 'bigint') {
            setEtherPrice(formatEther(contractReadFee?.data!))
            setLatestPrice(contractReadFee?.data!)
        }
    },[contractReadFee?.data!])
    
    console.log(etherPrice)
    console.log(latestPrice)

    const contractReadMaxSubs = useContractRead({
        address: "0x7C2A9525818B0c1589885de370323B1B385224D1",
        abi: [
            {
                name: 'maxMonthlySubs',
                inputs: [],
                outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                stateMutability: 'view',
                type: 'function',
            },    
        ],
        functionName: 'maxMonthlySubs',
        chainId: 11155111,
        watch: true,
    })
    useEffect(() => {
        if (contractReadMaxSubs?.data! && typeof contractReadMaxSubs.data === 'bigint') {
            setMaxMonthlySubs(Number(contractReadMaxSubs?.data!))
        }
    },[contractReadMaxSubs?.data!])

    const contractReadUser = useContractRead({
        address: "0x7C2A9525818B0c1589885de370323B1B385224D1",
        abi: [
            {
                name: 'userOf',
                inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
                outputs: [{ internalType: "address", name: "", type: "address" }],
                stateMutability: 'view',
                type: 'function',
            },    
        ],
        functionName: 'userOf',
        args: [BigInt(memberToken)],
        chainId: 11155111,
        watch: true,
    })
    useEffect(() => {
        if (contractReadUser?.data! && typeof contractReadUser.data === 'string' ) {
            setUserOf((contractReadUser?.data!))
            //console.log(typeof (contractReadUser?.data!))
        }
    },[contractReadUser?.data!])

    const contractReadExpires = useContractRead({
        address: "0x7C2A9525818B0c1589885de370323B1B385224D1",
        abi: [
            {
                name: 'userExpires',
                inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
                outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                stateMutability: 'view',
                type: 'function',
            },    
        ],
        functionName: 'userExpires',
        args: [BigInt(memberToken)],
        chainId: 11155111,
        watch: true,
    })
    useEffect(() => {
        if (contractReadExpires?.data! && typeof contractReadExpires.data === 'bigint') {
            setUserExpires(Number(contractReadExpires?.data!))
        }
    },[contractReadExpires?.data!])

    useEffect(() => {
        if (userExpires !== 0) {
            const getUserExpiresDate = new Date(userExpires * 1000);
            console.log(getUserExpiresDate.toUTCString())
            setUserExpiresDate(getUserExpiresDate.toUTCString())
        }
    },[userExpires])

    const prepareContractWriteMembership = usePrepareContractWrite({
        address: '0x7C2A9525818B0c1589885de370323B1B385224D1',
        abi: [
            {
              name: 'getMembersToken',
              inputs: [],
              outputs: [],
              stateMutability: 'payable',
              type: 'function',
            },
          ],
        functionName: 'getMembersToken',
        value: BigInt(0),
        chainId: 11155111,
    })
    const contractWriteMembership = useContractWrite(prepareContractWriteMembership.config)

    const handleMembership = async () => {
        try {
          await contractWriteMembership.writeAsync?.()
        } catch (err) {
          console.log(err)
        }
    }

    
    const waitForMembership = useWaitForTransaction({
        hash: contractWriteMembership.data?.hash,
        confirmations: 2,
        onSuccess() {
            /*
            addToast(`Your Order is Paid in full! You can ship anytime!!`, { 
                appearance: 'success',
                autoDismiss: true,     // Whether the toast should automatically dismiss
                autoDismissTimeout: 1500, // Timeout in milliseconds before the toast automatically dismisses
    
            });
            */
        },
    })

    const prepareContractWriteSubscription = usePrepareContractWrite({
        address: '0x7C2A9525818B0c1589885de370323B1B385224D1',
        abi: [
            {
              name: 'setUser',
              inputs: [ {internalType: "uint256", name: "tokenId", type: "uint256"}, {internalType: "address", name: "user", type: "address"}, {internalType: "uint64", name: "expires", type: "uint64" } ],
              outputs: [],
              stateMutability: 'payable',
              type: 'function',
            },
          ],
        functionName: 'setUser',
        args: [ (BigInt(memberToken)), (address!), (BigInt(subsMonth)) ],
        value: (BigInt(subsMonth) * latestPrice),
        chainId: 11155111,
    })
    const contractWriteSubscription = useContractWrite(prepareContractWriteSubscription.config)

    const handleSubscription = async () => {
        try {
          await contractWriteSubscription.writeAsync?.()
        } catch (err) {
          console.log(err)
        }
    }

    
    const waitForSubscription = useWaitForTransaction({
        hash: contractWriteSubscription.data?.hash,
        confirmations: 2,
        onSuccess() {
            /*
            addToast(`Your Order is Paid in full! You can ship anytime!!`, { 
                appearance: 'success',
                autoDismiss: true,     // Whether the toast should automatically dismiss
                autoDismissTimeout: 1500, // Timeout in milliseconds before the toast automatically dismisses
    
            });
            */
            //setSubscription(true)
        },
    })

    const handleDecrement = () => {
        if (subsMonth <= 1) return;
        setSubsMonth(subsMonth - 1 );
    };
    
    const handleIncrement = () => {
        if (subsMonth >= MaxMonthlySubs ) return;
        setSubsMonth(subsMonth + 1);
    };
    
    
    return (
        <>
            <Navbar/>
                <div className={styles.container}>
                    <div className={styles.wrapper}>
                        <div className={styles.members}>
                            <div>
                                {
                                    
                                    !connected
                                    ? <p> yhh noo!! connct man!! </p>
                                    :   (  
                                        <div>
                                            {
                                                !membership // use wagmi read here for change
                                                ?   (
                                                    <div>
                                                        <p>Looks like you dont have a membership token. Click the button to get one for free</p>
                                                        <button onClick={handleMembership}>Get Membership</button>
                                                    </div>
                                                )
                                                :   (
                                                    <div> 
                                                        {
                                                            userOf !== address
                                                            ?   (
                                                                <div>
                                                                    <p>Your have a membership token but either you've not yet activated your subscription or it has Expired. Ps: Check below for fee </p>
                                                                    <div>
                                                                        <button
                                                                        onClick={handleDecrement}>-
                                                                        </button>
                                                                        <input 
                                                                        readOnly
                                                                        type='number' 
                                                                        value={subsMonth}/>
                                                                        <button
                                                                        onClick={handleIncrement}>+
                                                                        </button>
                                                                    </div>
                                                                        <p> 
                                                                        <span>{}</span> You're Ready for subscription!
                                                                        </p>
                                                                    <div>
                                                                        <button onClick={handleSubscription}>subscribe in eth <br />{Number(etherPrice) * subsMonth} </button>
                                                                    </div>
                                                                </div>
                                                            )
                                                            :   (
                                                                <div>
                                                                    <p>Congratulations You're Subscribed</p>
                                                                    <p>Your Token expires on {UserExpiresDate}</p>
                                                                </div>
                                                            )

                                                        } 
                                                    </div>
                                                )
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            <Footer/>
        </>
    )
}

export default  Memberships