/**
 * Theme Manager handles theme switching and theme persistence
 */
export class ThemeManager {
  initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      // Check for saved theme preference or use preferred color scheme
      const savedTheme = localStorage.getItem('quiz-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark-theme');
        themeToggle.checked = true;
      }

      themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
          document.documentElement.classList.add('dark-theme');
          localStorage.setItem('quiz-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark-theme');
          localStorage.setItem('quiz-theme', 'light');
        }
      });
    }
  }
}
