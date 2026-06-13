package com.threecats.lsp.dplanner;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Edge-to-edge: app draws behind status and navigation bars
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    }
}
