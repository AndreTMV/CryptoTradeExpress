import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import videosService  from './videosService';


const initialState = {
    videos:{},
    sections:{},
	videoIsError: false,
	videoIsSuccess: false,
	videoIsLoading: false,
    allLoaded: false,
	videoMessage: '',
};

export const uploadVideo = createAsyncThunk(
	"videos/uploadVideo",
	async ( videoData:any, thunkAPI ) =>
	{
		try {
			return await videosService.uploadVideo(videoData)	
		} catch (error:any) {
			const message = ( error.response && error.response.data && error.response.data.message )
				|| error.message || error.toString()
			console.log(message)
			return thunkAPI.rejectWithValue(message) 	
		}
	}
)

export const getAllVideos = createAsyncThunk(
	"videos/getAllVideos",
	async ( _, thunkAPI ) =>
	{
		try {
			return await videosService.getAllVideos()	
		} catch (error:any) {
			const message = ( error.response && error.response.data && error.response.data.message )
				|| error.message || error.toString()
			console.log(message)
			return thunkAPI.rejectWithValue(message) 	
		}
	}
)

export const getAllSections = createAsyncThunk(
	"videos/getAllSections",
	async ( _, thunkAPI ) =>
	{
		try {
			return await videosService.getAllSections()	
		} catch (error:any) {
			const message = ( error.response && error.response.data && error.response.data.message )
				|| error.message || error.toString()
			console.log(message)
			return thunkAPI.rejectWithValue(message) 	
		}
	}
)

export const getSectionVideos = createAsyncThunk(
	"videos/getSectionVideos",
	async ( sectionData, thunkAPI ) =>
	{
		try {
			return await videosService.getSectionVideos(sectionData)	
		} catch (error:any) {
			const message = ( error.response && error.response.data && error.response.data.message )
				|| error.message || error.toString()
			console.log(message)
			return thunkAPI.rejectWithValue(message) 	
		}
	}
)

