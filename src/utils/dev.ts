// Development utilities
export const initDevEnv = () => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
        setTimeout(() => {
            console.log(
                '%cDesarrollado por: Jharol Uchuari\n%cGitHub: https://github.com/jharolsv74\n%cInstagram: @jharol_sv7',
                'color: #ffffff; background: #07101a; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
                'color: #43e97b; background: #07101a; padding: 4px 8px; border-radius: 4px; font-style: italic;',
                'color: #e1306c; background: #07101a; padding: 4px 8px; border-radius: 4px; font-style: italic;'
            );
            console.log('%c¡Gracias por visitar el código! 💻✨', 'color: #ff6b00; font-size: 12px; font-style: italic;');
        }, 2000);
    }
};