import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { fetchSales, fetchPurchases, reset } from '../../features/bot/botSlice';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { comprar, vender, buySell } from '../../features/compras/comprasSlice';
import { checkKeys } from '../../features/perfil/perfilSlice';
import { getCryptos } from '../../features/predictions/predictionsSlice';

const BotPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const { bot, botIsLoading, botIsError, botMessage } = useSelector((state: RootState) => state.bot);
    const { comprasIsError, comprasIsLoading, comprasIsSuccess, comprasMessage } = useSelector((state: RootState) => state.compras);
    const { perfilIsError, perfilIsLoading, perfilIsSuccess, perfilMessage } = useSelector((state: RootState) => state.perfil);

    const [cryptosList, setCryptos] = useState([]);
    const [buyCrypto, setBuyCrypto] = useState("");
    const [sellCrypto, setSellCrypto] = useState("");
    const [tipoSide, setTipoSide] = useState<string>("");
    const [values, setValues] = useState({
        minPrice: 0.0,
        maxPrice: 0.0,
        quantity: 0.0,
    });

    const [searchBuy, setSearchBuy] = useState("");
    const [searchSell, setSearchSell] = useState("");

    const { minPrice, maxPrice, quantity } = values;

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = evt.target;
        setValues(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChangeBuyCrypto = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = evt.target;
        setBuyCrypto(value);
    };

    const handleChangeSellCrypto = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = evt.target;
        setSellCrypto(value);
    };

    const handleSearchBuyChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setSearchBuy(evt.target.value);
    };

    const handleSearchSellChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setSearchSell(evt.target.value);
    };

    const handleSubmit = (evt: React.FormEvent) => {
        evt.preventDefault();
        const minPriceNumber = parseFloat(minPrice.toString());
        const maxPriceNumber = parseFloat(maxPrice.toString());
        const quantityNumber = parseFloat(quantity.toString());

        if (isNaN(minPriceNumber) || isNaN(maxPriceNumber) || isNaN(quantityNumber)) {
            toast.error("Por favor, ingresa valores numéricos válidos.");
            return;
        }
        if (minPriceNumber <= 0 || maxPriceNumber <= 0) {
            toast.error("Los porcentajes deben ser positivos.");
            return;
        }
        if (buyCrypto === sellCrypto) {
            toast.error("La criptomoneda comprada y vendida no pueden ser iguales.");
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

        dispatch(buySell(priceData));
    };

    const fetchCryptos = async () => {
        try {
            const cryptosData = await dispatch(getCryptos());
            setCryptos(cryptosData.payload.cryptos);
        } catch (error) {
            console.error("Error fetching cryptos:", error);
        }
    };

    useEffect(() => {
        if (userInfo && userInfo.id) {
            const perfilData = { user: userInfo.id };
            dispatch(checkKeys(perfilData));
        }
    }, [dispatch, userInfo]);

    useEffect(() => {
        if (perfilMessage && !perfilMessage.exists) {
            toast.error('Tienes que conectarte con Binance en el apartado de perfil');
            navigate('/dashboard');
        } else if (userInfo && userInfo.id) {
            dispatch(fetchPurchases({ userId: userInfo.id }));
            dispatch(fetchSales({ userId: userInfo.id }));
            fetchCryptos();
        }

        return () => {
            dispatch(reset());
        };
    }, [dispatch, userInfo, perfilMessage, navigate]);

    useEffect(() => {
        if (botIsError) {
            toast.error(botMessage);
        }
    }, [botIsError, botMessage]);

    useEffect(() => {
        if (comprasIsSuccess) {
            toast.success("Se te notificará por correo si la cripto llega a estar en los rangos de precio");
            navigate('/dashboard');
        } else if (comprasIsError) {
            toast.error("Ha ocurrido un error:" + comprasMessage);
        }
    }, [comprasIsError, comprasIsSuccess, navigate, dispatch, comprasMessage]);

    const handleCopyTrade = (trade: any, side: string) => {
        setBuyCrypto(trade.criptomoneda_bought);
        setSellCrypto(trade.criptomoneda_sold);
        setTipoSide(side);
        setValues({
            minPrice: trade.min_percentage_gain || 0,
            maxPrice: trade.max_percentage_lost || 0,
            quantity: trade.cuantity_bought || trade.cuantity_sold || 0,
        });
    };

    const filteredPurchases = bot.purchases?.filter((purchase: any) =>
        purchase.criptomoneda_bought.toLowerCase().includes(searchBuy.toLowerCase()) ||
        purchase.criptomoneda_sold.toLowerCase().includes(searchBuy.toLowerCase())
    );

    const filteredSales = bot.sales?.filter((sale: any) =>
        sale.criptomoneda_sold.toLowerCase().includes(searchSell.toLowerCase()) ||
        sale.criptomoneda_bought.toLowerCase().includes(searchSell.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4">
            <div className="text-center">
                <h1 className="text-2xl font-bold my-4">Configura tu bot</h1>
            </div>

            {botIsLoading ? (
                <div className="flex justify-center items-center">
                    <p>Cargando Información...</p>
                </div>
            ) : (
                <>
                    <h2 className="text-xl font-semibold my-4">Compras</h2>
                    <input
                        type="text"
                        placeholder="Buscar por criptomoneda"
                        value={searchBuy}
                        onChange={handleSearchBuyChange}
                        className="mb-4 p-2 border rounded text-gray-700"
                    />
                    <table className="min-w-full divide-y divide-gray-200 mb-8">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Criptomoneda Comprada</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Criptomoneda Vendida</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Precio de compra</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Cantidad Comprada</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Copiar Configuración</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredPurchases && filteredPurchases.length > 0 ? (
                                filteredPurchases.map((purchase: any, index: number) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{purchase.criptomoneda_bought}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{purchase.criptomoneda_sold}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{new Date(purchase.date).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{purchase.buying_price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{purchase.cuantity_bought}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleCopyTrade(purchase, 'compra')}>Copy Trade</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center">No hay compras disponibles</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <h2 className="text-xl font-semibold my-4">Ventas</h2>
                    <input
                        type="text"
                        placeholder="Buscar por criptomoneda"
                        value={searchSell}
                        onChange={handleSearchSellChange}
                        className="mb-4 p-2 border rounded text-gray-700"
                    />
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Criptomoneda Vendida</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Criptomoneda Comprada</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Precio de venta</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Cantidad Vendida</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Copiar Configuración</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredSales && filteredSales.length > 0 ? (
                                filteredSales.map((sale: any, index: number) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{sale.criptomoneda_sold}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{sale.criptomoneda_bought}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{new Date(sale.date).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{sale.selling_price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{sale.cuantity_sold}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleCopyTrade(sale, 'venta')}>Copy Trade</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center">No hay ventas disponibles</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </>
            )}
            <div className="bg-white p-8 rounded shadow-md mt-9">
                <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">
                   Especificaciones del bot 
                </h1>
            <form onSubmit={handleSubmit} className="mt-8">
                <p className='text-gray-700'>El valor en el que se decidirá hacer la compra/venta será dentro de los rangos de precio del precio en el que se abrió la orden y por los porcentajes de ganancia y pérdida.</p>
                <br />
                <div className="mb-4">
                    <label htmlFor="minPrice" className="block mb-2 text-sm font-medium text-gray-900">Porcentaje mínimo</label>
                    <input
                        id="minPrice"
                        name="minPrice"
                        type="text"
                        value={values.minPrice}
                        onChange={handleChange}
                        placeholder="Porcentaje mínimo de ganancia"
                        className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="maxPrice" className="block mb-2 text-sm font-medium text-gray-900">Porcentaje máximo</label>
                    <input
                        id="maxPrice"
                        name="maxPrice"
                        type="text"
                        value={values.maxPrice}
                        onChange={handleChange}
                        placeholder="Porcentaje máximo de pérdida"
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
                    <label htmlFor="tipoSide" className="block mb-2 text-sm font-medium text-gray-900">Tipo de transacción</label>
                    <select
                        id="tipoSide"
                        name="tipoSide"
                        value={tipoSide}
                        onChange={(e) => setTipoSide(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                        <option value="venta">Vender</option>
                        <option value="compra">Comprar</option>
                    </select>
                </div>
                <div className='mb-4'>
                    <label htmlFor="buyCrypto" className="block mb-2 text-sm font-medium text-gray-900">Moneda a comprar</label>
                    <select
                        id="buyCrypto"
                        name="buyCrypto"
                        value={buyCrypto}
                        onChange={handleChangeBuyCrypto}
                        className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
                    >
                        <option value="">Selecciona una crypto para comprar</option>
                        {cryptosList.map((crypto: string) => (
                            <option key={crypto} value={crypto}>
                                {crypto}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='mb-4'>
                    <label htmlFor="sellCrypto" className="block mb-2 text-sm font-medium text-gray-900">Moneda a vender</label>
                    <select
                        id="sellCrypto"
                        name="sellCrypto"
                        value={sellCrypto}
                        onChange={handleChangeSellCrypto}
                        className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
                    >
                        <option value="">Selecciona una crypto para vender</option>
                        {cryptosList.map((crypto: string) => (
                            <option key={crypto} value={crypto}>
                                {crypto}
                            </option>
                        ))}
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

export default BotPage;
