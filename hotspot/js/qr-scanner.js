/**
 * QR Code Scanner for MikroTik Hotspot Login
 * Uses html5-qrcode library for camera-based QR scanning
 * Expected QR format: username:password
 */

let html5QrcodeScanner = null;
let isScanning = false;

/**
 * Initialize QR Scanner
 */
function initQRScanner() {
    const scannerContainer = document.getElementById('qr-scanner-container');
    const scannerModal = document.getElementById('qr-scanner-modal');
    
    if (!scannerContainer || !scannerModal) {
        console.error('QR Scanner elements not found');
        return;
    }

    // Check if library is loaded
    if (typeof Html5Qrcode === 'undefined') {
        console.error('html5-qrcode library not loaded');
        showScanError('QR Scanner library not available');
        return;
    }

    html5QrcodeScanner = new Html5Qrcode('qr-scanner-container');
}

/**
 * Start QR Scanner
 */
function startQRScanner() {
    const scannerModal = document.getElementById('qr-scanner-modal');
    const scanBtn = document.getElementById('scan-qr-btn');
    
    if (!html5QrcodeScanner) {
        initQRScanner();
    }

    if (!html5QrcodeScanner) {
        return;
    }

    // Show modal
    scannerModal.classList.remove('hidden');
    isScanning = true;

    // Scanner config
    const config = { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
    };

    // Start scanning
    html5QrcodeScanner.start(
        { facingMode: "environment" }, // Use back camera
        config,
        onScanSuccess,
        onScanFailure
    ).catch((err) => {
        console.error('Failed to start scanner:', err);
        // Check for common errors
        let errorKey = 'camera_permission';
        if (err.name === 'NotAllowedError') {
            errorKey = 'camera_permission';
        } else if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
            errorKey = 'camera_error'; // Likely HTTP issue
        }
        
        showScanError(errorKey);
        // Do NOT stop immediately so user sees the error
        // stopQRScanner(); 
    });
}

/**
 * Stop QR Scanner
 */
function stopQRScanner() {
    const scannerModal = document.getElementById('qr-scanner-modal');
    
    if (html5QrcodeScanner && isScanning) {
        html5QrcodeScanner.stop().then(() => {
            console.log('Scanner stopped');
        }).catch((err) => {
            console.log('Error stopping scanner:', err);
        });
    }
    
    isScanning = false;
    scannerModal.classList.add('hidden');
}

/**
 * Handle successful QR scan
 * @param {string} decodedText - The decoded QR code text
 * @param {object} decodedResult - Additional scan result data
 */
function onScanSuccess(decodedText, decodedResult) {
    console.log('QR Code scanned:', decodedText);
    
    // Stop scanning immediately
    stopQRScanner();
    
    // Parse QR content (expected format: username:password)
    const credentials = parseQRCredentials(decodedText);
    
    if (credentials) {
        // Auto-fill form
        fillLoginForm(credentials.username, credentials.password);
        
        // Show success message briefly then auto-submit
        showScanSuccess();
        
        // Auto-submit after short delay
        setTimeout(() => {
            autoSubmitLogin();
        }, 500);
    } else {
        showScanError('scan_error');
    }
}

/**
 * Handle scan failure (called for each frame without QR)
 * @param {string} error - Error message
 */
function onScanFailure(error) {
    // Ignore - this is called for every frame without QR
    // console.log('Scan failure:', error);
}

/**
 * Parse QR code content to extract credentials
 * Supports formats:
 * - username:password
 * - http://hotspot/login?username=X&password=Y
 * @param {string} text - QR code text
 * @returns {object|null} - { username, password } or null if invalid
 */
function parseQRCredentials(text) {
    if (!text || text.trim().length === 0) {
        return null;
    }
    
    text = text.trim();
    
    // Try URL format first
    if (text.startsWith('http://') || text.startsWith('https://')) {
        try {
            const url = new URL(text);
            const username = url.searchParams.get('username') || url.searchParams.get('user');
            const password = url.searchParams.get('password') || url.searchParams.get('pass');
            
            if (username && password) {
                return { username, password };
            }
        } catch (e) {
            // Not a valid URL, try other formats
        }
    }
    
    	// Try simple format: username:password
	const colonIndex = text.indexOf(':');
	if (colonIndex > 0 && colonIndex < text.length - 1) {
		const username = text.substring(0, colonIndex);
		const password = text.substring(colonIndex + 1);
		
		// Basic validation - no empty values
		if (username.length > 0 && password.length > 0) {
			return { username, password };
		}
	} else {
		// No separator? Assume User = Password
		if (text.length > 0) {
			return { username: text, password: text };
		}
	}
	
	return null;
}

