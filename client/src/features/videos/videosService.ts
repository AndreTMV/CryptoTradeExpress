import api from "../../api/axiosInstance";
import { IVideo, ISection } from "./types";
const VIDEOS_URL = "videos/api/v1/videos/";
const SECTIONS_URL = "videos/api/v1/sections/";
const SECTION_VIDEOS_URL = "videos/api/v1/getSectionVideos/";
const CHECK_VIDEO_URL = "videos/api/v1/videoExist/";
const CHECK_ELIMINATED_VIDEO_URL = "videos/api/v1/EliminatedVideoExist/";
const UPDATE_STARS_URL = "videos/api/v1/updateStars/";
const UPDATE_VIEWS_URL = "videos/api/v1/updateViews/";
const MEDIA_STARS_URL = "videos/api/v1/starsMedia/";
const ACCEPT_VIDEO_URL = "videos/api/v1/acceptVideo/";
const NO_ACCEPTED_VIDEOS_URL = "videos/api/v1/noAcceptedVideos/";
const DECLINE_VIDEO_URL = "videos/api/v1/declineVideo/";

const videosService = {
  uploadVideo: async (videoData: Partial<IVideo>) => {
    const response = await api.post(VIDEOS_URL, videoData);
    return response.data;
  },

  getAllVideos: async (): Promise<IVideo[]> => {
    const response = await api.get(VIDEOS_URL);
    return response.data;
  },

  getVideo: async (id: number): Promise<IVideo> => {
    const response = await api.get(`${VIDEOS_URL}${id}/`);
    return response.data;
  },

  getAllSections: async (): Promise<ISection[]> => {
    const response = await api.get(SECTIONS_URL);
    return response.data;
  },

  getSectionVideos: async (sectionId: number): Promise<IVideo[]> => {
    const response = await api.get(SECTION_VIDEOS_URL, {
      params: { section: sectionId }
    });
    return response.data;
  },

  checkVideo: async (url: string) => {
    const response = await api.get(CHECK_VIDEO_URL, { params: { url } });
    return response.data;
  },

  checkEliminatedVideo: async (url: string) => {
    const response = await api.get(CHECK_ELIMINATED_VIDEO_URL, { params: { url } });
    return response.data;
  },

  updateStars: async (videoData: { id: number; stars: number }) => {
    const response = await api.put(UPDATE_STARS_URL, videoData);
    return response.data;
  },

  updateViews: async (videoData: { id: number; views: number }) => {
    const response = await api.put(UPDATE_VIEWS_URL, videoData);
    return response.data;
  },

  mediaStars: async (id: number) => {
    const response = await api.get(MEDIA_STARS_URL, { params: { id } });
    return response.data;
  },

  uploadSection: async (sectionData: { name: string }) => {
    const response = await api.post(SECTIONS_URL, sectionData);
    return response.data;
  },

  deleteSection: async (id: number) => {
    const response = await api.delete(`${SECTIONS_URL}${id}/`);
    return response.data;
  },

  updateStatus: async (videoData: { id: number; accepted: boolean }) => {
    const response = await api.put(ACCEPT_VIDEO_URL, videoData);
    return response.data;
  },

  getNoAcceptedVideos: async (): Promise<IVideo[]> => {
    const response = await api.get(NO_ACCEPTED_VIDEOS_URL);
    return response.data;
  },

  deleteVideo: async (id: number) => {
    const response = await api.delete(`${VIDEOS_URL}${id}/`);
    return response.data;
  },

  removeVideo: async (videoData: { id: number }) => {
    const response = await api.put(DECLINE_VIDEO_URL, videoData);
    return response.data;
  }
};

export default videosService;
