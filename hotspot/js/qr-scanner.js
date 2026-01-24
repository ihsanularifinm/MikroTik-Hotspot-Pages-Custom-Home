/**
 * QR Code Scanner for MikroTik Hotspot Login
 * Uses html5-qrcode library for camera-based QR scanning
 * Expected QR format: username:password
 */

let html5QrcodeScanner = null;
let isScanning = false;

const placeholderHTML = `
<div class="text-gray-400 dark:text-gray-600 flex flex-col items-center animate-pulse">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-32 w-32 opacity-50">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
    </svg>
</div>
`;

function showPlaceholder(force = false) {
    const container = document.getElementById('qr-scanner-container');
    // Ensure container exists. If force is true, functionality to overwrite video/canvas.
    // If not force, only show if no video active.
    if (container) {
        if (force || !container.querySelector('video')) {
            container.innerHTML = placeholderHTML;
        }
    }
}

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
// Initialized flag
let isScannerInitialized = false;

// UI Elements
let btnToggleCamera = null;
let txtToggleCamera = null;
let btnUploadQr = null;
let inpFileQr = null;
let placeholderIcon = null; // Optional: If we want to show placeholder when camera is off

/**
 * Initialize QR Scanner Controls
 * Called every time modal is created/recreated
 */
function initQRControls() {
    // Skip if already initialized for THIS modal instance
    if (isScannerInitialized) return;

    btnToggleCamera = document.getElementById('btn-toggle-camera');
    txtToggleCamera = document.getElementById('txt-toggle-camera');
    btnUploadQr = document.getElementById('btn-upload-qr');
    inpFileQr = document.getElementById('inp-file-qr');

    // Toggle Camera Listener
    if (btnToggleCamera) {
        btnToggleCamera.onclick = () => {
             if (isScanning) {
                 stopQRScanner(false); // Stop but keep modal open
             } else {
                 startCameraInternal();
             }
        };
    }

    // Upload Listener
    if (btnUploadQr && inpFileQr) {
        btnUploadQr.onclick = () => inpFileQr.click();
        
        inpFileQr.onchange = async (e) => {
            if (e.target.files.length === 0) return;
            const file = e.target.files[0];
            
            // 1. Prioritize Upload: Stop Camera if running
            if (isScanning && html5QrcodeScanner) {
                try {
                    await html5QrcodeScanner.stop();
                    isScanning = false;
                    updateUIState(false); // Switch button back to "Start Camera"
                    console.log('Camera stopped for file upload');
                } catch (err) {
                    console.warn("Failed to stop camera before file scan", err);
                }
            }
            
            // 2. UI Feedback
            updateStatus(getTranslation('scan_file_scanning') || 'Scanning file...', 'text-blue-500 animate-pulse');

            if (!html5QrcodeScanner) initQRScanner();
            
            // 3. Scan File
            html5QrcodeScanner.scanFileV2(file, true)
            .then(decodedResult => {
                 onScanSuccess(decodedResult.decodedText, decodedResult);
            })
            .catch(err => {
                console.error("File scan error", err);
                updateStatus(getTranslation('scan_no_qr') || 'No QR Code found in image', 'text-red-500 animate-pulse');
                
                // Restore status to Inactive (User must manually restart camera if desired)
                setTimeout(() => {
                    updateStatus(getTranslation('scan_status_inactive') || 'Camera is inactive', 'text-gray-500 animate-pulse');
                    // Reset View to Placeholder (Force clear preview)
                    showPlaceholder(true);
                }, 3000);
            });
        };
    }
    
    // Close Button Listener
    const closeBtn = document.getElementById('qr-scanner-close');
    if (closeBtn) {
        closeBtn.onclick = () => stopQRScanner(true);
    }
    
    // Close on Modal Background Click
    const scannerModal = document.getElementById('qr-scanner-modal');
    if (scannerModal) {
        scannerModal.onclick = (e) => {
            // Only close if clicking the background (modal itself), not its children
            if (e.target === scannerModal) {
                stopQRScanner(true);
            }
        };
    }
    
    isScannerInitialized = true;
}

