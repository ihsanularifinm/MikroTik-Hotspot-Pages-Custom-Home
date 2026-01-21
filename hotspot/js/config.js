const hotspotConfig = {    
    // ===========================
    // UI DEFAULTS
    // ===========================

    // Default Language ('en' or 'id')
    // If user has not selected a language, this one will be used.
    defaultLang: 'en',

    // Default Theme ('light', 'dark', or 'auto')
    // 'auto' will check localStorage first, then system preference
    defaultTheme: 'auto', 

    // Logo Image & Favicon
    // This image will be used for the login page logo AND the browser tab icon.
    logo: 'img/smart-home.svg',
    
    // ===========================
    // FEATURE CONFIGURATION
    // ===========================
    
    // Enable or disable QR Code Login feature
    // true  = Show the 'Scan QR Code' button (Sets Login Protocol to HTTPS)
    // false = Hide the 'Scan QR Code' button (Sets Login Protocol to HTTP)
    enableQRCode: true,
};
