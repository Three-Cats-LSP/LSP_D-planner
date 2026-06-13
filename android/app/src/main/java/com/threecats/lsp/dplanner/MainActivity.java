package com.threecats.lsp.dplanner;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Edge-to-edge: let app draw behind status & nav bars
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

        // Set status bar icon color based on saved theme preference
        applyStatusBarIconColor();
    }

    @Override
    protected void onResume() {
        super.onResume();
        applyStatusBarIconColor();
    }

    private void applyStatusBarIconColor() {
        try {
            Window window = getWindow();
            View decorView = window.getDecorView();
            WindowInsetsControllerCompat insetsController =
                new WindowInsetsControllerCompat(window, decorView);

            // Read saved theme from app SharedPreferences (set by JS via localStorage bridge)
            // localStorage key: 'diveTheme', value: 'light' or 'dark'
            SharedPreferences prefs = getSharedPreferences("CapacitorStorage", MODE_PRIVATE);
            String theme = prefs.getString("diveTheme", "dark");
            boolean isLight = "light".equals(theme);

            // APPEARANCE_LIGHT_STATUS_BARS = dark icons (for light backgrounds)
            insetsController.setAppearanceLightStatusBars(isLight);
        } catch (Exception e) {
            // Silently ignore — non-critical
        }
    }
}
