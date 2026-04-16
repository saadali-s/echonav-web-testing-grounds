package datastructures;

import java.util.Iterator;
import java.util.NoSuchElementException;

public class ArrayListIterator<T> implements Iterator<T> {
	private ArrayList<T> list;
	private int cursor;
	
	public ArrayListIterator(ArrayList<T> list) {
		this.list = list;
		if (!list.isEmpty()) {
			this.cursor = 0;
		}
	}
	
	@Override
	public boolean hasNext() {
		return cursor < list.size();
	}

	@Override
	public T next() {
		if (!hasNext()) {
			throw new NoSuchElementException("No more elements in the list");
		}
		T item = list.get(cursor);
		cursor++;
		return item;
	}

	@Override
	public void remove() {
		//do nothing - keep java happy
	}
}