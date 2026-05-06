package datastructures;


public interface IGraph<T> {
    // Create (Add)
    public INode<T> addNode(T data);
    public void addEdge(INode<T> source, INode<T> destination, double weight);
    
    // Read (Get)
    public List<INode<T>> getNodes();
    public List<INode<T>> getNeighbors(INode<T> node);
    public double getEdgeWeight(INode<T> source, INode<T> destination);
    
    // Update/Delete (Remove)
    public boolean removeNode(INode<T> node);
    public boolean removeEdge(INode<T> source, INode<T> destination);
}