export const checkVideo = createAsyncThunk(
    "videos/checkVideo",
    async (videoData, thunkAPI) => {
        try {
            return await videosService.checkVideo(videoData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const checkEliminatedVideo = createAsyncThunk(
    "videos/checkEliminatedVideo",
    async (videoData, thunkAPI) => {
        try {
            return await videosService.checkEliminatedVideo(videoData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const updateViews = createAsyncThunk(
    "videos/updateViews",
    async (videoData, thunkAPI) => {
        try {
            return await videosService.updateViews(videoData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const updateStars = createAsyncThunk(
    "videos/updateStars",
    async (videoData, thunkAPI) => {
        try {
            return await videosService.updateStars(videoData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const uploadSection = createAsyncThunk(
    "videos/uploadSection",
    async (sectionData, thunkAPI) => {
        try {
            return await videosService.uploadSection(sectionData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const deleteSection = createAsyncThunk(
    "videos/deleteSection",
    async (sectionData, thunkAPI) => {
        try {
            const id = sectionData.id;
            return await videosService.deleteSection(id)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const acceptVideo = createAsyncThunk(
    "videos/acceptVideo",
    async (videoData, thunkAPI) => {
        try {
            return await videosService.updateStatus(videoData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const deleteVideo = createAsyncThunk(
    "videos/deleteVideo",
    async (videoData, thunkAPI) => {
        try {
            const id = videoData.id;
            return await videosService.deleteVideo(id)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getNoAcceptedVideos = createAsyncThunk(
	"videos/getNoAcceptedVideos",
	async ( _, thunkAPI ) =>
	{
		try {
			return await videosService.getNoAcceptedVideos()	
		} catch (error:any) {
			const message = ( error.response && error.response.data && error.response.data.message )
				|| error.message || error.toString()
			console.log(message)
			return thunkAPI.rejectWithValue(message) 	
		}
	}
)
export const videosSlice = createSlice({
    name: "videos",
    initialState,
    reducers: {
        reset: (state) => {
            state.videoIsLoading = false
            state.videoIsError = false
            state.videoIsSuccess = false
            state.videoMessage = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadVideo.pending, (state) => {
                state.videoIsLoading = true
            })
            .addCase(uploadVideo.fulfilled, (state) => {
                state.videoIsLoading = false
                state.videoIsSuccess = true
            })
            .addCase(uploadVideo.rejected, (state, action) => {
                state.videoIsLoading = false
                state.videoIsSuccess = false
                state.videoIsError = true
                state.videoMessage = action.payload
            })
            .addCase(getAllVideos.pending, (state) => {
                state.videoIsLoading = true
            })
            .addCase(getAllVideos.fulfilled, (state, action) => {
                state.videoIsLoading = false
                state.allLoaded = true
                state.videos = action.payload
            })
            .addCase(getAllVideos.rejected, (state, action) => {
                state.videoIsLoading = false
                state.allLoaded = false
                state.videoIsError = true
                state.videoMessage = action.payload
            })
            .addCase(getAllSections.pending, (state) => {
                state.videoIsLoading = true
            })
            .addCase(getAllSections.fulfilled, (state, action) => {
                state.videoIsLoading = false
                state.allLoaded = true
                state.sections = action.payload
            })
            .addCase(getAllSections.rejected, (state, action) => {
                state.videoIsLoading = false
                state.allLoaded = false
                state.videoIsError = true
                state.videoMessage = action.payload
            })
            .addCase(getSectionVideos.pending, (state) => {
                state.videoIsLoading = true
            })
            .addCase(getSectionVideos.fulfilled, (state, action) => {
                state.videoIsLoading = false
                state.allLoaded = true
                state.videos = action.payload
            })
            .addCase(getSectionVideos.rejected, (state, action) => {
                state.videoIsLoading = false
                state.allLoaded = false
                state.videoIsError = true
                state.videoMessage = action.payload
            })
            .addCase(checkEliminatedVideo.fulfilled, (state, action) => {
                state.videoMessage = action.payload
            } )
            .addCase(checkVideo.fulfilled, (state, action) => {
                state.videoMessage = action.payload
            } )
            .addCase(updateViews.pending, (state) => {
                state.videoIsLoading = true
            })
            .addCase(updateViews.fulfilled, (state) => {
                state.videoIsLoading = false
                state.videoIsSuccess = true
            })
            .addCase(updateViews.rejected, (state, action) => {
                state.videoIsLoading = false
                state.videoIsSuccess = false
                state.videoIsError = true
                state.videoMessage = action.payload
            })
            .addCase(uploadSection.pending, (state) => {
                state.videoIsLoading = true
            })
            .addCase(uploadSection.fulfilled, (state) => {
                state.videoIsLoading = false
                state.videoIsSuccess = true
            })
            .addCase(uploadSection.rejected, (state, action) => {
                state.videoIsLoading = false
                state.videoIsSuccess = false
                state.videoIsError = true
                state.videoMessage = action.payload
            })
            .addCase(deleteSection.pending, (state) => {
                state.videoIsLoading = true
            })
            .addCase(deleteSection.fulfilled, (state) => {
                state.videoIsLoading = false
                state.videoIsSuccess = true
            })
            .addCase(deleteSection.rejected, (state, action) => {
                state.videoIsLoading = false
                state.videoIsSuccess = false
                state.videoIsError = true
                state.videoMessage = action.payload
            })
            .addCase(updateStars.pending, (state) => {
                state.videoIsLoading = true
            })
            .addCase(updateStars.fulfilled, (state) => {
                state.videoIsLoading = false
                state.videoIsSuccess = true
            })
            .addCase(updateStars.rejected, (state, action) => {
                state.videoIsLoading = false
                state.videoIsSuccess = false
                state.videoIsError = true
                state.videoMessage = action.payload
            })
            .addCase(acceptVideo.pending, (state) => {
                state.videoIsLoading = true
            })
            .addCase(acceptVideo.fulfilled, (state) => {
                state.videoIsLoading = false
                state.videoIsSuccess = true
            })
            .addCase(acceptVideo.rejected, (state, action) => {
                state.videoIsLoading = false
                state.videoIsSuccess = false
                state.videoIsError = true
                state.videoMessage = action.payload
            })
            .addCase(getNoAcceptedVideos.pending, (state) => {
                state.videoIsLoading = true
            })
            .addCase(getNoAcceptedVideos.fulfilled, (state, action) => {
                state.videoIsLoading = false
                state.allLoaded = true
                state.videos = action.payload
            })
            .addCase(getNoAcceptedVideos.rejected, (state, action) => {
                state.videoIsLoading = false
                state.allLoaded = false
                state.videoIsError = true
                state.videoMessage = action.payload
            })
            .addCase(deleteVideo.pending, (state) => {
                state.videoIsLoading = true
            })
            .addCase(deleteVideo.fulfilled, (state) => {
                state.videoIsLoading = false
                state.videoIsSuccess = true
            })
            .addCase(deleteVideo.rejected, (state, action) => {
                state.videoIsLoading = false
                state.videoIsSuccess = false
                state.videoIsError = true
                state.videoMessage = action.payload
            })
    }
})
export const { reset } = videosSlice.actions

export default videosSlice.reducer