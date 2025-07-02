// import React, { useEffect, useRef, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../app/store';
// import
// {
//     startSimulation,
//     fetchSimulation,
//     resetSimulation,
//     getBitcoinPrices,
//     buyBitcoin,
//     sellBitcoin,
//     advanceSimulation,
//     updateDate,
//     reset,
//     morePredictions
// } from '../../features/simulador/simuladorSlice';
// import { toast } from 'react-hot-toast';
// import { Link, useNavigate } from 'react-router-dom';
// import { Line } from 'react-chartjs-2';
// import
// {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
// } from 'chart.js';

// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend
// );

// const Simulador = () =>
// {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { userInfo } = useSelector( ( state: RootState ) => state.auth );
//     const {
//         simulacion,
//         simulacionIsLoading,
//         simulacionIsError,
//         simulacionIsSuccess,
//         simulacionMessage,
//         preciosBitcoin,
//     } = useSelector( ( state: RootState ) => state.simulador );

//     const [amount, setAmount] = useState<number>( 0 );
//     const [displayedPrices, setDisplayedPrices] = useState<any[]>( [] );
//     const [currentDayIndex, setCurrentDayIndex] = useState<number>( 0 );
//     const [currentPrice, setCurrentPrice] = useState<number | null>( null );
//     const [loadingMoreData, setLoadingMoreData] = useState<boolean>( false );
//     const intervalRef = useRef<NodeJS.Timeout | null>( null );
//     const [dataLoaded, setDataLoaded] = useState<boolean>( true );

//     useEffect( () =>
//     {
//         dispatch( fetchSimulation( { user: userInfo.id } ) );
//     }, [dispatch, userInfo.id] );

//     useEffect( () =>
//     {
//         if ( simulacionIsSuccess && simulacion )
//         {
//             dispatch( getBitcoinPrices( { user: userInfo.id } ) );
//         }
//     }, [dispatch, simulacionIsSuccess, simulacion, userInfo.id] );

//     useEffect( () =>
//     {
//         if ( preciosBitcoin.length > 0 && simulacion )
//         {
//             const simulacionFecha = new Date( simulacion.fecha ).toISOString().split( 'T' )[0];
//             const simulacionIndex = preciosBitcoin.findIndex(
//                 ( price: any ) => price.fecha === simulacionFecha
//             );

//             if ( simulacionIndex !== -1 )
//             {
//                 const initialPrices = preciosBitcoin.slice(
//                     Math.max( 0, simulacionIndex - 30 ),
//                     simulacionIndex + 1
//                 );
//                 setDisplayedPrices( initialPrices );
//                 setCurrentDayIndex( simulacionIndex );
//                 setCurrentPrice( parseFloat( preciosBitcoin[simulacionIndex].precio ) );
//             }
//         }
//     }, [preciosBitcoin, simulacion] );

//     useEffect( () =>
//     {
//         console.log( preciosBitcoin )
//         console.log( simulacion )

//     }, [preciosBitcoin, simulacion] )


//     const handleNoMoreData = async () =>
//     {
//         setLoadingMoreData( true );
//         const lastDate = displayedPrices[displayedPrices.length - 1].fecha;
//         await dispatch( morePredictions( { user: userInfo.id, fecha: lastDate } ) ).unwrap();
//         setLoadingMoreData( false );
//         setDataLoaded( true );
//     };

//     useEffect( () =>
//     {
//         if ( intervalRef.current )
//         {
//             clearInterval( intervalRef.current );
//         }

