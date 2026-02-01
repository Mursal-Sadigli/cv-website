import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDark: localStorage.getItem('theme') === 'dark' || false,
  selectedTemplate: localStorage.getItem('selectedTemplate') || null,
  selectedTemplateColor: localStorage.getItem('selectedTemplateColor') || null,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
      localStorage.setItem('theme', state.isDark ? 'dark' : 'light');
    },
    setTheme: (state, action) => {
      state.isDark = action.payload;
      localStorage.setItem('theme', action.payload ? 'dark' : 'light');
    },
    selectTemplate: (state, action) => {
      state.selectedTemplate = action.payload.id;
      state.selectedTemplateColor = action.payload.color || '#3B82f6';
      localStorage.setItem('selectedTemplate', action.payload.id);
      localStorage.setItem('selectedTemplateColor', action.payload.color || '#3B82f6');
    },
    clearSelectedTemplate: (state) => {
      state.selectedTemplate = null;
      state.selectedTemplateColor = null;
      localStorage.removeItem('selectedTemplate');
      localStorage.removeItem('selectedTemplateColor');
    },
  },
});

export const { toggleTheme, setTheme, selectTemplate, clearSelectedTemplate } = themeSlice.actions;
export default themeSlice.reducer;
