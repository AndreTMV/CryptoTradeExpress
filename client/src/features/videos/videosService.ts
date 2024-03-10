import  axios  from 'axios';

const BACKEND_DOMAIN = "http://localhost:8000"
const UPLOAD_VIDEO = `${BACKEND_DOMAIN}/videos/api/v1/videos/`
const GET_ALL_VIDEOS = `${BACKEND_DOMAIN}/videos/api/v1/videos/`
const GET_VIDEO = `${BACKEND_DOMAIN}/videos/api/v1/videos/`
const GET_ALL_SECTIONS = `${BACKEND_DOMAIN}/videos/api/v1/sections/`
const GET_SECTION_VIDEOS = `${BACKEND_DOMAIN}/videos/api/v1/getSectionVideos/`
const CHECK_VIDEO_EXIST = `${BACKEND_DOMAIN}/videos/api/v1/videoExist/`
const CHECK_ELMINATED_VIDEO_EXIST = `${BACKEND_DOMAIN}/videos/api/v1/EliminatedVideoExist/`
const UPDATE_STARS = `${BACKEND_DOMAIN}/videos/api/v1/updateStars/`
const UPDATE_VIEWS = `${BACKEND_DOMAIN}/videos/api/v1/updateViews/`
const MEDIA_STARS = `${BACKEND_DOMAIN}/videos/api/v1/starsMedia/`
const CREATE_SECTION = `${BACKEND_DOMAIN}/videos/api/v1/sections/`
const DELETE_SECTION = `${BACKEND_DOMAIN}/videos/api/v1/sections/`
const ACCEPT_VIDEO = `${BACKEND_DOMAIN}/videos/api/v1/acceptVideo/`
const NO_ACCEPTED_VIDEOS = `${BACKEND_DOMAIN}/videos/api/v1/noAcceptedVideos/`
const DELETE_VIDEO = `${BACKEND_DOMAIN}/videos/api/v1/videos/`
const DECLINE_VIDEO = `${BACKEND_DOMAIN}/videos/api/v1/declineVideo/`

const uploadVideo = async ( videoData: any ) =>
{
    const config = {
        headers:{
            "Content-type": "application/json"
        }
    }

    const response = await axios.post(UPLOAD_VIDEO, videoData, config)
    return response.data
}

const getAllVideos = async () =>
{
    const response = await axios.get(GET_ALL_VIDEOS,)
    return response.data
}

const getVideo = async (  ) =>
{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const response = await axios.get(GET_VIDEO, config)
    return response.data
}

const getAllSections = async () =>
{
    const response = await axios.get(GET_ALL_SECTIONS,)
    return response.data
}

const getSectionVideos = async ( sectionData ) =>
{
    const config = {
        params: {
            section:sectionData.id
        }
    }
    const response = await axios.get(GET_SECTION_VIDEOS, config)
    return response.data
}

const checkVideo = async ( videoData: any ) =>
{ 
    const config = {
        params: {
            url:videoData.url
        }
    }
    const response = await axios.get(CHECK_VIDEO_EXIST, config)
    return response.data
}

const checkEliminatedVideo = async ( videoData: any ) =>
{ 
    const config = {
        params: {
            url:videoData.url
        }
    }
    const response = await axios.get(CHECK_ELMINATED_VIDEO_EXIST, config)
    return response.data
}

const updateStars = async ( videoData: any ) =>
{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const response = await axios.put(UPDATE_STARS, videoData, config)
    return response.data
}

const updateViews = async ( videoData: any ) =>
{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const response = await axios.put(UPDATE_VIEWS, videoData, config)
    return response.data
}

const mediaStars = async ( videoData: any ) =>
{ 
    const config = {
        params: {
            id:videoData.id
        }
    }
    const response = await axios.get(MEDIA_STARS, config)
    return response.data
}

const uploadSection = async ( sectionData: any ) =>
{
    const config = {
        headers:{
            "Content-type": "application/json"
        }
    }

    const response = await axios.post(CREATE_SECTION, sectionData, config)
    return response.data
}


const deleteSection = async (sectionId: number) => {
    const response = await axios.delete(`${DELETE_SECTION}${sectionId}/`);
    return response.data;
}

const updateStatus = async ( videoData: any ) =>
{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const response = await axios.put(ACCEPT_VIDEO, videoData, config)
    return response.data
}

const getNoAcceptedVideos = async () =>
{
    const response = await axios.get(NO_ACCEPTED_VIDEOS,)
    return response.data
}

const deleteVideo = async (videoId: number) => {
    const response = await axios.delete(`${DELETE_VIDEO}${videoId}/`);
    return response.data;
}

const removeVideo = async ( videoData: any ) =>
{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const response = await axios.put(DECLINE_VIDEO, videoData, config)
    return response.data
}

const videosService = { uploadVideo, getAllVideos, getVideo, getAllSections, getSectionVideos, checkVideo, checkEliminatedVideo, updateStars, updateViews, mediaStars, uploadSection, deleteSection, updateStatus, getNoAcceptedVideos, deleteVideo, removeVideo }

export default videosService 

  