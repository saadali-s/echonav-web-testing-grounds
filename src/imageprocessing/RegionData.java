package imageprocessing;

public class RegionData {
    private int gridX;
    private int gridY;
    
    private double averageBrightness;
    private double gradientIntensity;
    
    private boolean isVessel;
    private boolean isAnomaly; 

    public RegionData(int gridX, int gridY, double averageBrightness) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.averageBrightness = averageBrightness;
        this.gradientIntensity = 0.0;
        this.isVessel = false; 
        this.isAnomaly = false;
    }

    public int getGridX() { return gridX; }
    public int getGridY() { return gridY; }
    public double getAverageBrightness() { return averageBrightness; }
    public double getGradientIntensity() { return gradientIntensity; }
    
    public boolean isVessel() { return isVessel; }
    public boolean isAnomaly() { return isAnomaly; }
    
    public void setVessel(boolean vessel) { this.isVessel = vessel; }
    public void setAnomaly(boolean anomaly) { this.isAnomaly = anomaly; }
    public void setGradientIntensity(double gradientIntensity) { this.gradientIntensity = gradientIntensity; }
}