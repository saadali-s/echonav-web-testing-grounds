package datastructures;

public class MinHeap<T> {
    
    // An internal class to hold a node and its current distance priority
    public static class HeapElement<T> {
        public INode<T> node;
        public double priority;

        public HeapElement(INode<T> node, double priority) {
            this.node = node;
            this.priority = priority;
        }
    }

    private ArrayList<HeapElement<T>> heap;

    public MinHeap() {
        heap = new ArrayList<>();
    }

    public void insert(INode<T> node, double priority) {
        HeapElement<T> newElement = new HeapElement<>(node, priority);
        heap.add(heap.size(), newElement);
        bubbleUp(heap.size() - 1);
    }

    public HeapElement<T> extractMin() {
        if (heap.isEmpty()) return null;

        HeapElement<T> min = heap.get(0);
        HeapElement<T> last = heap.remove(heap.size() - 1);

        if (!heap.isEmpty()) {
            heap.set(0, last);
            bubbleDown(0);
        }
        return min;
    }

    public boolean isEmpty() {
        return heap.isEmpty();
    }

    private void bubbleUp(int index) {
        int parent = (index - 1) / 2;
        while (index > 0 && heap.get(index).priority < heap.get(parent).priority) {
            swap(index, parent);
            index = parent;
            parent = (index - 1) / 2;
        }
    }

    private void bubbleDown(int index) {
        int size = heap.size();
        while (true) {
            int leftChild = 2 * index + 1;
            int rightChild = 2 * index + 2;
            int smallest = index;

            if (leftChild < size && heap.get(leftChild).priority < heap.get(smallest).priority) {
                smallest = leftChild;
            }
            if (rightChild < size && heap.get(rightChild).priority < heap.get(smallest).priority) {
                smallest = rightChild;
            }

            if (smallest != index) {
                swap(index, smallest);
                index = smallest;
            } else {
                break;
            }
        }
    }

    private void swap(int i, int j) {
        HeapElement<T> temp = heap.get(i);
        heap.set(i, heap.get(j));
        heap.set(j, temp);
    }
}