export class AnalyticsManager {
  constructor() {
    this.events = [];
    this.userId = this.getUserId();
    this.sessionId = this.generateSessionId();
  }

  getUserId() {
    let userId = localStorage.getItem('quiz_user_id');
    if (!userId) {
      userId = `user_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('quiz_user_id', userId);
    }
    return userId;
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  trackEvent(eventName, eventData = {}) {
    const event = {
      eventName,
      eventData,
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
    };

    this.events.push(event);

    // In a real application, you would send this to your analytics service
    console.log('Analytics event:', event);

    // For demonstration, we'll just store in localStorage
    this.saveEvents();

    return event;
  }

  saveEvents() {
    try {
      localStorage.setItem('quiz_analytics_events', JSON.stringify(this.events));
    } catch (e) {
      console.error('Failed to save analytics events:', e);
    }
  }

  getEvents() {
    return this.events;
  }
}
