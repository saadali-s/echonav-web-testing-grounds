package datastructures;

public class GraphNode<T> implements INode<T> {
    private T data;
    // This is the magic of the Adjacency List! 
    // Every node holds a list of the edges connected to it.
    private ArrayList<Edge<T>> edges; 

    public GraphNode(T data) {
        this.data = data;
        this.edges = new ArrayList<Edge<T>>();
    }

    @Override
    public T getData() {
        return data;
    }

    @Override
    public void setData(T data) {
        this.data = data;
    }

    // A getter specific to our implementation so the Graph can access the connections
    public ArrayList<Edge<T>> getEdges() {
        return edges;
    }
}