/**
 * Update Status Message
 */
function updateStatus(msg, className) {
    const statusEl = document.getElementById('qr-scan-status');
    if (statusEl) {
        statusEl.textContent = msg;
        statusEl.className = `text-center my-2 text-sm ${className || 'text-gray-500'}`;
    }
}


/**
 * Start QR Scanner (Entry Point)
 */
function startQRScanner() {
    let scannerModal = document.getElementById('qr-scanner-modal');
    
    // If modal was removed, recreate it
    if (!scannerModal) {
        const modalHTML = `
                <div id="qr-scanner-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="bg-white dark:bg-gray-800 rounded-lg max-w-sm w-full p-4 shadow-2xl relative">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200" data-i18n="scan_qr_title">Scan QR Code</h3>
                        <button id="qr-scanner-close" type="button" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-50 relative cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div id="qr-scanner-container" class="w-full aspect-square bg-gray-100 dark:bg-gray-900/50 rounded-md overflow-hidden flex items-center justify-center relative border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <div class="text-gray-400 dark:text-gray-600 flex flex-col items-center animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-32 w-32 opacity-50">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                            </svg>
                        </div>
                    </div>
                    <p id="qr-scan-status" class="text-center text-gray-500 dark:text-gray-400 my-2 text-sm" data-i18n="scanning">Point camera at QR code...</p>
                    <div class="flex flex-col gap-2">
                        <button type="button" id="btn-toggle-camera" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none flex items-center justify-center gap-2 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                            <span id="txt-toggle-camera" data-i18n="btn_start_camera">Start Camera</span>
                        </button>
                        <button type="button" id="btn-upload-qr" class="w-full bg-gray-200 dark:bg-gray-700/50 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-xl transition-all duration-200 border border-gray-400 dark:border-gray-600 border-dashed hover:border-gray-500 dark:hover:border-gray-500 flex items-center justify-center gap-2 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            <span data-i18n="btn_upload_qr">Scan Image File</span>
                        </button>
                        <input type="file" id="inp-file-qr" accept="image/*" class="hidden" />
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        scannerModal = document.getElementById('qr-scanner-modal');
        
        // Reattach close button listener
        const closeBtn = document.getElementById('qr-scanner-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => stopQRScanner(true));
        }
    }
    
    // Apply i18n if available (Ensure text is updated even if modal was static)
    if (typeof applyTranslations === 'function' && typeof getCurrentLang === 'function') {
        applyTranslations(getCurrentLang());
    }
    
    // Initialize controls if needed
    initQRControls();

    // 1. DETERMINE MODE
    let mode = 'internal'; // Default
    
    if (typeof hotspotConfig !== 'undefined') {
        if (hotspotConfig.qrMode === 'external') {
            mode = 'external';
        } else if (hotspotConfig.qrMode === 'auto') {
            if (window.location.protocol === 'http:') {
                mode = 'external';
            } else {
                mode = 'internal';
            }
        }
    }

    // 2. EXECUTE MODE
    // Toggle Internal Controls Visibility
    // In External Mode: Hide Camera Button (Start/Stop), Keep Upload Button
    const btnCamera = document.getElementById('btn-toggle-camera');
    
    if (mode === 'external') {
        if (btnCamera) btnCamera.classList.add('hidden');
        updateStatus(getTranslation('scan_status_use_external') || 'Using external scanner', 'text-gray-500 animate-pulse');
    } else {
        if (btnCamera) btnCamera.classList.remove('hidden');
    }

    if (mode === 'external') {
        // EXTERNAL MODE: Check Walled Garden using WebSocket (Anti-Cache)
        console.log('[QR Scanner] External mode - WebSocket check approach');
        
        if (typeof hotspotConfig !== 'undefined' && hotspotConfig.qrExternalUrl) {
             if (scannerModal) {
                 scannerModal.classList.remove('hidden');
                 const container = document.getElementById('qr-scanner-container');
                 
                 // Show checking state first
                 if (container) {
                    // Handled by runWGCheck, but ensures container exists
                 }
                 
                 // --- Helper Functions in Scope ---

                 const showSuccess = () => {
                     // Load Iframe as background + Open Button
                     console.log('[QR Scanner] Loading iframe background...');
                     if (container) {
                        // Enforce relative positioning
                        container.style.position = 'relative';
                        container.classList.add('relative');

                        // encode current URL to pass as return target
                        const returnUrl = encodeURIComponent(window.location.href);
                        
                        // Pass Theme and Language settings to external scanner
                        const currentTheme = localStorage.getItem('color-theme') || 'light';
                        const currentLang = (typeof getCurrentLang === 'function') ? getCurrentLang() : 'en';
                        
                        const finalScannerUrl = `${hotspotConfig.qrExternalUrl}?return=${returnUrl}&theme=${currentTheme}&lang=${currentLang}`;
                        
                        // Use consistent layout with Failure state
                        container.innerHTML = `
                            <!-- Background Iframe (Visual Proof) -->
                            <iframe src="${finalScannerUrl}" 
                                class="absolute inset-0 w-full h-full object-cover border-0 opacity-40 blur-[2px] pointer-events-none" 
                                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                                tabindex="-1"
                                title="Scanner Preview">
                            </iframe>
                            
                            <!-- Overlay Content -->
                            <div class="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                                <div class="mb-2 flex justify-center">
                                    <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-full shadow-sm">
                                        <svg class="w-6 h-6 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </div>
                                </div>
                                <p class="text-gray-800 dark:text-white font-bold mb-4 text-lg drop-shadow-md">
                                    ${getTranslation('scan_status_ready_external') || 'Scanner Available'}
                                </p>
                                
                                <button id="btn-open-external" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:shadow-green-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2 group mb-1 cursor-pointer">
                                    <span>${getTranslation('btn_open_scanner') || 'Open Scanner'}</span>
                                    <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </button>
                                
                                <p class="text-gray-400 text-[10px] mt-2 animate-pulse">
                                    ${getTranslation('scan_status_use_external') || 'Please use the external scanner.'}
                                </p>
                            </div>
                        `;
                        
                        // Handle Navigation
                        document.getElementById('btn-open-external').onclick = () => {
                            window.location.href = finalScannerUrl;
                        };
                        
                        // Update external status text (Success - Green)
                        updateStatus(getTranslation('status_connection_success') || 'Connection Successful', 'text-green-500 font-bold animate-pulse');
                     }
                 };

                 const showFailure = (reason) => {
                     console.log('[QR Scanner] CHECK FAILED -', reason);
                     if (container) {
                        // Enforce relative positioning strictly
                        container.style.position = 'relative';
                        container.classList.add('relative');

                        // Custom "Sad File" SVG
                        const sadFileSVG = `
                        <svg class="w-32 h-32 text-gray-300 dark:text-gray-600 opacity-50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 13.5H9.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M15 13.5H15.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M9 17C9 17 10.5 16 12 16C13.5 16 15 17 15 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V9M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        `;

                        // Background Icon (Sad File) - Inside the frame
                        container.innerHTML = `
                            <div class="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none" style="position: absolute; top: 0; left: 0;">
                                ${sadFileSVG}
                            </div>

                            <!-- Overlay Content -->
                            <div class="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                                <p class="text-gray-800 dark:text-white font-semibold mb-1 text-sm drop-shadow-md">
                                    ${getTranslation('wg_error_title') || 'External connection failed.'}
                                </p>
                                <p class="text-gray-600 dark:text-gray-300 text-xs mb-4 drop-shadow-md">
                                    ${getTranslation('wg_error_desc') || 'Is Walled Garden configured?'}
                                </p>
                                
                                <button id="btn-retry-wg" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all active:scale-95 mb-1 cursor-pointer">
                                    ${getTranslation('try_again') || 'Try Again'}
                                </button>
                                
                                <p class="text-gray-400 text-[10px] mt-2 animate-pulse">
                                    ${getTranslation('wg_error_help') || 'Please contact Admin for assistance.'}
                                </p>
                            </div>
                        `;
                        
                        // Re-bind Try Again button
                        document.getElementById('btn-retry-wg').onclick = () => {
                             runWGCheck();
                        };
                        
                        updateStatus(getTranslation('scan_status_connection_failed') || 'Connection Failed', 'text-red-500 font-bold animate-pulse');
                     }
                 };

                 // Run WebSocket Check
                 const runWGCheck = () => {
                     console.log('[QR Scanner] Running WebSocket check...');
                     
                     if (!container) return;

                     // Render Loading State
                     container.innerHTML = `
                         <div class="flex flex-col items-center justify-center h-full text-gray-500 cursor-wait">
                             <svg class="animate-spin h-10 w-10 text-blue-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                 <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                 <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                             </svg>
                             <p class="animate-pulse text-sm font-medium text-gray-600 dark:text-gray-300">
                                 ${getTranslation('checking_connection') || 'Checking connection...'}
                             </p>
                         </div>
                     `;
                     
                     const startTime = Date.now();
                     
                     // Helper to enforce minimum loading time
                     const finishCheck = (isSuccess, arg) => {
                        const minTime = 1500; // 1.5s min load time
                        const elapsed = Date.now() - startTime;
                        const remaining = Math.max(0, minTime - elapsed);
                        
                        setTimeout(() => {
                           if (isSuccess) showSuccess();
                           else showFailure(arg);
                        }, remaining);
                     };

                     // Construct WS URL
                     try {
                         const scannerUrlObj = new URL(hotspotConfig.qrExternalUrl);
                         const wsProtocol = scannerUrlObj.protocol === 'https:' ? 'wss:' : 'ws:';
                         const wsUrl = wsProtocol + '//' + scannerUrlObj.host + '/ws';
                         
                         console.log('[QR Scanner] WS URL:', wsUrl);
                         
                         const ws = new WebSocket(wsUrl);
                         let isConnected = false;
                         
                         // Timeout constraint
                         const wsTimeout = setTimeout(() => {
                            if (!isConnected) {
                                console.log('[QR Scanner] WS Timeout');
                                ws.close();
                                finishCheck(false, 'Timeout');
                            }
                         }, 3000); // 3s max wait
                         
                         ws.onopen = () => {
                             isConnected = true;
                             clearTimeout(wsTimeout);
                             console.log('[QR Scanner] WS Connected - WG OPEN');
                             ws.close(); 
                             finishCheck(true);
                         };
                         
                         ws.onerror = (e) => {
                             if (!isConnected) {
                                 clearTimeout(wsTimeout);
                                 console.log('[QR Scanner] WS Error - WG CLOSED');
                                 finishCheck(false, 'Connection Error');
                             }
                         };
                         
                     } catch (e) {
                         console.error('[QR Scanner] URL Error:', e);
                         finishCheck(false, 'Config Error');
                     }
                 };
                 
                 // Run check immediately
                 setTimeout(runWGCheck, 200);
            }
        } else {
            showScanError('Configuration Error: No External URL');
        }

    } else {
        // INTERNAL MODE
        if (scannerModal) scannerModal.classList.remove('hidden');
        
        // Ensure scanner is stopped initially
        if (html5QrcodeScanner && isScanning) {
            stopQRScanner(false);
        }
        
        // Reset UI to 'Start' state
        updateUIState(false);
        updateStatus(getTranslation('scan_status_inactive') || 'Camera is inactive', 'text-gray-500 animate-pulse');
        showPlaceholder(); // SHOW ICON INITIALLY
    }
}

