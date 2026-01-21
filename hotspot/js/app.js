document.addEventListener('DOMContentLoaded', () => {
	// =====================
	// THEME TOGGLE (Dark Mode)
	// =====================
	const themeToggleButton = document.getElementById('theme-toggle');
	const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
	const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

	const applyTheme = () => {
		let isDark = false;
		
		// 1. Check LocalStorage
		if ('color-theme' in localStorage) {
			isDark = localStorage.getItem('color-theme') === 'dark';
		} else {
			// 2. Check Config
			if (typeof hotspotConfig !== 'undefined') {
				if (hotspotConfig.defaultTheme === 'dark') {
					isDark = true;
				} else if (hotspotConfig.defaultTheme === 'light') {
					isDark = false;
				} else {
					// auto or undefined -> check system
					isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
				}
			} else {
				// Fallback to system
				isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			}
		}

		if (isDark) {
			document.documentElement.classList.add('dark');
			if (themeToggleLightIcon) themeToggleLightIcon.classList.add('hidden');
			if (themeToggleDarkIcon) themeToggleDarkIcon.classList.remove('hidden');
		} else {
			document.documentElement.classList.remove('dark');
			if (themeToggleDarkIcon) themeToggleDarkIcon.classList.add('hidden');
			if (themeToggleLightIcon) themeToggleLightIcon.classList.remove('hidden');
		}
	};

	if (themeToggleButton) {
		themeToggleButton.addEventListener('click', () => {
			const isDark = document.documentElement.classList.toggle('dark');
			localStorage.setItem('color-theme', isDark ? 'dark' : 'light');

			if (themeToggleDarkIcon) themeToggleDarkIcon.classList.toggle('hidden');
			if (themeToggleLightIcon) themeToggleLightIcon.classList.toggle('hidden');
		});
	}

	applyTheme();

	// =====================
	// LANGUAGE TOGGLE (i18n)
	// =====================
	window.translations = {
		en: {
			// Page titles
			'page_login': 'Internet Hotspot - Log in',
			'page_status': 'Internet Hotspot - Status',
			'page_logout': 'Internet Hotspot - Log out',
			'page_error': 'Internet Hotspot - Error',
			'page_redirect': 'Internet Hotspot - Redirect',
			'page_advert': 'Internet Hotspot - Advertisement',

			// Login page
			'login_prompt': 'Please log in to use the internet hotspot service.',
			'login_trial': 'Free trial available,',
			'login_trial_link': 'click here',
			'tab_single': 'User = Password',
			'tab_dual': 'User & Password',
			'user_eq_pass_placeholder': 'User = Password',
			'username_placeholder': 'Username',
			'password_placeholder': 'Password',
			'login_btn': 'Connect',
			'powered_by': 'Powered by MikroTik RouterOS',
			'or_divider': 'or',
			'scan_qr_btn': 'Scan QR Code',
			'scan_qr_title': 'Scan QR Code',
			'scanning': 'Point camera at QR code...',
			'scan_success': 'QR Code detected!',
			'scan_error': 'Invalid QR Code format',
			'camera_error': 'Camera access failed (HTTPS required)',
			'camera_permission': 'Please allow camera access',

			// Status page
			'trial_status': 'Trial User Status',
			'connection_status': 'Connection Status',
			'ip_address': 'IP address',
			'bytes_up_down': 'Bytes up / down',
			'connected_left': 'Connected / left',
			'connected': 'Connected',
			'status_refresh': 'Status refresh',
			'ad_required': 'Ad required',
			'logout_btn': 'Log out',
			'continue_btn': 'Continue',

			// Logout page
			'logout_title': 'You have just logged out!',
			'username_label': 'Username',
			'mac_address': 'MAC address',
			'session_time': 'Session time',
			'time_left': 'Time left',
			'relogin_btn': 'Log in again',
			'login_new_btn': 'Log in',
			'logout_login_btn': 'Log in',
			'logout_clear_btn': 'Log out & Clear',

			// Error page
			'error_title': 'Hotspot Error',
			'try_again': 'Try Again',

			// Alogin page (success)
			'login_success': 'Login Successful',
			'redirect_msg': 'You will be redirected shortly. If nothing happens, click',
			'here': 'here',

			// Radvert page
			'advertisement': 'Advertisement',
			'open_ad_manual': 'If nothing happens, open',
			'manually': 'manually',

			// Error messages from errors.txt
			'err_internal': 'internal error',
			'err_config': 'configuration error',
			'err_not_logged_in': 'you are not logged in',
			'err_ippool_empty': 'cannot assign ip address - no more free addresses from pool',
			'err_shutting_down': 'hotspot service is shutting down',
			'err_session_limit': 'no more sessions are allowed for user',
			'err_license_limit': 'session limit reached',
			'err_wrong_mac': 'invalid username: this MAC address is not yours',
			'err_chap_missing': 'web browser did not send challenge response (try again, enable JavaScript)',
			'err_invalid_username': 'invalid username or password',
			'err_invalid_mac': 'is not allowed to log in from this MAC address',
			'err_uptime_limit': 'has reached uptime limit',
			'err_traffic_limit': 'has reached traffic limit',
			'err_radius_timeout': 'RADIUS server is not responding',
			'err_auth_progress': 'already authorizing, retry later'
		},
		id: {
			// Page titles
			'page_login': 'Internet Hotspot - Masuk',
			'page_status': 'Internet Hotspot - Status',
			'page_logout': 'Internet Hotspot - Keluar',
			'page_error': 'Internet Hotspot - Kesalahan',
			'page_redirect': 'Internet Hotspot - Pengalihan',
			'page_advert': 'Internet Hotspot - Iklan',

			// Login page
			'login_prompt': 'Silakan masuk untuk menggunakan layanan internet hotspot.',
			'login_trial': 'Uji coba gratis tersedia,',
			'login_trial_link': 'klik di sini',
			'tab_single': 'User = Password',
			'tab_dual': 'User & Password',
			'user_eq_pass_placeholder': 'Nama pengguna = Kata sandi',
			'username_placeholder': 'Nama pengguna',
			'password_placeholder': 'Kata sandi',
			'login_btn': 'Sambungkan',
			'powered_by': 'Didukung oleh MikroTik RouterOS',
			'or_divider': 'atau',
			'scan_qr_btn': 'Pindai Kode QR',
			'scan_qr_title': 'Pindai Kode QR',
			'scanning': 'Arahkan kamera ke kode QR...',
			'scan_success': 'Kode QR terdeteksi!',
			'scan_error': 'Format kode QR tidak valid',
			'camera_error': 'Akses kamera gagal (HTTPS diperlukan)',
			'camera_permission': 'Izinkan akses kamera',

			// Status page
			'trial_status': 'Status Pengguna Uji Coba',
			'connection_status': 'Status Koneksi',
			'ip_address': 'Alamat IP',
			'bytes_up_down': 'Bytes naik / turun',
			'connected_left': 'Terhubung / sisa',
			'connected': 'Terhubung',
			'status_refresh': 'Refresh status',
			'ad_required': 'Iklan diperlukan',
			'logout_btn': 'Keluar',
			'continue_btn': 'Lanjutkan',

			// Logout page
			'logout_title': 'Anda baru saja keluar!',
			'username_label': 'Nama pengguna',
			'mac_address': 'Alamat MAC',
			'session_time': 'Waktu sesi',
			'time_left': 'Sisa waktu',
			'relogin_btn': 'Masuk lagi',
			'login_new_btn': 'Masuk',
			'logout_login_btn': 'Masuk',
			'logout_clear_btn': 'Keluar & Hapus Sesi',

			// Error page
			'error_title': 'Kesalahan Hotspot',
			'try_again': 'Coba Lagi',

			// Alogin page (success)
			'login_success': 'Berhasil Masuk',
			'redirect_msg': 'Anda akan segera dialihkan. Jika tidak terjadi apa-apa, klik',
			'here': 'di sini',

			// Radvert page
			'advertisement': 'Iklan',
			'open_ad_manual': 'Jika tidak terjadi apa-apa, buka',
			'manually': 'secara manual',

			// Error messages from errors.txt
			'err_internal': 'kesalahan internal',
			'err_config': 'kesalahan konfigurasi',
			'err_not_logged_in': 'Anda belum masuk',
			'err_ippool_empty': 'tidak dapat menetapkan alamat IP - tidak ada lagi alamat tersedia',
			'err_shutting_down': 'layanan hotspot sedang dimatikan',
			'err_session_limit': 'tidak ada lagi sesi yang diizinkan untuk pengguna',
			'err_license_limit': 'batas sesi tercapai',
			'err_wrong_mac': 'nama pengguna tidak valid: alamat MAC ini bukan milik Anda',
			'err_chap_missing': 'browser tidak mengirim respons (coba lagi, aktifkan JavaScript)',
			'err_invalid_username': 'nama pengguna atau kata sandi salah',
			'err_invalid_mac': 'tidak diizinkan masuk dari alamat MAC ini',
			'err_uptime_limit': 'telah mencapai batas waktu aktif',
			'err_traffic_limit': 'telah mencapai batas lalu lintas',
			'err_radius_timeout': 'server RADIUS tidak merespons',
			'err_auth_progress': 'sedang mengotorisasi, coba lagi nanti'
		}
	};

	// Error message mappings (English -> key)
	const errorMappings = [
		{ pattern: /internal error/i, key: 'err_internal' },
		{ pattern: /configuration error/i, key: 'err_config' },
		{ pattern: /you are not logged in/i, key: 'err_not_logged_in' },
		{ pattern: /cannot assign ip address/i, key: 'err_ippool_empty' },
		{ pattern: /hotspot service is shutting down/i, key: 'err_shutting_down' },
		{ pattern: /no more sessions are allowed/i, key: 'err_session_limit' },
		{ pattern: /session limit reached/i, key: 'err_license_limit' },
		{ pattern: /this MAC address is not yours/i, key: 'err_wrong_mac' },
		{ pattern: /did not send challenge response/i, key: 'err_chap_missing' },
		{ pattern: /invalid username or password/i, key: 'err_invalid_username' },
		{ pattern: /not allowed to log in from this MAC/i, key: 'err_invalid_mac' },
		{ pattern: /has reached uptime limit/i, key: 'err_uptime_limit' },
		{ pattern: /has reached traffic limit/i, key: 'err_traffic_limit' },
		{ pattern: /RADIUS server is not responding/i, key: 'err_radius_timeout' },
		{ pattern: /already authorizing/i, key: 'err_auth_progress' }
	];

	const langToggleButton = document.getElementById('lang-toggle');
	const langIconEn = document.getElementById('lang-icon-en');
	const langIconId = document.getElementById('lang-icon-id');

	window.getCurrentLang = () => {
		const storedLang = localStorage.getItem('language');
		if (storedLang) return storedLang;
		
		if (typeof hotspotConfig !== 'undefined' && hotspotConfig.defaultLang) {
			return hotspotConfig.defaultLang;
		}
		return 'en';
	};

	const applyTranslations = (lang) => {
		const t = window.translations[lang];
		if (!t) return;

		// Update page title
		const titleKey = document.querySelector('[data-i18n-title]');
		if (titleKey) {
			const key = titleKey.getAttribute('data-i18n-title');
			if (t[key]) document.title = t[key];
		}

		// Update all elements with data-i18n attribute
		document.querySelectorAll('[data-i18n]').forEach(el => {
			const key = el.getAttribute('data-i18n');
			if (t[key]) {
				if (el.tagName === 'INPUT' && el.type === 'submit') {
					el.value = t[key];
				} else if (el.tagName === 'INPUT' && el.placeholder) {
					el.placeholder = t[key];
				} else {
					el.textContent = t[key];
				}
			}
		});

		// Update placeholders with data-i18n-placeholder
		document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
			const key = el.getAttribute('data-i18n-placeholder');
			if (t[key]) el.placeholder = t[key];
		});

		// Update input values with data-i18n-value
		document.querySelectorAll('[data-i18n-value]').forEach(el => {
			const key = el.getAttribute('data-i18n-value');
			if (t[key]) el.value = t[key];
		});

		// Translate error messages
		document.querySelectorAll('[data-i18n-error]').forEach(el => {
			const originalText = el.getAttribute('data-original-error') || el.textContent;
			
			// Store original on first run
			if (!el.getAttribute('data-original-error')) {
				el.setAttribute('data-original-error', originalText);
			}

			if (lang === 'en') {
				el.textContent = originalText;
			} else {
				let translated = originalText;
				for (const mapping of errorMappings) {
					if (mapping.pattern.test(originalText)) {
						translated = t[mapping.key] || originalText;
						break;
					}
				}
				el.textContent = translated;
			}
		});
	};

	const updateLangIcons = (lang) => {
		if (langIconEn && langIconId) {
			if (lang === 'en') {
				langIconEn.classList.remove('hidden');
				langIconId.classList.add('hidden');
			} else {
				langIconEn.classList.add('hidden');
				langIconId.classList.remove('hidden');
			}
		}
	};

	const applyLanguage = () => {
		const lang = getCurrentLang();
		applyTranslations(lang);
		updateLangIcons(lang);
	};

	if (langToggleButton) {
		langToggleButton.addEventListener('click', () => {
			const currentLang = getCurrentLang();
			const newLang = currentLang === 'en' ? 'id' : 'en';
			localStorage.setItem('language', newLang);
			applyTranslations(newLang);
			updateLangIcons(newLang);
		});
	}

	const configureProtocol = () => {
		if (typeof hotspotConfig === 'undefined') return;

		// Automatic Protocol Logic:
		// Enable QR Code = true  -> Protocol https (Required for camera)
		// Enable QR Code = false -> Protocol http (Default assumption)
		// You can still manually override by adding 'loginProtocol' to config if needed, 
		// but this default behavior covers the standard use case.
		let protocol = hotspotConfig.enableQRCode ? 'https' : 'http';

		// Allow manual override if strictly specified in config
		if (hotspotConfig.loginProtocol) {
			protocol = hotspotConfig.loginProtocol;
		}

		console.log('Login Protocol configured to:', protocol);

		// 1. Update Forms (login, sendin)
		document.querySelectorAll('form').forEach(form => {
			const action = form.getAttribute('action');
			if (action && action.startsWith('http')) {
				form.action = action.replace(/^https?:/, protocol + ':');
			}
		});

		// 2. Update Free Trial Link & other login links
		document.querySelectorAll('a[href*="/login"]').forEach(link => {
			const href = link.getAttribute('href');
			if (href && href.startsWith('http')) {
				link.href = href.replace(/^https?:/, protocol + ':');
			}
		});
	};

	const configureLogo = () => {
		if (typeof hotspotConfig === 'undefined' || !hotspotConfig.logo) return;

		const logoPath = hotspotConfig.logo;

		// 1. Update Main Logo (if element exists)
		const mainLogo = document.getElementById('main-logo');
		if (mainLogo) {
			mainLogo.src = logoPath;
		}

		// 2. Update Favicon (Tab Icon)
		let link = document.querySelector("link[rel~='icon']");
		if (!link) {
			link = document.createElement('link');
			link.rel = 'icon';
			document.getElementsByTagName('head')[0].appendChild(link);
		}
		link.href = logoPath;
	};

	configureLogo();
	configureProtocol();
	applyLanguage();
});
