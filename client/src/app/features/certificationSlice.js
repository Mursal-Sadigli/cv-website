import { createSlice } from "@reduxjs/toolkit";

// localStorage-dən məlumatları yükləmə
const loadCertificationsFromStorage = () => {
  try {
    const stored = localStorage.getItem("certifications");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("localStorage-dən oxuma xətası:", error);
    return [];
  }
};

// localStorage-ə məlumatları saxlama
const saveCertificationsToStorage = (certifications) => {
  try {
    localStorage.setItem("certifications", JSON.stringify(certifications));
  } catch (error) {
    console.error("localStorage-ə yazma xətası:", error);
  }
};

const initialState = {
  certifications: loadCertificationsFromStorage(),
};

const certificationSlice = createSlice({
  name: "certification",
  initialState,
  reducers: {
    addCertification: (state, action) => {
      state.certifications.push({
        id: Date.now(),
        ...action.payload,
      });
      saveCertificationsToStorage(state.certifications);
    },
    updateCertification: (state, action) => {
      const index = state.certifications.findIndex(
        (cert) => cert.id === action.payload.id
      );
      if (index !== -1) {
        state.certifications[index] = action.payload;
        saveCertificationsToStorage(state.certifications);
      }
    },
    deleteCertification: (state, action) => {
      state.certifications = state.certifications.filter(
        (cert) => cert.id !== action.payload
      );
      saveCertificationsToStorage(state.certifications);
    },
    setCertifications: (state, action) => {
      state.certifications = action.payload;
      saveCertificationsToStorage(state.certifications);
    },
  },
});

export const {
  addCertification,
  updateCertification,
  deleteCertification,
  setCertifications,
} = certificationSlice.actions;

export default certificationSlice.reducer;