/**
 * Start Camera Internal Logic
 */
function startCameraInternal() {
    if (!html5QrcodeScanner) initQRScanner();
    if (!html5QrcodeScanner) return;

    updateStatus(getTranslation('scan_status_starting') || 'Starting camera...', 'text-gray-500 animate-pulse');

    const config = { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
    };

    html5QrcodeScanner.start(
        { facingMode: "environment" }, 
        config,
        onScanSuccess,
        onScanFailure
    ).then(() => {
        isScanning = true;
        updateUIState(true);
        updateStatus(getTranslation('scanning') || 'Point camera at QR Code', 'text-green-500 animate-pulse');
    }).catch((err) => {
        console.error('Failed to start scanner:', err);
        let errorKey = 'camera_permission';
        if (err.name === 'NotAllowedError') {
            errorKey = 'camera_permission';
        } else if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
            errorKey = 'camera_error';
        }
        showScanError(errorKey);
        updateUIState(false);
    });
}

/**
 * Stop QR Scanner
 * @param {boolean} closeModal - Whether to close the modal as well
 */
function stopQRScanner(closeModal = true) {
    const scannerModal = document.getElementById('qr-scanner-modal');
    
    if (html5QrcodeScanner && isScanning) {
        html5QrcodeScanner.stop().then(() => {
            console.log('Scanner stopped');
            updateUIState(false);
            updateStatus(getTranslation('scan_status_stopped') || 'Camera stopped', 'text-gray-500 animate-pulse');
            showPlaceholder(); // RESTORE ICON
        }).catch((err) => {
            console.log('Error stopping scanner:', err);
            // Force state update even if error
            updateUIState(false);
            showPlaceholder(); // RESTORE ICON FORCE
        });
    } else {
        updateUIState(false);
        showPlaceholder(); // RESTORE ICON
    }
    
    isScanning = false;
    
    if (closeModal && scannerModal) {
        scannerModal.remove(); // DELETE from DOM instead of hiding
        isScannerInitialized = false; // Reset flag so it re-initializes on next open
    }
}

