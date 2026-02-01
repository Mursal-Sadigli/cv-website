import store from '../app/store';
import {
  trackResumeCreated,
  trackResumeViewed,
  trackTemplateUsed,
  trackDownload,
  incrementTimeSpent,
  incrementSession,
} from '../app/features/analyticsSlice';

/**
 * Analytics Utility - Redux ilə inteqrasiya
 * Bütün analytics hadisələri burada idarə olunur
 */

export const analytics = {
  /**
   * Yeni rezyume yaradıldığı zaman çağırılır
   */
  trackNewResume: () => {
    store.dispatch(trackResumeCreated());
    console.log('📊 Yeni rezyume yaradıldı');
  },

  /**
   * Rezyume görüntülənəndə çağırılır
   */
  trackResumeView: () => {
    store.dispatch(trackResumeViewed());
    console.log('👁️ Rezyume görüntüləndi');
  },

  /**
   * Şablon seçildiyi zaman çağırılır
   * @param {string} templateName - Şablonun adı
   */
  trackTemplateSelection: (templateName) => {
    store.dispatch(trackTemplateUsed(templateName));
    console.log(`🎨 Şablon seçildi: ${templateName}`);
  },

  /**
   * Rezyume yükləndiyində çağırılır
   */
  trackResumeDownload: () => {
    store.dispatch(trackDownload());
    console.log('⬇️ Rezyume yükləndi');
  },

  /**
   * Səhifədə geçən zamanı izləyir (saniyə cinsindən)
   * @param {number} seconds - Keçən zaman (saniyə)
   */
  trackTimeSpent: (seconds) => {
    store.dispatch(incrementTimeSpent(seconds));
    console.log(`⏱️ ${seconds} saniyə vaxt keçdi`);
  },

  /**
   * Yeni sessiyanı başlatır
   */
  startNewSession: () => {
    store.dispatch(incrementSession());
    console.log('🚀 Yeni sessiya başladı');
  },

  /**
   * Cari analytics məlumatlarını alır
   * @returns {object} Analytics state
   */
  getAnalytics: () => {
    const state = store.getState();
    return state.certification.analyticsData || {};
  },

  /**
   * Analytics xülasə məlumatlarını döndürür
   * @returns {object} Xülasə məlumatları
   */
  getSummary: () => {
    const state = store.getState();
    const analytics = state.certification;
    
    return {
      resumesCreated: analytics.resumesCreated || 0,
      resumesViewed: analytics.resumesViewed || 0,
      downloadsCount: analytics.downloadsCount || 0,
      sessionsCount: analytics.sessionsCount || 0,
      totalTimeSpent: analytics.totalTimeSpent || 0,
      lastActivityDate: analytics.lastActivityDate || null,
      templatesUsed: analytics.templatesUsed || {},
    };
  },

  /**
   * Zaman formatını insan oxunabilir formatına çevir
   * @param {number} seconds - Saniyə
   * @returns {string} Fərqli vaxt formatı
   */
  formatTime: (seconds) => {
    if (!seconds) return '0s';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}s`);
    if (minutes > 0) parts.push(`${minutes}d`);
    if (secs > 0) parts.push(`${secs}san`);

    return parts.join(' ');
  },

  /**
   * En çox istifadə olunan şablonları alır
   * @returns {array} Top 3 şablon
   */
  getTopTemplates: () => {
    const state = store.getState();
    const templatesUsed = state.certification.templatesUsed || {};

    return Object.entries(templatesUsed)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  },

  /**
   * İstifadəçinin məhsuldarlığını qiymətləndirən skor
   * @returns {number} 0-100 arası skor
   */
  getProductivityScore: () => {
    const state = store.getState();
    const analytics = state.certification;

    const score = Math.min(
      100,
      (analytics.resumesCreated || 0) * 20 +
        (analytics.downloadsCount || 0) * 15 +
        Math.min((analytics.totalTimeSpent || 0) / 3600, 20) + // Maksimum 20 puan vaxt üçün
        (analytics.templatesUsed ? Object.keys(analytics.templatesUsed).length * 10 : 0)
    );

    return Math.round(score);
  },
};

export default analytics;
