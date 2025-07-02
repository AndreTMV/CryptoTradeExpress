import  axios  from 'axios';

const BACKEND_DOMAIN = "http://localhost:8000"
const NEWS_API = `${BACKEND_DOMAIN}/noticias/api/v1`
const FETCH_NEWS = `${NEWS_API}/getTrendingNews/`



const fetchNews = async (  ) =>
{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const response = await axios.get(FETCH_NEWS, config)
    return response.data
}




const noticiaService = { fetchNews }

export default noticiaService 