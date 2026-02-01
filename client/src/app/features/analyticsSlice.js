import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  resumesCreated: 0,
  resumesViewed: 0,
  templatesUsed: {
    classic: 0,
    minimal: 0,
    modern: 0,
    minimalImage: 0,
  },
  downloadsCount: 0,
  lastActivityDate: null,
  totalTimeSpent: 0, // seconds
  sessionsCount: 0,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    trackResumeCreated: (state) => {
      state.resumesCreated += 1;
      state.lastActivityDate = new Date().toISOString();
    },
    trackResumeViewed: (state) => {
      state.resumesViewed += 1;
      state.lastActivityDate = new Date().toISOString();
    },
    trackTemplateUsed: (state, action) => {
      const template = action.payload;
      if (state.templatesUsed[template]) {
        state.templatesUsed[template] += 1;
      }
      state.lastActivityDate = new Date().toISOString();
    },
    trackDownload: (state) => {
      state.downloadsCount += 1;
      state.lastActivityDate = new Date().toISOString();
    },
    incrementTimeSpent: (state, action) => {
      state.totalTimeSpent += action.payload;
    },
    incrementSession: (state) => {
      state.sessionsCount += 1;
    },
    resetAnalytics: (state) => {
      return initialState;
    },
    setAnalytics: (state, action) => {
      return action.payload;
    },
  },
});

export const {
  trackResumeCreated,
  trackResumeViewed,
  trackTemplateUsed,
  trackDownload,
  incrementTimeSpent,
  incrementSession,
  resetAnalytics,
  setAnalytics,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