//         if ( !loadingMoreData && dataLoaded )
//         {
//             intervalRef.current = setInterval( async () =>
//             {
//                 if ( currentDayIndex < preciosBitcoin.length - 1 )
//                 {
//                     const nextDayIndex = currentDayIndex + 1;
//                     const updatedPrices = preciosBitcoin.slice(
//                         Math.max( 0, nextDayIndex - 30 ),
//                         nextDayIndex + 1
//                     );
//                     setDisplayedPrices( updatedPrices );
//                     setCurrentPrice( parseFloat( preciosBitcoin[nextDayIndex].precio ) );
//                     setCurrentDayIndex( nextDayIndex );
//                 } else
//                 {
//                     setDataLoaded( false );
//                     await handleNoMoreData();
//                     const nextDayIndex = currentDayIndex + 1;
//                     const updatedPrices = preciosBitcoin.slice(
//                         Math.max( 0, nextDayIndex - 30 ),
//                         nextDayIndex + 1
//                     );
//                     setDisplayedPrices( updatedPrices );
//                     setCurrentPrice( parseFloat( preciosBitcoin[nextDayIndex].precio ) );
//                     setCurrentDayIndex( nextDayIndex );
//                 }
//             }, 1000 );
//         }

//         return () =>
//         {
//             if ( intervalRef.current )
//             {
//                 clearInterval( intervalRef.current );
//             }
//         };
//     }, [currentDayIndex, preciosBitcoin, loadingMoreData, dataLoaded, dispatch, userInfo.id] );

//     useEffect( () =>
//     {
//         if ( simulacionIsError && simulacionMessage )
//         {
//             toast.error( simulacionMessage );
//             dispatch( reset() );
//         }
//     }, [simulacionIsError, simulacionMessage, dispatch] );

//     const handleStartSimulation = () =>
//     {
//         dispatch( startSimulation( { user: userInfo.id } ) );
//     };

//     const handleAdvanceSimulation = () =>
//     {
//         dispatch( advanceSimulation( { user: userInfo.id } ) );
//     };

//     const handleBuyBitcoin = () =>
//     {
//         if ( amount > 0 )
//         {
//             const lastDate = displayedPrices[displayedPrices.length - 1].fecha;
//             const price = displayedPrices[displayedPrices.length - 1].precio;
//             const cost = amount * price;

//             if ( simulacion.balance >= cost )
//             {
//                 dispatch( buyBitcoin( { user: userInfo.id, cantidad: amount, fecha: lastDate } ) )
//                     .unwrap()
//                     .then( () => toast.success( "Compra realizada con éxito" ) )
//                     .catch( ( error ) =>
//                     {
//                         toast.error( `Error: ${ error }` );
//                     } );
//             } else
//             {
//                 toast.error( "Balance insuficiente para realizar la compra." );
//             }
//         } else
//         {
//             toast.error( "Por favor ingresa una cantidad válida" );
//         }
//     };

//     const handleSellBitcoin = () =>
//     {
//         if ( amount > 0 )
//         {
//             const lastDate = displayedPrices[displayedPrices.length - 1].fecha;

//             if ( simulacion.bitcoins >= amount )
//             {
//                 dispatch( sellBitcoin( { user: userInfo.id, cantidad: amount, fecha: lastDate } ) )
//                     .unwrap()
//                     .then( () => toast.success( "Venta realizada con éxito" ) )
//                     .catch( ( error ) =>
//                     {
//                         toast.error( `Error: ${ error }` );
//                     } );
//             } else
//             {
//                 toast.error( "Cantidad de bitcoins insuficiente para realizar la venta." );
//             }
//         } else
//         {
//             toast.error( "Por favor ingresa una cantidad válida" );
//         }
//     };

//     const handleResetSimulation = () =>
//     {
//         dispatch( resetSimulation( { user: userInfo.id } ) );
//     };

//     const handleUpdateDate = () =>
//     {
//         if ( displayedPrices.length > 0 )
//         {
//             const lastDate = displayedPrices[displayedPrices.length - 1].fecha;
//             dispatch( updateDate( { user: userInfo.id, fecha: lastDate } ) );
//             navigate( "/dashboard" );
//         }
//     };

