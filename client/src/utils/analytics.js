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
 * Analytics Utility - Redux integration
 * All analytics events are managed here
 */

export const analytics = {
  /**
   * Called when a new resume is created
   */
  trackNewResume: () => {
    store.dispatch(trackResumeCreated());
    console.log('📊 New resume created');
  },

  /**
   * Called when resume is viewed
   */
  trackResumeView: () => {
    store.dispatch(trackResumeViewed());
    console.log('👁️ Resume viewed');
  },

  /**
   * Called when template is selected
   * @param {string} templateName - Template name
   */
  trackTemplateSelection: (templateName) => {
    store.dispatch(trackTemplateUsed(templateName));
    console.log(`🎨 Template selected: ${templateName}`);
  },

  /**
   * Called when resume is downloaded
   */
  trackResumeDownload: () => {
    store.dispatch(trackDownload());
    console.log('⬇️ Resume downloaded');
  },

  /**
   * Tracks time spent on page (in seconds)
   * @param {number} seconds - Time elapsed (seconds)
   */
  trackTimeSpent: (seconds) => {
    store.dispatch(incrementTimeSpent(seconds));
    console.log(`⏱️ ${seconds} seconds elapsed`);
  },

  /**
   * Starts a new session
   */
  startNewSession: () => {
    store.dispatch(incrementSession());
    console.log('🚀 New session started');
  },

  /**
   * Gets current analytics data
   * @returns {object} Analytics state
   */
  getAnalytics: () => {
    const state = store.getState();
    return state.certification.analyticsData || {};
  },

  /**
   * Returns analytics summary data
   * @returns {object} Summary data
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
   * Convert time format to human readable format
   * @param {number} seconds - Seconds
   * @returns {string} Different time format
   */
  formatTime: (seconds) => {
    if (!seconds) return '0s';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0) parts.push(`${secs}s`);

    return parts.join(' ');
  },

  /**
   * Gets most used templates
   * @returns {array} Top 3 templates
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
   * Score that evaluates user productivity
   * @returns {number} Score between 0-100
   */
  getProductivityScore: () => {
    const state = store.getState();
    const analytics = state.certification;

    const score = Math.min(
      100,
      (analytics.resumesCreated || 0) * 20 +
        (analytics.downloadsCount || 0) * 15 +
        Math.min((analytics.totalTimeSpent || 0) / 3600, 20) + // Maximum 20 points for time
        (analytics.templatesUsed ? Object.keys(analytics.templatesUsed).length * 10 : 0)
    );

    return Math.round(score);
  },
};

export default analytics;
