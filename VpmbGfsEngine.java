import java.util.ArrayList;
import java.util.List;

/**
 * VpmbGfsEngine - VPM-B + Buhlmann GFS hybrid decompression engine
 */
public class VpmbGfsEngine {

    private static final double ATM = 101325.0;
    private static final double WATER_VAPOR_PRESSURE = 6270.0;
    private static final double SURFACE_TENSION_GAMMA = 0.0154;
    private static final double SKIN_COMPRESSION_GAMMAC = 0.257;
    private static final double CRIT_VOLUME_LAMBDA = 0.00418;
    private static final int NUM_COMPARTMENTS = 16;

    public static class GasMix {
        public final double fO2, fHe, fN2;
        public final String name;
        public GasMix(double o2, double he, String name) {
            this.fO2=o2; this.fHe=he; this.fN2=1.0-o2-he; this.name=name;
        }
    }

    private static class Compartment {
        final double halfTimeN2, halfTimeHe, buhlmannA, buhlmannB;
        double pN2, pHe, maxCrushPN2, r0N2, allowableGradN2, initialAllowableGradN2;
        Compartment(double htN2, double htHe, double a, double b) {
            this.halfTimeN2=htN2; this.halfTimeHe=htHe; this.buhlmannA=a; this.buhlmannB=b;
            this.pN2=(ATM-WATER_VAPOR_PRESSURE)*0.79; this.pHe=0; this.r0N2=0.8e-6;
        }
        void updateGasLoading(double d1, double d2, double t, GasMix gas) {
            double p1=1+d1/10.0, p2=1+d2/10.0;
            double pN2s=(p1*100000-WATER_VAPOR_PRESSURE)*gas.fN2, pN2e=(p2*100000-WATER_VAPOR_PRESSURE)*gas.fN2;
            double pHes=(p1*100000-WATER_VAPOR_PRESSURE)*gas.fHe, pHee=(p2*100000-WATER_VAPOR_PRESSURE)*gas.fHe;
            double kN2=Math.log(2)/halfTimeN2, kHe=Math.log(2)/halfTimeHe;
            this.pN2=sch(pN2s,pN2e,t,kN2,this.pN2); this.pHe=sch(pHes,pHee,t,kHe,this.pHe);
        }
        private double sch(double ps, double pe, double t, double k, double pi) {
            double r=(pe-ps)/t;
            return r!=0 ? ps+r*(t-1/k)+(pi-ps+r/k)*Math.exp(-k*t) : ps+(pi-ps)*Math.exp(-k*t);
        }
    }

    private final List<Compartment> compartments = new ArrayList<>(NUM_COMPARTMENTS);
    private final double gfHigh;

    public VpmbGfsEngine(double gfHighSetting) {
        this.gfHigh = gfHighSetting;
        double[] HT_N2={5,8,12.5,18.5,27,38.3,54.3,77,109,146,187,239,305,390,498,635};
        double[] HT_HE={1.88,3.02,4.72,6.99,10.21,14.48,20.53,29.11,41.2,55.19,70.69,90.34,115.29,147.42,188.24,240.03};
        double[] A={1.2599,1.0,0.8618,0.7562,0.6667,0.5933,0.5282,0.4701,0.4187,0.3798,0.3497,0.3223,0.2971,0.2737,0.2523,0.2137};
        double[] B={0.505,0.6514,0.7222,0.7825,0.8125,0.8434,0.8693,0.891,0.9092,0.9222,0.9319,0.9403,0.9477,0.9544,0.9602,0.9707};
        for (int i=0;i<NUM_COMPARTMENTS;i++) compartments.add(new Compartment(HT_N2[i],HT_HE[i],A[i],B[i]));
    }

    public void executeBottomPhase(double maxDepth, double bt, GasMix gas) {
        for (Compartment c:compartments) { c.updateGasLoading(0,maxDepth,2,gas); c.updateGasLoading(maxDepth,maxDepth,bt,gas); }
        double maxAmb=(1+maxDepth/10.0)*100000;
        for (Compartment c:compartments) {
            double crush=maxAmb-c.pN2;
            if (crush>c.maxCrushPN2) {
                c.maxCrushPN2=crush;
                c.r0N2=1.0/((1.0/0.8e-6)+(c.maxCrushPN2/(2.0*(SKIN_COMPRESSION_GAMMAC-SURFACE_TENSION_GAMMA))));
            }
            c.initialAllowableGradN2=(2*SURFACE_TENSION_GAMMA*(SKIN_COMPRESSION_GAMMAC-SURFACE_TENSION_GAMMA))/(c.r0N2*SKIN_COMPRESSION_GAMMAC);
            c.allowableGradN2=c.initialAllowableGradN2;
        }
    }

    private double getCeilingMeters(double ambPa, double stopT) {
        double maxVpm=ATM, maxBuhl=ATM;
        for (Compartment c:compartments) {
            double lo=0,hi=c.initialAllowableGradN2,ag=c.allowableGradN2;
            for (int j=0;j<25;j++) {
                double ef=ATM/ambPa, ar=c.r0N2*Math.cbrt(ef), cv=(ag*stopT)/(ar*ATM), err=cv-CRIT_VOLUME_LAMBDA;
                if (Math.abs(err)<1) break;
                if (err>0) hi=ag; else lo=ag; ag=(lo+hi)/2;
            }
            c.allowableGradN2=ag;
            double vp=c.pN2+c.pHe-ag; if (vp>maxVpm) maxVpm=vp;
            double tb=(c.pN2+c.pHe)/100000, cb=(tb-c.buhlmannA*gfHigh)/(gfHigh/c.buhlmannB+1-gfHigh);
            double bp=cb*100000; if (bp>maxBuhl) maxBuhl=bp;
        }
        return Math.max(0,(Math.max(maxVpm,maxBuhl)-ATM)/10000);
    }

    public void generateAscentSchedule(double startDepth, GasMix bottomGas, GasMix decoGas, double switchDepth) {
        System.out.println("=== VPM-B/GFS Ascent Schedule ===");
        double cur=startDepth; GasMix gas=bottomGas; boolean sw=false;
        while (cur>0) {
            if (!sw && cur<=switchDepth) { gas=decoGas; sw=true; System.out.println("Gas switch at "+cur+"m -> "+gas.name); }
            double next=Math.max(0,Math.floor((cur-0.1)/3)*3);
            for (Compartment c:compartments) c.updateGasLoading(cur,next,(cur-next)/10.0,gas);
            cur=next; if (cur==0) break;
            int stop=0;
            for (int g=0;g<120;g++) {
                if (getCeilingMeters((1+cur/10.0)*100000,1)>(cur-3)) { stop++; for (Compartment c:compartments) c.updateGasLoading(cur,cur,1,gas); } else break;
            }
            if (stop>0) System.out.printf("%.0fm  %d min  %s%n",cur,stop,gas.name);
        }
        System.out.println("Surface - complete.");
    }

    public static void main(String[] args) {
        VpmbGfsEngine e=new VpmbGfsEngine(0.90);
        GasMix bottom=new GasMix(0.16,0.50,"Trimix 16/50"), deco=new GasMix(0.50,0,"Nitrox 50%");
        e.executeBottomPhase(60,30,bottom);
        e.generateAscentSchedule(60,bottom,deco,21);
    }
}