//     const bitcoinPricesData = {
//         labels: displayedPrices.map( ( price: any ) => price.fecha ),
//         datasets: [
//             {
//                 label: 'Precio de Bitcoin',
//                 data: displayedPrices.map( ( price: any ) => parseFloat( price.precio ) ),
//                 fill: false,
//                 backgroundColor: 'rgba(75,192,192,0.4)',
//                 borderColor: 'rgba(75,192,192,1)',
//             },
//         ],
//     };

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-3xl font-bold text-center mb-6">Simulador</h1>
//             {currentPrice !== null && (
//                 <div className="text-center mb-4">
//                     <h2 className="text-xl font-bold">Precio Actual de Bitcoin: {currentPrice.toFixed( 2 )} USD</h2>
//                 </div>
//             )}
//             {simulacionIsLoading && <p className="text-center">Loading...</p>}
//             {simulacionIsSuccess && simulacion ? (
//                 <div className="text-center mb-4">
//                     <p>Saldo: {simulacion.balance} USD</p>
//                     <p>Bitcoins: {simulacion.bitcoins} BTC</p>
//                     <p>Fecha: {simulacion.fecha}</p>
//                     <div className="flex justify-center space-x-4 mb-6">
//                         <button onClick={handleAdvanceSimulation} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//                             Avanzar Simulación
//                         </button>
//                         <button onClick={handleResetSimulation} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
//                             Reiniciar Simulación
//                         </button>
//                     </div>
//                     <div className="flex flex-col items-center mb-6">
//                         <input
//                             type="number"
//                             value={amount}
//                             onChange={( e ) => setAmount( parseFloat( e.target.value ) )}
//                             placeholder="Cantidad"
//                             className="mb-4 p-2 border rounded text-gray-700"
//                         />
//                         <div className="flex space-x-4">
//                             <button onClick={handleBuyBitcoin} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
//                                 Comprar Bitcoin
//                             </button>
//                             <button onClick={handleSellBitcoin} className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
//                                 Vender Bitcoin
//                             </button>
//                         </div>
//                     </div>
//                     <h2 className="text-2xl font-bold text-center mb-4">Historial de Precios de Bitcoin</h2>
//                     {displayedPrices && displayedPrices.length > 0 ? (
//                         <div className="mb-4">
//                             <Line data={bitcoinPricesData} />
//                         </div>
//                     ) : (
//                         <p className="text-center">No hay precios disponibles</p>
//                     )}
//                 </div>
//             ) : (
//                 <div className="text-center">
//                     {!simulacionIsLoading && (
//                         <button onClick={handleStartSimulation} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//                             Iniciar Simulación
//                         </button>
//                     )}
//                 </div>
//             )}
//             <button onClick={handleUpdateDate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4 mt-3">
//                 Regresar
//             </button>
//         </div>
//     );
// };

