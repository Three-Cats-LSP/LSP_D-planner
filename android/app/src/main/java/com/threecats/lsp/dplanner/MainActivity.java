package com.threecats.lsp.dplanner;

import android.os.Bundle;
import android.webkit.CookieManager;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Edge-to-edge: app draws behind status and navigation bars
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    }

    @Override
    protected void onResume() {
        super.onResume();
        applyStatusBarFromCookie();
    }

    /**
     * Reads the diveTheme cookie written by JS (toggleTheme saves to document.cookie).
     * This is reliable because CookieManager persists across app restarts.
     * Falls back to dark theme (white icons) if cookie not set.
     */
    private void applyStatusBarFromCookie() {
        try {
            // The WebView URL under Capacitor's androidScheme=https is https://localhost
            String cookies = CookieManager.getInstance().getCookie("https://localhost");
            boolean isLight = false;
            if (cookies != null) {
                for (String part : cookies.split(";")) {
                    String trimmed = part.trim();
                    if (trimmed.startsWith("diveTheme=")) {
                        isLight = trimmed.substring("diveTheme=".length()).trim().equals("light");
                        break;
                    }
                }
            }
            WindowInsetsControllerCompat ctrl =
                new WindowInsetsControllerCompat(getWindow(), getWindow().getDecorView());
            // true = dark icons (readable on light bg), false = white icons (readable on dark bg)
            ctrl.setAppearanceLightStatusBars(isLight);
        } catch (Exception e) {
            // Non-critical — silently ignore
        }
    }
}
