package gui;

import datastructures.IGraph;
import datastructures.INode;
import datastructures.List;
import imageprocessing.RegionData;

import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.image.BufferedImage;

public class MapPanel extends JPanel {

    private IGraph<RegionData> graph;
    private List<INode<RegionData>> activePath;
    private INode<RegionData>[][] nodeGrid;
    private BufferedImage baseImage;
    private JLabel uiInstructionLabel; // Hook to update dashboard text
    
    private int gridRows, gridCols, blockSize;
    private INode<RegionData> startNode = null;
    private INode<RegionData> endNode = null;

    public MapPanel() {
        setBackground(new Color(24, 24, 27)); 
        addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (nodeGrid == null) return;
                int c = e.getX() / blockSize;
                int r = e.getY() / blockSize;
                
                if (r < gridRows && c < gridCols && nodeGrid[r][c] != null) {
                    INode<RegionData> clicked = nodeGrid[r][c];
                    if (SwingUtilities.isLeftMouseButton(e)) {
                        if (startNode == null || endNode != null) {
                            startNode = clicked;
                            endNode = null;
                            activePath = null;
                            if (uiInstructionLabel != null) uiInstructionLabel.setText("Start point (A) set. Click a second vessel to set End (B).");
                        } else {
                            endNode = clicked;
                            if (uiInstructionLabel != null) uiInstructionLabel.setText("Points A and B set. Click 'Measure Tortuosity'.");
                        }
                        repaint();
                    }
                }
            }
        });
    }

    public void setInstructionHook(JLabel label) {
        this.uiInstructionLabel = label;
    }

    public void loadScan(BufferedImage image) {
        this.baseImage = image;
        this.graph = null;
        this.nodeGrid = null;
        repaint();
    }

    public void setGraphData(IGraph<RegionData> graph, INode<RegionData>[][] nodeGrid, int rows, int cols, int size) {
        this.graph = graph;
        this.nodeGrid = nodeGrid;
        this.gridRows = rows;
        this.gridCols = cols;
        this.blockSize = size;
        this.startNode = null;
        this.endNode = null;
        this.activePath = null;
        repaint();
    }

    public void setActivePath(List<INode<RegionData>> path) {
        this.activePath = path;
        repaint();
    }
    
    public INode<RegionData> getStartNode() { return startNode; }
    public INode<RegionData> getEndNode() { return endNode; }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2d = (Graphics2D) g;
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        if (baseImage != null) {
            g2d.drawImage(baseImage, 0, 0, baseImage.getWidth(), baseImage.getHeight(), null);
        }

        if (graph == null || nodeGrid == null) return;

        // 1. Draw Vessels and Anomalies
        g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 0.5f)); 
        for (int r = 0; r < gridRows; r++) {
            for (int c = 0; c < gridCols; c++) {
                INode<RegionData> node = nodeGrid[r][c];
                if (node == null) continue;

                int x = c * blockSize;
                int y = r * blockSize;

                if (node.getData().isAnomaly()) {
                    g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 0.9f));
                    g2d.setColor(new Color(239, 68, 68)); // Crimson
                    g2d.fillOval(x - (blockSize/2), y - (blockSize/2), blockSize * 2, blockSize * 2); 
                    g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 0.5f));
                } else if (node.getData().isVessel()) {
                    g2d.setColor(new Color(16, 185, 129)); // Teal
                    g2d.fillRect(x, y, blockSize, blockSize);
                }
            }
        }

        // 2. Draw Dijkstra Path
        g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 1.0f));
        if (activePath != null && activePath.size() > 0) {
            g2d.setColor(new Color(56, 189, 248)); // Neon Cyan
            g2d.setStroke(new BasicStroke(3));
            for (int i = 0; i < activePath.size() - 1; i++) {
                RegionData d1 = activePath.get(i).getData();
                RegionData d2 = activePath.get(i+1).getData();
                g2d.drawLine(d1.getGridX() * blockSize + (blockSize/2), d1.getGridY() * blockSize + (blockSize/2),
                             d2.getGridX() * blockSize + (blockSize/2), d2.getGridY() * blockSize + (blockSize/2));
            }
        }

        // 3. Draw High-Visibility Beacons
        if (startNode != null) drawBeacon(g2d, startNode.getData(), "A", new Color(34, 197, 94));
        if (endNode != null) drawBeacon(g2d, endNode.getData(), "B", new Color(239, 68, 68));
    }

    private void drawBeacon(Graphics2D g2d, RegionData data, String label, Color color) {
        int x = data.getGridX() * blockSize + (blockSize/2);
        int y = data.getGridY() * blockSize + (blockSize/2);
        int r = 12; // Beacon Radius
        
        g2d.setColor(color);
        g2d.fillOval(x - r, y - r - 15, r * 2, r * 2); // Floating circle
        
        // Pin pointer
        int[] xPoints = {x - 4, x + 4, x};
        int[] yPoints = {y - 6, y - 6, y};
        g2d.fillPolygon(xPoints, yPoints, 3);
        
        g2d.setColor(Color.WHITE);
        g2d.setFont(new Font("SansSerif", Font.BOLD, 14));
        g2d.drawString(label, x - 5, y - 9);
    }
}