package datastructures;

public class AdjacencyListGraph<T> implements IGraph<T> {

    // We use your custom ArrayList to hold all the nodes in the map!
    private ArrayList<INode<T>> nodes;

    public AdjacencyListGraph() {
        this.nodes = new ArrayList<INode<T>>();
    }

    @Override
    public INode<T> addNode(T data) {
        GraphNode<T> newNode = new GraphNode<>(data);
        // Add to the end of our list
        nodes.add(nodes.size(), newNode);
        return newNode;
    }

    @Override
    public void addEdge(INode<T> source, INode<T> destination, double weight) {
        // We cast to GraphNode because we need access to that secret 'edges' list we made
        GraphNode<T> srcNode = (GraphNode<T>) source;
        
        // Create the new connection and add it to the source's personal list
        Edge<T> newEdge = new Edge<>(destination, weight);
        srcNode.getEdges().add(srcNode.getEdges().size(), newEdge);
        
        // Note: This is a DIRECTED edge. If we want an UNDIRECTED graph (like a road where 
        // you can drive both ways), we would add the reverse edge here too. 
        // For RuralRoute SA, let's make it undirected so the ambulance can drive back!
        GraphNode<T> destNode = (GraphNode<T>) destination;
        Edge<T> reverseEdge = new Edge<>(source, weight);
        destNode.getEdges().add(destNode.getEdges().size(), reverseEdge);
    }

    @Override
    public List<INode<T>> getNodes() {
        return nodes;
    }

    @Override
    public List<INode<T>> getNeighbors(INode<T> node) {
        GraphNode<T> gNode = (GraphNode<T>) node;
        ArrayList<INode<T>> neighbors = new ArrayList<>();
        
        // Loop through the edges and pull out just the destination nodes
        for (int i = 0; i < gNode.getEdges().size(); i++) {
            neighbors.add(neighbors.size(), gNode.getEdges().get(i).getDestination());
        }
        return neighbors;
    }

    @Override
    public double getEdgeWeight(INode<T> source, INode<T> destination) {
        GraphNode<T> srcNode = (GraphNode<T>) source;
        
        // Search through the source's edges to find the one pointing to the destination
        for (int i = 0; i < srcNode.getEdges().size(); i++) {
            Edge<T> edge = srcNode.getEdges().get(i);
            if (edge.getDestination().equals(destination)) {
                return edge.getWeight();
            }
        }
        // If no edge exists, the cost to travel there is infinity!
        return Double.MAX_VALUE; 
    }

    @Override
    public boolean removeNode(INode<T> node) {
        // Removing a node from an Adjacency List is complex because you have to 
        // find and delete all edges pointing TO it first. 
        // For our RuralRoute map, we actually never delete land blocks, we just 
        // change their weight to infinity. So we can leave this unimplemented for now!
        throw new UnsupportedOperationException("Nodes are permanent on the map!");
    }

    @Override
    public boolean removeEdge(INode<T> source, INode<T> destination) {
        throw new UnsupportedOperationException("Edges are permanent on the map!");
    }
}