/**
 * Update UI State (Buttons/Icons)
 */
function updateUIState(cameraRunning) {
    if (btnToggleCamera && txtToggleCamera) {
        // Toggle Icon
        const iconSvg = btnToggleCamera.querySelector('svg');
        if (iconSvg) {
            if (cameraRunning) {
                // Change to Heroicons - Video Camera Slash (Stop)
                iconSvg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 0 1-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 0 0-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409" />';
            } else {
                // Change to Heroicons - Video Camera (Start)
                iconSvg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />';
            }
        }

        if (cameraRunning) {
            txtToggleCamera.textContent = getTranslation('btn_stop_camera') || 'Stop Camera';
            btnToggleCamera.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            btnToggleCamera.classList.add('bg-red-600', 'hover:bg-red-700');
        } else {
            txtToggleCamera.textContent = getTranslation('btn_start_camera') || 'Start Camera';
            btnToggleCamera.classList.remove('bg-red-600', 'hover:bg-red-700');
            btnToggleCamera.classList.add('bg-blue-600', 'hover:bg-blue-700');
        }
    }
}

// ... existing onScanSuccess, onScanFailure code ...


/**
 * Handle successful QR scan
 * @param {string} decodedText - The decoded QR code text
 * @param {object} decodedResult - Additional scan result data
 */
function onScanSuccess(decodedText, decodedResult) {
    console.log('QR Code scanned:', decodedText);
    
    // Parse QR content (expected format: username:password)
    const credentials = parseQRCredentials(decodedText);
    
    if (credentials) {
        // Auto-fill form (behind the scenes)
        fillLoginForm(credentials.username, credentials.password);
        
        // Show success message
        showScanSuccess();
        
        // Delay closing and submitting to let user see the success state/image
        setTimeout(() => {
            stopQRScanner(true); // Close modal
            autoSubmitLogin();   // Submit form
        }, 1500); 
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
        statusEl.className = 'text-center text-green-500 my-2';
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
        statusEl.className = 'text-center text-red-500 my-2';
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
    
    // Note: Close button and background click handlers are now attached 
    // in initQRControls() which runs on every modal open/recreation
});
