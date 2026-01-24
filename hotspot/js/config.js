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
    // true  = Show the 'Scan QR Code' button (Sets Login Protocol to HTTPS if internal)
    // false = Hide the 'Scan QR Code' button
    enableQRCode: true,

    // QR Code Scanner Mode
    // 'auto'     = Safe default. Uses 'internal' if HTTPS, 'external' if HTTP.
    // 'internal' = Forces internal scanner (Requires HTTPS).
    // 'external' = Forces redirection to external scanner (Works on HTTP via Walled Garden).
    qrMode: 'auto',

    // External Scanner URL
    // The URL where the external scanner is hosted (e.g., GitHub Pages).
    // MUST be added to Walled Garden in MikroTik!
    qrExternalUrl: 'https://my-qr-as1.pages.dev/scanner/',
};
