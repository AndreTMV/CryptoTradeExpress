import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import videosService from "./videosService";
import { IVideo, ISection } from "./types";

interface VideosState {
  videos: IVideo[];
  sections: ISection[];
  video: IVideo | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  allLoaded: boolean;
  message: string | null;
}

const initialState: VideosState = {
  videos: [],
  sections: [],
  video: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  allLoaded: false,
  message: null
};

export const uploadVideo = createAsyncThunk<IVideo, Partial<IVideo>, { rejectValue: string }>(
  "videos/uploadVideo",
  async (videoData, thunkAPI) => {
    try {
      return await videosService.uploadVideo(videoData);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllVideos = createAsyncThunk<IVideo[], void, { rejectValue: string }>(
  "videos/getAllVideos",
  async (_, thunkAPI) => {
    try {
      return await videosService.getAllVideos();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllSections = createAsyncThunk<ISection[], void, { rejectValue: string }>(
  "videos/getAllSections",
  async (_, thunkAPI) => {
    try {
      return await videosService.getAllSections();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getSectionVideos = createAsyncThunk<IVideo[], number, { rejectValue: string }>(
  "videos/getSectionVideos",
  async (sectionId, thunkAPI) => {
    try {
      return await videosService.getSectionVideos(sectionId);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const checkVideo = createAsyncThunk<any, string, { rejectValue: string }>(
  "videos/checkVideo",
  async (url, thunkAPI) => {
    try {
      return await videosService.checkVideo(url);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const checkEliminatedVideo = createAsyncThunk<any, string, { rejectValue: string }>(
  "videos/checkEliminatedVideo",
  async (url, thunkAPI) => {
    try {
      return await videosService.checkEliminatedVideo(url);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateViews = createAsyncThunk<any, { id: number; views: number }, { rejectValue: string }>(
  "videos/updateViews",
  async (videoData, thunkAPI) => {
    try {
      return await videosService.updateViews(videoData);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateStars = createAsyncThunk<any, { id: number; stars: number }, { rejectValue: string }>(
  "videos/updateStars",
  async (videoData, thunkAPI) => {
    try {
      return await videosService.updateStars(videoData);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const uploadSection = createAsyncThunk<any, { name: string }, { rejectValue: string }>(
  "videos/uploadSection",
  async (sectionData, thunkAPI) => {
    try {
      return await videosService.uploadSection(sectionData);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteSection = createAsyncThunk<any, number, { rejectValue: string }>(
  "videos/deleteSection",
  async (id: number, thunkAPI) => {
    try {
      return await videosService.deleteSection(id);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const acceptVideo = createAsyncThunk<any, { id: number; accepted: boolean }, { rejectValue: string }>(
  "videos/acceptVideo",
  async (videoData, thunkAPI) => {
    try {
      return await videosService.updateStatus(videoData);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteVideo = createAsyncThunk<any, number, { rejectValue: string }>(
  "videos/deleteVideo",
  async (id, thunkAPI) => {
    try {
      return await videosService.deleteVideo(id);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getNoAcceptedVideos = createAsyncThunk<IVideo[], void, { rejectValue: string }>(
  "videos/getNoAcceptedVideos",
  async (_, thunkAPI) => {
    try {
      return await videosService.getNoAcceptedVideos();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const removeVideo = createAsyncThunk<any, { id: number }, { rejectValue: string }>(
  "videos/removeVideo",
  async (videoData, thunkAPI) => {
    try {
      return await videosService.removeVideo(videoData);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const videosSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadVideo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadVideo.fulfilled, (state, action: PayloadAction<IVideo>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.video = action.payload;
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload ?? "Error al subir video";
      })

      .addCase(getAllVideos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllVideos.fulfilled, (state, action: PayloadAction<IVideo[]>) => {
        state.isLoading = false;
        state.allLoaded = true;
        state.videos = action.payload;
      })
      .addCase(getAllVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.allLoaded = false;
        state.isError = true;
        state.message = action.payload ?? "Error al cargar videos";
      })

      .addCase(getAllSections.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllSections.fulfilled, (state, action: PayloadAction<ISection[]>) => {
        state.isLoading = false;
        state.sections = action.payload;
      })
      .addCase(getAllSections.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload ?? "Error al cargar secciones";
      })

      .addCase(getSectionVideos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSectionVideos.fulfilled, (state, action: PayloadAction<IVideo[]>) => {
        state.isLoading = false;
        state.videos = action.payload;
      })
      .addCase(getSectionVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload ?? "Error al cargar videos de la sección";
      })

      .addCase(checkVideo.fulfilled, (state, action) => {
        state.message = action.payload;
      })
      .addCase(checkEliminatedVideo.fulfilled, (state, action) => {
        state.message = action.payload;
      })

      .addCase(updateViews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateViews.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(updateViews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload ?? "Error al actualizar vistas";
      })

      .addCase(uploadSection.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadSection.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(uploadSection.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload ?? "Error al crear sección";
      })

      .addCase(deleteSection.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSection.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(deleteSection.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload ?? "Error al eliminar sección";
      })

      .addCase(updateStars.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateStars.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(updateStars.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload ?? "Error al actualizar estrellas";
      })

      .addCase(acceptVideo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(acceptVideo.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(acceptVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload ?? "Error al aceptar video";
      })

      .addCase(getNoAcceptedVideos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNoAcceptedVideos.fulfilled, (state, action: PayloadAction<IVideo[]>) => {
        state.isLoading = false;
        state.allLoaded = true;
        state.videos = action.payload;
      })
      .addCase(getNoAcceptedVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.allLoaded = false;
        state.isError = true;
        state.message = action.payload ?? "Error al cargar videos no aceptados";
      })

      .addCase(deleteVideo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteVideo.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(deleteVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload ?? "Error al eliminar video";
      })

      .addCase(removeVideo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeVideo.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(removeVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload ?? "Error al remover video";
      });
  }
});

export const { reset } = videosSlice.actions;
export default videosSlice.reducer;
