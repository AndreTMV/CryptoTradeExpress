from django.http import JsonResponse
from django.db.models import Count
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import viewsets
from .serializer import PerfilSerializer, ExcludedRecomendationsSerializer
from .models import Perfil, ExcludedRecomendations
from rest_framework.permissions import AllowAny, IsAuthenticated
from amigos.models import FriendList
from compras.models import Compra
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
# Create your views here.
POSIBLE_OPTIONS = [item[0] for item in Perfil.HIDE_DATA]

#global dictionary for criptos:
CRIPTOS_INT_VALUE = {'1000BONK': 7317380468, '1000FLOKI': 6909581935, '1000LUNC': 8596362039, '1000PEPE': 423107299, '1000RATS': 6286652451, '1000SATS': 4819293242, '1000SHIB': 1389949302, '1000XEC': 4840213815, '1INCH': 1327557992, '1INCHDOWN': 5217287963, '1INCHUP': 4255211673, 'AAVE': 8837973046, 'AAVEDOWN': 2785460219, 'AAVEUP': 3462088602, 'ACA': 7897269036, 'ACE': 5777663272, 'ACH': 1018685186, 'ACM': 7724622836, 'ADA': 518940549, 'ADADOWN': 3594887296, 'ADAUP': 1544369903, 'ADX': 9400574833, 'AE': 756126833, 'AERGO': 891034800, 'AEUR': 2544398686, 'AEVO': 5001609016, 'AGI': 7515469657, 'AGIX': 5208889871, 'AGLD': 400058826, 'AI': 1271838649, 'AION': 5258555300, 'AKRO': 7603113763, 'ALCX': 5219477229, 'ALGO': 1794494382, 'ALICE': 3294196896, 'ALPACA': 3628521310, 'ALPHA': 5806494880, 'ALPINE': 5420363131, 'ALT': 457445414, 'AMB': 3553644115, 'AMP': 993353626, 'ANC': 2472944884, 'ANKR': 5549101661, 'ANT': 1031206239, 'ANY': 6933708415, 'APE': 3534811629, 'API3': 3728937965, 'APPC': 3670090073, 'APT': 1554524052, 'AR': 4108541963, 'ARB': 3720443424, 'ARDR': 6984320364, 'ARK': 3664011570, 'ARKM': 1068913051, 'ARN': 5060310727, 'ARPA': 9805258148, 'ARS': 294886394, 'ASR': 3996976385, 'AST': 5730284940, 'ASTR': 9765153392, 'ATA': 3047156923, 'ATM': 1603264589, 'ATOM': 9134734828, 'AUCTION': 6969537770, 'AUD': 4132613520, 'AUDIO': 3566414317, 'AUTO': 4401297347, 'AVA': 9045671753, 'AVAX': 806980246, 'AXL': 4236856, 'AXS': 3114854952, 'BADGER': 3599654107, 'BAKE': 9093062350, 'BAL': 4983549937, 'BAND': 275534184, 'BAR': 1981439631, 'BAT': 7253139226, 'BCC': 5819571057, 'BCD': 6432300520, 'BCH': 4353877420, 'BCHA': 1871539513, 'BCHABC': 9185102529, 'BCHDOWN': 2656195896, 'BCHUP': 2133239111, 'BCN': 3857787583, 'BCPT': 7004284724, 'BDOT': 8359387444, 'BEAM': 9600489349, 'BEAMX': 3937268541, 'BEAR': 4934939005, 'BEL': 3725543509, 'BETA': 1613257215, 'BETH': 3328128507, 'BGBP': 7402372812, 'BICO': 9135841706, 'BIDR': 4947108238, 'BIFI': 2437134353, 'BIGTIME': 2362408885, 'BKRW': 8019741587, 'BLUEBIRD': 9953433357, 'BLUR': 6584432697, 'BLZ': 4159206341, 'BNB': 2482300106, 'BNBBEAR': 3054163676, 'BNBBULL': 7592028420, 'BNBDOWN': 2862358980, 'BNBUP': 5065509720, 'BNT': 7023856614, 'BNX': 3348599426, 'BOME': 2443363741, 'BOND': 2169959917, 'BONK': 627658603, 'BOT': 1674248520, 'BQX': 9505442518, 'BRD': 6518252418, 'BRL': 5651721365, 'BSV': 1277661984, 'BSW': 9430210589, 'BTC': 709937406, 'BTCB': 1735279625, 'BTCDOM': 5232950422, 'BTCDOWN': 4069500530, 'BTCST': 8437904215, 'BTCUP': 5314804399, 'BTG': 5201690057, 'BTS': 1586476981, 'BTT': 6632857051, 'BTTC': 2450262637, 'BULL': 6266890300, 'BURGER': 3424940414, 'BUSD': 9068881664, 'BVND': 7054932566, 'BZRX': 7120992250, 'C98': 1994724457, 'CAKE': 40549298, 'CDT': 6371121811, 'CELO': 3045867638, 'CELR': 3845634230, 'CFX': 8795345454, 'CHAT': 5805920792, 'CHESS': 545525386, 'CHR': 9589877026, 'CHZ': 8023505540, 'CITY': 3839020200, 'CKB': 8547009010, 'CLOAK': 2169413698, 'CLV': 8659047132, 'CMT': 4300569882, 'CND': 9182563786, 'COCOS': 8686765782, 'COMBO': 3870410123, 'COMP': 9452304024, 'COS': 7548280136, 'COTI': 7347925859, 'COVER': 5727768484, 'CREAM': 9142500079, 'CRV': 990740204, 'CTK': 3996068571, 'CTSI': 3322517275, 'CTXC': 7133307051, 'CVC': 4634033311, 'CVP': 577963805, 'CVX': 7086611004, 'CYBER': 1265079811, 'CZK': 4995128767, 'DAI': 7030543134, 'DAR': 3871285590, 'DASH': 4221482243, 'DATA': 1402896372, 'DCR': 1861586178, 'DEFI': 239769336, 'DEGO': 7077329571, 'DENT': 2186103071, 'DEXE': 924368267, 'DF': 4963173842, 'DGB': 1491469651, 'DGD': 7089453620, 'DIA': 4911111059, 'DLT': 7579691060, 'DNT': 9259377033, 'DOCK': 4303407147, 'DODO': 7631962078, 'DODOX': 181094357, 'DOGE': 8381629688, 'DOT': 2420339264, 'DOTDOWN': 5234742159, 'DOTUP': 5034613816, 'DREP': 667925087, 'DUSK': 6293378270, 'DYDX': 285759881, 'DYM': 8526867692, 'EASY': 6012378384, 'EDO': 7104186420, 'EDU': 8110379342, 'EGLD': 121538049, 'ELF': 7729752241, 'ENA': 8302142179, 'ENG': 8786831698, 'ENJ': 4223994181, 'ENS': 1261380167, 'EOS': 9937591632, 'EOSBEAR': 2935047656, 'EOSBULL': 8075727076, 'EOSDOWN': 9314334189, 'EOSUP': 1311051487, 'EPS': 6149350260, 'EPX': 6379763157, 'ERD': 9930590790, 'ERN': 9502703180, 'ETC': 7486036697, 'ETH': 7344075085, 'ETHBEAR': 5669268393, 'ETHBULL': 4199980433, 'ETHDOWN': 2288623507, 'ETHFI': 9271479889, 'ETHUP': 5399715286, 'ETHW': 128007816, 'EUR': 7149211034, 'EVX': 5404677569, 'EZ': 4052736152, 'FARM': 5552098786, 'FDUSD': 363749877, 'FET': 5589500754, 'FIDA': 7392537296, 'FIL': 8552961323, 'FILDOWN': 8652172331, 'FILUP': 5507848961, 'FIO': 9843297937, 'FIRO': 8773041970, 'FIS': 2435698809, 'FLM': 3853647127, 'FLOKI': 1705081405, 'FLOW': 8992633021, 'FLUX': 3080288395, 'FOOTBALL': 4918164825, 'FOR': 3303792004, 'FORTH': 6834557279, 'FRONT': 5610143161, 'FTM': 1845834837, 'FTT': 6702660878, 'FUEL': 4813444675, 'FUN': 2835234434, 'FXS': 26731548, 'GAL': 2030516130, 'GALA': 834134450, 'GAS': 5096978081, 'GBP': 7759346820, 'GFT': 2523156398, 'GHST': 963694584, 'GLM': 2072435054, 'GLMR': 793013942, 'GMT': 3328208310, 'GMX': 8826597802, 'GNO': 271150240, 'GNS': 4040138405, 'GNT': 4021307711, 'GO': 172276403, 'GRS': 9691996930, 'GRT': 261438133, 'GTC': 1076997771, 'GTO': 8288903683, 'GVT': 7977696844, 'GXS': 3064277330, 'HARD': 1048844815, 'HBAR': 7166556920, 'HC': 3404657951, 'HEGIC': 2307044322, 'HFT': 5477925811, 'HIFI': 8949885820, 'HIGH': 6198006760, 'HIVE': 587674138, 'HNT': 5331512448, 'HOOK': 1215003306, 'HOT': 6606089142, 'HSR': 5030481307, 'ICN': 5420268322, 'ICP': 910850579, 'ICX': 8715758522, 'ID': 5983424795, 'IDEX': 3631671249, 'IDRT': 2337703894, 'ILV': 8043523892, 'IMX': 9192241757, 'INJ': 5142389845, 'INS': 1338574979, 'IOST': 2715780401, 'IOTA': 74467416, 'IOTX': 6865685594, 'IQ': 1997414157, 'IRIS': 1330424349, 'JASMY': 1469151443, 'JOE': 6438053624, 'JPY': 5928412284, 'JST': 5004977599, 'JTO': 1227916763, 'JUP': 17454725, 'JUV': 4153166053, 'KAS': 5626271147, 'KAVA': 1578049716, 'KDA': 3333197536, 'KEEP': 9779097828, 'KEY': 6348151380, 'KLAY': 2657129541, 'KMD': 1267741456, 'KNC': 3690718223, 'KP3R': 5240732606, 'KSM': 2391676914, 'LAZIO': 8067333375, 'LDO': 7990668102, 'LEND': 702249461, 'LEVER': 3925268317, 'LINA': 5347770601, 'LINK': 8236433114, 'LINKDOWN': 5459036067, 'LINKUP': 7686705601, 'LIT': 4525094799, 'LOKA': 6276218251, 'LOOM': 8893774198, 'LPT': 1120483555, 'LQTY': 8459973778, 'LRC': 9174878093, 'LSK': 5907983254, 'LTC': 3309475318, 'LTCDOWN': 5817314691, 'LTCUP': 6874405272, 'LTO': 9252215381, 'LUN': 4640445785, 'LUNA': 2639048767, 'LUNA2': 2242538092, 'LUNC': 439255847, 'MAGIC': 8303642926, 'MANA': 508733196, 'MANTA': 3343170712, 'MASK': 1313320175, 'MATIC': 3647142569, 'MAV': 7048248330, 'MAVIA': 5446397022, 'MBL': 6192786623, 'MBOX': 1935292085, 'MC': 6359625570, 'MCO': 6982638935, 'MDA': 3262326052, 'MDT': 5697393962, 'MDX': 7177644921, 'MEME': 7698172461, 'METIS': 5493497020, 'MFT': 9205198997, 'MINA': 8627610910, 'MIR': 381733357, 'MITH': 6205142571, 'MKR': 3259782977, 'MLN': 2047786763, 'MOB': 3336589264, 'MOD': 7795235408, 'MOVR': 4117616103, 'MTH': 9532395722, 'MTL': 5040771227, 'MULTI': 7213086367, 'MXN': 5398347794, 'MYRO': 2179742848, 'NANO': 7951055304, 'NAS': 6301961832, 'NAV': 2998365796, 'NBS': 1379834413, 'NCASH': 4347908744, 'NEAR': 9147521119, 'NEBL': 2912282691, 'NEO': 2967170100, 'NEXO': 9383184734, 'NFP': 1142439919, 'NGN': 465877035, 'NKN': 571420245, 'NMR': 8426568399, 'NPXS': 3541799058, 'NTRN': 5272152475, 'NU': 271635979, 'NULS': 1531238074, 'NXS': 2884449221, 'OAX': 1352152666, 'OCEAN': 5782576433, 'OG': 243362841, 'OGN': 5905890713, 'OM': 490191064, 'OMG': 7309018050, 'OMNI': 2453520393, 'ONDO': 4180297935, 'ONE': 3409476581, 'ONG': 5540936336, 'ONT': 7665863001, 'OOKI': 8345220341, 'OP': 9346653894, 'ORBS': 7446474862, 'ORDI': 9894996481, 'ORN': 6531490217, 'OSMO': 9938370989, 'OST': 9772010974, 'OXT': 3254697629, 'PAX': 5074898453, 'PAXG': 8973537303, 'PDA': 1684391520, 'PENDLE': 8731298387, 'PEOPLE': 4764405090, 'PEPE': 8302485696, 'PERL': 3142439799, 'PERP': 4786780337, 'PHA': 8600243105, 'PHB': 8462997418, 'PHX': 3411410145, 'PIVX': 9296242995, 'PIXEL': 3649782912, 'PLA': 9118261051, 'PLN': 5520239806, 'PNT': 322355160, 'POA': 3783971158, 'POE': 6175326935, 'POLS': 7143647801, 'POLY': 8205893824, 'POLYX': 1277578127, 'POND': 5063295371, 'PORTAL': 2099722855, 'PORTO': 9780729851, 'POWR': 2433154360, 'PPT': 1697020317, 'PROM': 6535327331, 'PROS': 8138290709, 'PSG': 9941995554, 'PUNDIX': 1250186103, 'PYR': 773834155, 'PYTH': 4759715704, 'QI': 7567222448, 'QKC': 8387615810, 'QLC': 8665951085, 'QNT': 4672488996, 'QSP': 9492516375, 'QTUM': 3269056594, 'QUICK': 4541838558, 'RAD': 7222740677, 'RAMP': 2129860688, 'RARE': 9316519994, 'RAY': 2662796588, 'RCN': 8059744904, 'RDN': 2585812811, 'RDNT': 2196153544, 'REEF': 2186231344, 'REI': 4446966634, 'REN': 4908672508, 'RENBTC': 2406947267, 'REP': 451757881, 'REQ': 2167691101, 'REZ': 1540341763, 'RGT': 5099466145, 'RIF': 5792216447, 'RLC': 9134102952, 'RNDR': 6642447592, 'RON': 9146117452, 'RONIN': 6727691371, 'ROSE': 4313255368, 'RPL': 7187971575, 'RPX': 4684951413, 'RSR': 5916100556, 'RUB': 1979971399, 'RUNE': 3383127431, 'RVN': 6302036304, 'SAGA': 1650398210, 'SALT': 8555131098, 'SAND': 8225764181, 'SANTOS': 5252534234, 'SC': 5170959442, 'SCRT': 9559619935, 'SEI': 9713139205, 'SFP': 3154294774, 'SHIB': 6385603479, 'SKL': 6534713135, 'SKY': 7471452038, 'SLP': 2705660814, 'SNGLS': 3078122503, 'SNM': 1886564669, 'SNT': 4413055452, 'SNX': 6225351014, 'SOL': 5694174530, 'SPARTA': 7311495731, 'SPELL': 7015565942, 'SRM': 1922518579, 'SSV': 8436979731, 'STEEM': 5616959808, 'STG': 6778772112, 'STMX': 2359334222, 'STORJ': 6538996652, 'STORM': 8181318132, 'STPT': 9383964983, 'STRAT': 7468916291, 'STRAX': 5530020761, 'STRK': 1974242385, 'STX': 7836375023, 'SUB': 1725986022, 'SUI': 8281497448, 'SUN': 4416196031, 'SUPER': 8587795821, 'SUSD': 2496488328, 'SUSHI': 7588727116, 'SUSHIDOWN': 9237822483, 'SUSHIUP': 3222462364, 'SWRV': 3954573719, 'SXP': 4929957395, 'SXPDOWN': 3486182160, 'SXPUP': 4554582307, 'SYN': 1007421605, 'SYS': 5779854348, 'T': 2500665833, 'TAO': 9178209396, 'TCT': 9869163764, 'TFUEL': 704930575, 'THETA': 1534543866, 'TIA': 7069526681, 'TKO': 3576361598, 'TLM': 7941816681, 'TNB': 67920696, 'TNSR': 1757350074, 'TNT': 8444568364, 'TOKEN': 6149962825, 'TOMO': 8461669559, 'TON': 3753935232, 'TORN': 6451493736, 'TRB': 2277673723, 'TRIBE': 4856846031, 'TRIG': 3377848393, 'TROY': 2715463459, 'TRU': 9084182374, 'TRX': 9990572318, 'TRXDOWN': 3734367138, 'TRXUP': 898326811, 'TRY': 313828062, 'TUSD': 1164661310, 'TUSDB': 2501735102, 'TVK': 5992722614, 'TWT': 7277960618, 'UAH': 3137646644, 'UFT': 3923215595, 'UMA': 2159275346, 'UNFI': 7375173672, 'UNI': 735236127, 'UNIDOWN': 3740410890, 'UNIUP': 6976785310, 'USD': 6780061190, 'USDC': 93123303, 'USDP': 3179159405, 'USDS': 41879841, 'USDSB': 6328398983, 'USDT': 3621470540, 'UST': 6602904161, 'USTC': 3864821539, 'UTK': 9051756786, 'VAI': 7911056197, 'VANRY': 7843108040, 'VEN': 1237231571, 'VET': 9411380343, 'VGX': 8120195882, 'VIA': 4785918014, 'VIB': 1448136583, 'VIBE': 1139108046, 'VIC': 9797960467, 'VIDT': 5044180610, 'VITE': 1003761775, 'VOXEL': 4951886588, 'VTHO': 1493327545, 'W': 4320021598, 'WABI': 6557491594, 'WAN': 7447287410, 'WAVES': 6595051840, 'WAXP': 3617531446, 'WBETH': 5687789830, 'WBTC': 1433260896, 'WIF': 8305964304, 'WIN': 8191689211, 'WING': 4333594096, 'WINGS': 1298962877, 'WLD': 933021591, 'WNXM': 307726506, 'WOO': 1091404807, 'WPR': 6681051831, 'WRX': 3744683955, 'WTC': 4996935154, 'XAI': 1434040381, 'XEC': 66234104, 'XEM': 958320867, 'XLM': 2738923403, 'XLMDOWN': 1140901256, 'XLMUP': 2560512102, 'XMR': 4094149772, 'XNO': 7612795692, 'XRP': 8181659957, 'XRPBEAR': 3137762245, 'XRPBULL': 2419154624, 'XRPDOWN': 9648331607, 'XRPUP': 937376124, 'XTZ': 5973128547, 'XTZDOWN': 665316463, 'XTZUP': 1557660774, 'XVG': 3555450119, 'XVS': 5911300217, 'XZC': 9413501486, 'YFI': 9177365506, 'YFIDOWN': 2657101922, 'YFII': 4930313506, 'YFIUP': 1881830104, 'YGG': 2161216248, 'YOYOW': 7663201477, 'ZAR': 396817215, 'ZEC': 2205372403, 'ZEN': 372570329, 'ZETA': 5823263034, 'ZIL': 4571460192, 'ZRX': 3464254768}