// export default Simulador;
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import
{
    startSimulation,
    fetchSimulation,
    resetSimulation,
    getBitcoinPrices,
    buyBitcoin,
    sellBitcoin,
    advanceSimulation,
    updateDate,
    reset,
    morePredictions,
    clearPredictions
} from '../../features/simulador/simuladorSlice';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import
{
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Simulador = () =>
{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector( ( state: RootState ) => state.auth );
    const {
        simulacion,
        simulacionIsLoading,
        simulacionIsError,
        simulacionIsSuccess,
        simulacionMessage,
        preciosBitcoin,
    } = useSelector( ( state: RootState ) => state.simulador );

    const [amount, setAmount] = useState<number>( 0 );
    const [displayedPrices, setDisplayedPrices] = useState<any[]>( [] );
    const [currentDayIndex, setCurrentDayIndex] = useState<number>( 0 );
    const [currentPrice, setCurrentPrice] = useState<number | null>( null );
    const [loadingMoreData, setLoadingMoreData] = useState<boolean>( false );
    const intervalRef = useRef<NodeJS.Timeout | null>( null );
    const [dataLoaded, setDataLoaded] = useState<boolean>( true );

    // useEffect( () =>
    // {
    //     dispatch( fetchSimulation( { user: userInfo.id } ) );
    // }, [dispatch, userInfo.id] );
    useEffect( () =>
    {
        const fetchBitcoinPrices = async () =>
        {
            if ( simulacionIsSuccess && simulacion )
            {
                await dispatch( getBitcoinPrices( { user: userInfo.id } ) ).unwrap();
            }
        };

        fetchBitcoinPrices();
    }, [dispatch, simulacionIsSuccess, simulacion, userInfo.id] );

    useEffect( () =>
    {
        if ( simulacionIsSuccess && simulacion )
        {
            dispatch( getBitcoinPrices( { user: userInfo.id } ) );
        }
    }, [dispatch, simulacionIsSuccess, simulacion, userInfo.id] );

    useEffect( () =>
    {
        if ( preciosBitcoin.length > 0 && simulacion )
        {
            const simulacionFecha = new Date( simulacion.fecha ).toISOString().split( 'T' )[0];
            const simulacionIndex = preciosBitcoin.findIndex(
                ( price: any ) => price.fecha === simulacionFecha
            );

            if ( simulacionIndex !== -1 )
            {
                const initialPrices = preciosBitcoin.slice(
                    Math.max( 0, simulacionIndex - 30 ),
                    simulacionIndex + 1
                );
                setDisplayedPrices( initialPrices );
                setCurrentDayIndex( simulacionIndex );
                setCurrentPrice( parseFloat( preciosBitcoin[simulacionIndex].precio ) );
            }
        }
    }, [preciosBitcoin, simulacion] );

    useEffect( () =>
    {
        console.log( preciosBitcoin )
        console.log( simulacion )
    }, [preciosBitcoin, simulacion] )

    const handleNoMoreData = async () =>
    {
        setLoadingMoreData( true );
        const lastDate = displayedPrices[displayedPrices.length - 1].fecha;
        await dispatch( morePredictions( { user: userInfo.id, fecha: lastDate } ) ).unwrap();
        setLoadingMoreData( false );
        setDataLoaded( true );
    };

    useEffect( () =>
    {
        if ( intervalRef.current )
        {
            clearInterval( intervalRef.current );
        }

        if ( !loadingMoreData && dataLoaded )
        {
            intervalRef.current = setInterval( async () =>
            {
                if ( currentDayIndex < preciosBitcoin.length - 1 )
                {
                    const nextDayIndex = currentDayIndex + 1;
                    const updatedPrices = preciosBitcoin.slice(
                        Math.max( 0, nextDayIndex - 30 ),
                        nextDayIndex + 1
                    );
                    setDisplayedPrices( updatedPrices );
                    setCurrentPrice( parseFloat( preciosBitcoin[nextDayIndex].precio ) );
                    setCurrentDayIndex( nextDayIndex );
                } else
                {
                    setDataLoaded( false );
                    await handleNoMoreData();
                    // Espera a que se carguen más datos antes de actualizar el índice del día
                    const nextDayIndex = currentDayIndex + 1;
                    const updatedPrices = preciosBitcoin.slice(
                        Math.max( 0, nextDayIndex - 30 ),
                        nextDayIndex + 1
                    );
                    setDisplayedPrices( updatedPrices );
                    setCurrentPrice( parseFloat( preciosBitcoin[nextDayIndex].precio ) );
                    setCurrentDayIndex( nextDayIndex );
                }
            }, 3000 );
        }

        return () =>
        {
            if ( intervalRef.current )
            {
                clearInterval( intervalRef.current );
            }
        };
    }, [currentDayIndex, preciosBitcoin, loadingMoreData, dataLoaded, dispatch, userInfo.id] );

    useEffect( () =>
    {
        if ( simulacionIsError && simulacionMessage )
        {
            toast.error( simulacionMessage );
            dispatch( reset() );
        }
    }, [simulacionIsError, simulacionMessage, dispatch] );

    const handleStartSimulation = () =>
    {
        dispatch( startSimulation( { user: userInfo.id } ) );
    };

    const handleAdvanceSimulation = () =>
    {
        dispatch( advanceSimulation( { user: userInfo.id } ) );
    };

    const handleBuyBitcoin = () =>
    {
        if ( amount > 0 )
        {
            const lastDate = displayedPrices[displayedPrices.length - 1].fecha;
            const price = displayedPrices[displayedPrices.length - 1].precio;
            const cost = amount * price;

            if ( simulacion.balance >= cost )
            {
                dispatch( buyBitcoin( { user: userInfo.id, cantidad: amount, fecha: lastDate } ) )
                    .unwrap()
                    .then( () => toast.success( "Compra realizada con éxito" ) )
                    .catch( ( error ) =>
                    {
                        toast.error( `Error: ${ error }` );
                    } );
            } else
            {
                toast.error( "Balance insuficiente para realizar la compra." );
            }
        } else
        {
            toast.error( "Por favor ingresa una cantidad válida" );
        }
    };

    const handleSellBitcoin = () =>
    {
        if ( amount > 0 )
        {
            const lastDate = displayedPrices[displayedPrices.length - 1].fecha;

            if ( simulacion.bitcoins >= amount )
            {
                dispatch( sellBitcoin( { user: userInfo.id, cantidad: amount, fecha: lastDate } ) )
                    .unwrap()
                    .then( () => toast.success( "Venta realizada con éxito" ) )
                    .catch( ( error ) =>
                    {
                        toast.error( `Error: ${ error }` );
                    } );
            } else
            {
                toast.error( "Cantidad de bitcoins insuficiente para realizar la venta." );
            }
        } else
        {
            toast.error( "Por favor ingresa una cantidad válida" );
        }
    };

    const handleResetSimulation = () =>
    {
        dispatch( resetSimulation( { user: userInfo.id } ) );
    };

    const handleUpdateDate = () =>
    {
        if ( displayedPrices.length > 0 )
        {
            const lastDate = displayedPrices[displayedPrices.length - 1].fecha;
            dispatch( updateDate( { user: userInfo.id, fecha: lastDate } ) );
            navigate( "/dashboard" );
        }
    };

    const bitcoinPricesData = {
        labels: displayedPrices.map( ( price: any ) => price.fecha ),
        datasets: [
            {
                label: 'Precio de Bitcoin',
                data: displayedPrices.map( ( price: any ) => parseFloat( price.precio ) ),
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-6">Simulador</h1>
            {currentPrice !== null && (
                <div className="text-center mb-4">
                    <h2 className="text-xl font-bold">Precio Actual de Bitcoin: {currentPrice.toFixed( 2 )} USD</h2>
                </div>
            )}
            {simulacionIsLoading && <p className="text-center">Loading...</p>}
            {simulacionIsSuccess && simulacion ? (
                <div className="text-center mb-4">
                    <p>Saldo: {simulacion.balance} USD</p>
                    <p>Bitcoins: {simulacion.bitcoins} BTC</p>
                    <p>Fecha: {simulacion.fecha}</p>
                    <div className="flex justify-center space-x-4 mb-6">
                        <button onClick={handleAdvanceSimulation} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Avanzar Simulación
                        </button>
                        <button onClick={handleResetSimulation} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                            Reiniciar Simulación
                        </button>
                    </div>
                    <div className="flex flex-col items-center mb-6">
                        <input
                            type="number"
                            value={amount}
                            onChange={( e ) => setAmount( parseFloat( e.target.value ) )}
                            placeholder="Cantidad"
                            className="mb-4 p-2 border rounded text-gray-700"
                        />
                        <div className="flex space-x-4">
                            <button onClick={handleBuyBitcoin} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                Comprar Bitcoin
                            </button>
                            <button onClick={handleSellBitcoin} className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
                                Vender Bitcoin
                            </button>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-4">Historial de Precios de Bitcoin</h2>
                    {displayedPrices && displayedPrices.length > 0 ? (
                        <div className="mb-4">
                            <Line data={bitcoinPricesData} />
                        </div>
                    ) : (
                        <p className="text-center">No hay precios disponibles</p>
                    )}
                </div>
            ) : (
                <div className="text-center">
                    {!simulacionIsLoading && (
                        <button onClick={handleStartSimulation} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Iniciar Simulación
                        </button>
                    )}
                </div>
            )}
            <button onClick={handleUpdateDate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4 mt-3">
                Regresar
            </button>
        </div>
    );
};

export default Simulador;
