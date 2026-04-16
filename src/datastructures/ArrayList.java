package datastructures;

import java.util.Iterator;

public class ArrayList<T> implements List<T>, Iterable<T> {

	private T[] array;
	private Integer size;
	private Integer arrayLength;
	private Integer strategy;
	
	public ArrayList() {
		this(1);
	}
	
	public ArrayList(Integer strategy) {
		this.strategy = strategy;
		this.arrayLength = 1;
		this.array = createArray(this.arrayLength);
		this.size = 0;
	}
	
	@SuppressWarnings("unchecked")
	private T[] createArray(int size) {
		return (T[]) new Object[size];
	}
	
	@Override
	public T get(Integer i) {
		if (i >= size) {
			throw new ArrayListException("Index greater than size");
		}
		if (i < 0) {
			throw new ArrayListException("Index out of range");
		}
		return array[i];
	}

	@Override
	public void set(Integer i, T e) {
		if (i >= size) {
			throw new ArrayListException("Index greater than size");
		}
		if (i < 0) {
			throw new ArrayListException("Index out of range");
		}
		array[i] = e;
	}

	@Override
	public void add(Integer i, T e) {
		if (i < 0 || i > size) {
			throw new ArrayListException("Index out of range");
		}
		if (size >= arrayLength) {
			expandArray();
		}
		shiftElementsRight(i);
		array[i] = e;
		size++;
	}

	@Override
	public T remove(Integer i) {
		if (i < 0 || i >= size) {
			throw new ArrayListException("Index out of range");
		}
		
		T elementToRemove = array[i];
		shiftElementsLeft(i);
		size--;
		
		return elementToRemove;
	}

	@Override
	public Integer size() {
		return size;
	}

	@Override
	public boolean isEmpty() {
		return size == 0;
	}
	
	public String toString() {
		String str = "[";
		for (int i = 0; i < size-1; i++) {
			str += array[i].toString() + ",";
		}
		if (size > 0) {
			str += array[size-1];
		}
		str += "]";
		return str;
	}
	
	private void expandArray() {
		if (strategy == 1) {
			this.arrayLength += 10; 
		} else if (strategy == 2) {
			this.arrayLength *= 2;
		}
		
		T[] newArray = createArray(this.arrayLength);
		System.arraycopy(this.array, 0, newArray, 0, this.size); 
		this.array = newArray;
	}
	
	private void shiftElementsRight(Integer pos) {
		for (int i = this.size - 1; i >= pos; i--) {
			this.array[i+1] = this.array[i];
		}
	}
	
	private void shiftElementsLeft(Integer pos) {
		for (int i = pos; i < size - 1; i++) {
			this.array[i] = this.array[i+1];
		}
		if (size > 0) {
			this.array[size - 1] = null; 
		}
	}

	@Override
	public Iterator<T> iterator() {		
		return new ArrayListIterator<T>(this);
	}
}