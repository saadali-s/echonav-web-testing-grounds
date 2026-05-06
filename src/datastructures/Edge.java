package datastructures;

public class Edge<T> {
    private INode<T> destination;
    private double weight;

    public Edge(INode<T> destination, double weight) {
        this.destination = destination;
        this.weight = weight;
    }

    public INode<T> getDestination() {
        return destination;
    }

    public double getWeight() {
        return weight;
    }
}