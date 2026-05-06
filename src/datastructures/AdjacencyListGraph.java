package datastructures;

public class AdjacencyListGraph<T> implements IGraph<T> {

    private ArrayList<INode<T>> nodes;

    public AdjacencyListGraph() {
        this.nodes = new ArrayList<INode<T>>();
    }

    @Override
    public INode<T> addNode(T data) {
        GraphNode<T> newNode = new GraphNode<>(data);
        nodes.add(nodes.size(), newNode);
        return newNode;
    }

    @Override
    public void addEdge(INode<T> source, INode<T> destination, double weight) {
        GraphNode<T> srcNode = (GraphNode<T>) source;

        Edge<T> newEdge = new Edge<>(destination, weight);
        srcNode.getEdges().add(srcNode.getEdges().size(), newEdge);

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

        for (int i = 0; i < gNode.getEdges().size(); i++) {
            neighbors.add(neighbors.size(), gNode.getEdges().get(i).getDestination());
        }
        return neighbors;
    }

    @Override
    public double getEdgeWeight(INode<T> source, INode<T> destination) {
        GraphNode<T> srcNode = (GraphNode<T>) source;

        for (int i = 0; i < srcNode.getEdges().size(); i++) {
            Edge<T> edge = srcNode.getEdges().get(i);
            if (edge.getDestination().equals(destination)) {
                return edge.getWeight();
            }
        }
        return Double.MAX_VALUE; 
    }

    @Override
    public boolean removeNode(INode<T> node) {
        throw new UnsupportedOperationException("Nodes are permanent on the map!");
    }

    @Override
    public boolean removeEdge(INode<T> source, INode<T> destination) {
        throw new UnsupportedOperationException("Edges are permanent on the map!");
    }
}