class PerfilView(viewsets.ModelViewSet):
    serializer_class = PerfilSerializer
    queryset = Perfil.objects.all()

class ExcludedRecomendationsView(viewsets.ModelViewSet):
    serializer_class = ExcludedRecomendationsSerializer
    queryset = ExcludedRecomendations.objects.all()


@api_view(['GET'])
def perfil_exist(request):
    id = request.query_params.get('id', None)

    if id:
        perfil_exists = Perfil.objects.filter(username=id).exists()
        return Response(perfil_exists)

    return Response({'error': 'Debes proporcionar un usuario en los parámetros de consulta.'}, status=400)

 

@api_view(['GET'])
def perfil_info(request):
    user_id = request.query_params.get('id')
    if user_id:
        try:
            perfil_info = Perfil.objects.get(username=user_id)
            serializer = PerfilSerializer(perfil_info)
            friend_list = perfil_info.friend_list  
            friends_count = len(friend_list.friends.all()) 
            print(friends_count) #
            serializer.data["friend_list"] = friends_count
            return Response(serializer.data)
        except Perfil.DoesNotExist:
            return Response({'error': 'Perfil no encontrado para el usuario proporcionado.'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    else:
        return Response({'error': 'Debes proporcionar un usuario válido.'}, status=400)

@api_view(['PUT'])
def update_hidden_information(request):
    id = request.query_params.get('id')
    hide_information = request.query_params.get('hide_information')
    print(hide_information)
    if id and hide_information:
        try:
            perfil = Perfil.objects.get(username=id)
            information = hide_information.split(',')
            perfil.hide_information = []
            for data in information:
                if data in POSIBLE_OPTIONS:
                    try:
                        perfil.hide_information.append(data)
                    except Exception as e:
                        print(f'{data} no esta en los valores permitidos, e:{str(e)}')
                else:
                    print(f'{data} no es una opcion valida')
                  
            perfil.save()
            return Response({'Updated information correctly'}, 200)

        except Exception as e:
            return Response({'error': str(e)}, 500)
    else:
        return Response({'error':'Debes proporcionar un usuario en los parametros de consulta y valores validos'}, 400)

@api_view(['GET'])
def get_public_info(request):
    user_id = request.query_params.get('id')
    try:
        perfil = Perfil.objects.get(username=user_id)
        fields_to_exclude = set(perfil.hide_information)
        friend_list = perfil.friend_list  
        friends_count = len(friend_list.friends.all()) 
        public_info = {}
        for field in Perfil._meta.get_fields():
            field_name = field.name
            if field_name not in fields_to_exclude and field_name != 'hide_information' and hasattr(perfil, field_name):
                if field_name == 'username':
                    public_info[field_name] = perfil.username.username
                elif field_name == 'friend_list':
                    public_info[field_name] = friends_count
                else:
                    public_info[field_name] = getattr(perfil, field_name)
        return Response(public_info, status=200)
    except Perfil.DoesNotExist:
        return Response({'error': 'Perfil no encontrado para el usuario proporcionado.'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

def fill_vector(vector, target_length):
    if len(vector) < target_length:
        # Calcular cuantos elementos se necesitan agregar
        num_to_add = target_length - len(vector)
        # Generar 1 para rellenar el vector
        zeros = [1] * num_to_add
        # Concatenar los numeros aleatorios al vector
        vector = np.concatenate((vector, zeros))
    return vector

def perfil_to_vector(perfil):
    # Obtener las criptomonedas más compradas por el usuario
    top_cryptos = Compra.objects.filter(user=perfil.username).values('criptomoneda_bought').annotate(count=Count('id')).order_by('-count')[:3]
    top_cryptos_list = np.array([CRIPTOS_INT_VALUE.get(crypto['criptomoneda_bought'], 1) for crypto in top_cryptos]) if top_cryptos else np.array([1])

    # Obtener los amigos en común
    friend_query = FriendList.objects.get(user=perfil.username)
    friends = friend_query.friends.all().values_list('id', flat=True)
    friends_list = np.array([friend for friend in friends])

    # Crear un vector con las características del perfil
    interested_cryptos_vector = np.array([CRIPTOS_INT_VALUE.get(crypto) for crypto in perfil.interested_cryptos])

    birth_year = int(perfil.birth_day.year)

    vector = np.array([birth_year, int(perfil.date_joined.year)])
    vector = np.concatenate((vector, friends_list, top_cryptos_list, interested_cryptos_vector))
    print(np.array(vector))

    return np.array(vector)

@api_view(['GET'])
def cosine_similarity_view(request):
    user = request.query_params.get('user')
    if user:
        try:
            user_profile = Perfil.objects.get(username=user)
        except Perfil.DoesNotExist:
            return Response({'error': 'El usuario no existe'}, status=404)

        all_profiles = Perfil.objects.exclude(username=user_profile.username)
        similarities = {}

        for profile in all_profiles:
            vector_user = perfil_to_vector(user_profile)
            vector_receiver = perfil_to_vector(profile)
            # Determinar la longitud maxima de los dos vectores
            max_length = max(len(vector_user), len(vector_receiver))

            # Rellenar los vectores si tienen longitudes diferentes
            vector_user = fill_vector(vector_user, max_length)
            vector_receiver = fill_vector(vector_receiver, max_length)
            vector_user.sort()
            vector_receiver.sort()
            similarity = cosine_similarity(
                vector_user.reshape(1, -1), vector_receiver.reshape(1, -1))
            similarities[profile.username] = similarity[0][0]

        return Response({'similarities': similarities}, status=200)
    else:
        return Response({'error': 'Debes proporcionar un usuario en los parametros de consulta'}, status=400)


@api_view(['GET'])
def cosine_similarity_view(request):
    user = request.query_params.get('user')

    if user:
        try:
            user_profile = Perfil.objects.get(username=user)
        except Perfil.DoesNotExist:
            return Response({'error': 'El usuario no existe'}, status=404)

        all_profiles = Perfil.objects.exclude(username=user)
        similarities = {}
        vector_user = perfil_to_vector(user_profile)

        for profile in all_profiles:

            vector_receiver = perfil_to_vector(profile)
            # Determinar la longitud maxima de los dos vectores
            max_length = max(len(vector_user), len(vector_receiver))

            # Rellenar los vectores si tienen longitudes diferentes
            vector_user = fill_vector(vector_user, max_length)
            vector_receiver = fill_vector(vector_receiver, max_length)
            vector_user.sort()
            vector_receiver.sort()
            similarity = cosine_similarity(
                vector_user.reshape(1, -1), vector_receiver.reshape(1, -1))
            similarities[int(profile.username.id)] = {
                "username": profile.username.username,
                "similarity": similarity[0][0]
            }

        return Response(similarities, status=200)
    else:
        return Response({'error': 'Debes proporcionar un usuario en los parametros de consulta'}, status=400)

@api_view(['PUT'])
def add_user_recomendations(request):
    user = request.data.get('user')
    exclude = request.data.get('exclude')
    if user and exclude:
        try:
            user_recomendations = ExcludedRecomendations.objects.get(user=user) 
        except:
            return Response({'status':'Usuario no encontrado'}, 404)
        
        exclude = int(exclude)
        user_recomendations.excluded_recomendations.append(exclude)
        user_recomendations.save()
        return Response({'status':'se agrego correctamente'}, 200)
    else:
        return Response({'error': 'Debes proporcionar un usuario en los datos'}, status=400)
        
@api_view(['GET'])
def get_excluded_users(request):
    user = request.query_params.get('user')
    if user:
        try:
            user_recomendations = ExcludedRecomendations.objects.get(user=user)
            serializer = ExcludedRecomendationsSerializer(user_recomendations)
        except:
            return Response({'status':'Usuario no encontrado'}, 404)
    
        return Response(serializer.data['excluded_recomendations'], 200)
    else:
        return Response({'error': 'Debes proporcionar un usuario en los datos'}, status=400)       


# @api_view(['GET'])
# def cosine_similarity_view(request):
#     user = request.query_params.get('user')
#     compare_user = request.query_params.get('receiver')

#     if user and compare_user:
#         try:
#             perfil_user = Perfil.objects.get(username=user)
#             perfil_reciever = Perfil.objects.get(username=compare_user)
#         except Exception as e:
#             return Response({'error finding users': str(e)}, 500)

#         vector_user = perfil_to_vector(perfil_user)
#         vector_receiver = perfil_to_vector(perfil_reciever)
#         # Determinar la longitud maxima de los dos vectores
#         max_length = max(len(vector_user), len(vector_receiver))

#         # Rellenar los vectores si tienen longitudes diferentes
#         vector_user = fill_vector(vector_user, max_length)
#         vector_receiver = fill_vector(vector_receiver, max_length)
#         vector_user.sort()
#         vector_receiver.sort()
#         similarity = cosine_similarity(
#             vector_user.reshape(1, -1), vector_receiver.reshape(1, -1))
#         return Response({'similarity':similarity[0][0]}, status=200)
#     else:
#         return Response({'error':'Debes proporcionar un usuario en los parametros de consulta y valores validos'}, 400)
# @api_view(['GET'])
# def perfil_info(request):
#     user = request.query_params.get('id', None)
#     if user:
#         perfil_info = Perfil.objects.get(username=user)
#         serializer = PerfilSerializer(perfil_info, many=True)
#         return Response(serializer.data, 200)
#     return Response({'error': 'Debes proporcionar un usuario en los parámetros de consulta.'}, status=400)  