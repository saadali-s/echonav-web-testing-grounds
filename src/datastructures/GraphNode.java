package datastructures;

public class GraphNode<T> implements INode<T> {
    private T data;
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

    public ArrayList<Edge<T>> getEdges() {
        return edges;
    }
}