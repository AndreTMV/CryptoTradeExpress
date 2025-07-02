import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { comprar, vender, buySell, reset } from '../../features/compras/comprasSlice';
import { getCryptos } from '../../features/predictions/predictionsSlice';
import { toast } from 'react-hot-toast';
import { checkKeys } from '../../features/perfil/perfilSlice';

const SellBuy = () =>
{
    const [cryptosList, setCryptos] = useState( [] );
    const [buyCrypto, setBuyCrypto] = useState( "" );
    const [sellCrypto, setSellCrypto] = useState( "" );
    const [tipoSide, setTipoSide] = useState<string>( "" );

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector( ( state: RootState ) => state.auth );
    const { comprasIsError, comprasIsLoading, comprasIsSuccess, comprasMessage } = useSelector( ( state: RootState ) => state.compras );
    const { perfilIsError, perfilIsLoading, perfilIsSuccess, perfilMessage } = useSelector( ( state: RootState ) => state.perfil );

    const [values, setValues] = useState( {
        minPrice: 0.0,
        maxPrice: 0.0,
        quantity: 0.0,
    } );

    const { minPrice, maxPrice, quantity } = values;

    const handleChange = ( evt ) =>
    {
        const { name, value } = evt.target;
        setValues( prevState => ( {
            ...prevState,
            [name]: value
        } ) );
    };

    const handleChangeBuyCrypto = ( evt ) =>
    {
        const { value } = evt.target;
        setBuyCrypto( value );
    };

    const handleChangeSellCrypto = ( evt ) =>
    {
        const { value } = evt.target;
        setSellCrypto( value );
    };

    const handleSubmit = ( evt ) =>
    {
        evt.preventDefault();
        const minPriceNumber = parseFloat( minPrice );
        const maxPriceNumber = parseFloat( maxPrice );
        const quantityNumber = parseFloat( quantity );

        // Validación para asegurarse de que los valores convertidos son números válidos
        if ( isNaN( minPriceNumber ) || isNaN( maxPriceNumber ) || isNaN( quantityNumber ) )
        {
            toast.error( "Por favor, ingresa valores numéricos válidos." );
            return;
        }
        // Validaciones adicionales para los porcentajes
        if ( minPriceNumber <= 0 )
        {
            toast.error( "El porcentaje mínimo de ganancia debe ser positivo." );
            return;
        }

        if ( maxPriceNumber <= 0 )
        {
            toast.error( "El porcentaje máximo de pérdida debe ser positivo." );
            return;
        }

        if ( buyCrypto === sellCrypto )
        {
            toast.error( "El porcentaje máximo de pérdida debe ser positivo." );
            return;
        }

        const priceData = {
            user: userInfo.id,
            max_percentage: minPriceNumber,
            min_percentage: maxPriceNumber,
            buy_this_crypto: buyCrypto,
            sell_this_crypto: sellCrypto,
            quantity: quantityNumber,
            side: tipoSide
        };
        console.log( priceData )


        dispatch( buySell( priceData ) )
    };

    async function fetchCryptos()
    {
        try
        {
            const cryptosData = await dispatch( getCryptos() );
            setCryptos( cryptosData.payload.cryptos );
        } catch ( error )
        {
            console.error( "Error fetching cryptos:", error );
        }
    }
    useEffect( () =>
    {
        if ( userInfo && userInfo.id )
        {
            const perfilData = { user: userInfo.id };
            dispatch( checkKeys( perfilData ) );
        }
    }, [dispatch, userInfo] );
    useEffect( () =>
    {
        if ( perfilMessage && !perfilMessage.exists )
        {
            toast.error( 'Tienes que conectarte con Binance en el apartado de perfil' );
            navigate( '/dashboard' );
        } else if ( userInfo && userInfo.id )
        {
            fetchCryptos();
        }

        return () =>
        {
            dispatch( reset() );
        };
    }, [dispatch, userInfo, perfilMessage, navigate] );

    // useEffect(() => {
    //     fetchCryptos();
    // }, []);
    useEffect( () =>
    {
        console.log( tipoSide )

    }, [tipoSide] )


    useEffect( () =>
    {
        if ( comprasIsSuccess )
        {
            toast.success( "Se te notificara por correo si la cripto llega a estar en los rangos de precio" );
            navigate( '/dashboard' );
        } else if ( comprasIsError )
        {
            toast.error( "Ha ocurrido un error:" + comprasMessage );
        }
        return () =>
        {
            dispatch( reset() );
        };
    }, [comprasIsError, comprasIsSuccess, navigate, dispatch, comprasMessage] );

    return (
        <div className="flex items-center justify-center h-screen mt-20">
            <div className="bg-white p-8 rounded shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">
                    CryptoTradeExpress
                </h1>

                <form onSubmit={handleSubmit}>
                    <p className='text-gray-700'>El valor en el que se decidira hacer la compra/venta sera dentro de los rangos de precio del precio en el que se abrio la orden y por los porcentajes de ganancia y perdida</p>
                    <br></br>
                    <div className="mb-4">
                        <label htmlFor="minPrice" className="block mb-2 text-sm font-medium text-gray-900">Porcentaje minimo de ganancia</label>
                        <input
                            id="minPrice"
                            name="minPrice"
                            type="text"
                            value={values.minPrice}
                            onChange={handleChange}
                            placeholder="Porcentaje minimo de ganancia"
                            className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="maxPrice" className="block mb-2 text-sm font-medium text-gray-900">Porcentaje maximo de perdida</label>
                        <input
                            id="maxPrice"
                            name="maxPrice"
                            type="text"
                            value={values.maxPrice}
                            onChange={handleChange}
                            placeholder="Porcentaje maximo de perdida"
                            className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-900">Cantidad</label>
                        <input
                            id="quantity"
                            name="quantity"
                            type="text"
                            value={values.quantity}
                            onChange={handleChange}
                            placeholder="Cantidad"
                            className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="tipoSide" className="block mb-2 text-sm font-medium text-gray-900">Tipo de transaccion</label>
                        <select
                            id="tipoSide"
                            name="tipoSide"
                            value={tipoSide}
                            onChange={( e ) => setTipoSide( e.target.value )}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option value="venta">Vender</option>
                            <option value="compra">Comprar</option>
                        </select>
                    </div>
                    <div className='mb-4'>
                        <label htmlFor="minPrice" className="block mb-2 text-sm font-medium text-gray-900">Moneda a comprar</label>
                        <select
                            id="buyCrypto"
                            name="buyCrypto"
                            value={buyCrypto}
                            onChange={handleChangeBuyCrypto}
                            className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Selecciona una crypto para comprar</option>
                            {cryptosList.map( ( crypto ) => (
                                <option key={crypto} value={crypto}>
                                    {crypto}
                                </option>
                            ) )}
                        </select>
                    </div>
                    <div className='mb-4'>
                        <label htmlFor="minPrice" className="block mb-2 text-sm font-medium text-gray-900">Moneda a vender</label>
                        <select
                            id="sellCrypto"
                            name="sellCrypto"
                            value={sellCrypto}
                            onChange={handleChangeSellCrypto}
                            className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Selecciona una crypto para vender</option>
                            {cryptosList.map( ( crypto ) => (
                                <option key={crypto} value={crypto}>
                                    {crypto}
                                </option>
                            ) )}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3"
                    >
                        Ejecutar orden
                    </button>
                </form>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4 mt-3">
                    <Link to="/dashboard">Regresar</Link>
                </button>
            </div>
        </div>
    );
};

export default SellBuy;