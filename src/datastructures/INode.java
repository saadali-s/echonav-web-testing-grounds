package datastructures;

public interface INode<T> {
    // Returns the data stored in this node (e.g., color, coordinates)
    public T getData();
    
    // Updates the data in this node
    public void setData(T data);
}