/**
 * Fill login form with credentials
 * @param {string} username 
 * @param {string} password 
 */
function fillLoginForm(username, password) {
	// Auto-switch mode based on credentials
	if (typeof switchLoginMode === 'function') {
		if (username !== password) {
			// Different user/pass -> Force Dual Mode
			switchLoginMode('dual');
		} else {
			// Same user/pass -> Force Single Mode
			switchLoginMode('single');
		}
	}

	// Target all potential inputs
	const usernameInput = document.getElementById('username-input');
	const passwordInput = document.getElementById('password-input-dual');
	const userEqPassInput = document.getElementById('user-eq-pass-input');
	
	// Fill Dual Mode inputs
	if (usernameInput) usernameInput.value = username;
	if (passwordInput) passwordInput.value = password;

	// Fill Single Mode input (User = Password)
	if (userEqPassInput) userEqPassInput.value = username;
}

/**
 * Auto-submit the login form
 */
function autoSubmitLogin() {
    // Try to find the submit button
    const submitBtn = document.querySelector('input[type="submit"]');
    
    if (submitBtn) {
        // This is the safest way as it triggers onsubmit events (like prepareSubmit)
        submitBtn.click();
    } else {
        // Fallback if button not found
        if (typeof prepareSubmit === 'function') {
            if (prepareSubmit()) {
                 if (typeof doLogin === 'function') {
                    doLogin();
                 } else {
                    document.forms['login'].submit();
                 }
            }
        } else if (typeof doLogin === 'function') {
            doLogin();
        } else {
            document.forms['login'].submit();
        }
    }
}

/**
 * Show scan success message
 */
function showScanSuccess() {
    const statusEl = document.getElementById('qr-scan-status');
    if (statusEl) {
        statusEl.textContent = getTranslation('scan_success') || 'QR Code detected!';
        statusEl.className = 'text-center text-green-500 mt-2';
    }
}

/**
 * Show scan error message
 * @param {string} errorKey - Translation key for error message
 */
function showScanError(errorKey) {
    const statusEl = document.getElementById('qr-scan-status');
    if (statusEl) {
        statusEl.textContent = getTranslation(errorKey) || 'Invalid QR Code';
        statusEl.className = 'text-center text-red-500 mt-2';
    }
}

/**
 * Get translation for key (uses app.js translations if available)
 * @param {string} key - Translation key
 * @returns {string} - Translated text or key if not found
 */
function getTranslation(key) {
    // Check if translations are available from app.js (GLOBAL SCOPE)
    if (typeof window.translations !== 'undefined' && typeof window.getCurrentLang === 'function') {
        const currentLang = window.getCurrentLang();
        const langTranslations = window.translations[currentLang];
        if (langTranslations && langTranslations[key]) {
            return langTranslations[key];
        }
    }
    return null;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check Configuration
    if (typeof hotspotConfig !== 'undefined' && hotspotConfig.enableQRCode === false) {
        // Feature disabled - hide the button
        const scanBtn = document.getElementById('scan-qr-btn');
        if (scanBtn) {
            // scanBtn.style.display = 'none'; 
            // Better to use Tailwind class if available, or style
            scanBtn.classList.add('hidden');
        }
        
        // Also hide the divider
        const divEl = document.getElementById('qr-divider');
        if (divEl) {
            divEl.classList.add('hidden');
        }

        return; // Do not initialize scanner
    }

    // Add click handler for scan button
    const scanBtn = document.getElementById('scan-qr-btn');
    if (scanBtn) {
        scanBtn.addEventListener('click', startQRScanner);
    }
    
    // Add click handler for close button
    const closeBtn = document.getElementById('qr-scanner-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', stopQRScanner);
    }
    
    // Close on modal background click
    const modal = document.getElementById('qr-scanner-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                stopQRScanner();
            }
        });
    }
});
