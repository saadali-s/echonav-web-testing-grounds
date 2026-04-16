package datastructures;

public interface IMatrix {
    public int numberRows();
    public int numberCols();
    
    public IMatrix getRow(int i) throws MatrixException;
    public IMatrix getCol(int j) throws MatrixException;
    public double getElement(int i, int j) throws MatrixException;
    
    public IMatrix addMatrix(IMatrix otherMatrix) throws MatrixException;
    public IMatrix addScalar(double c);
    public IMatrix multiplyScalar(double c);
    public IMatrix multiplyMatrix(IMatrix otherMatrix) throws MatrixException;
    public IMatrix transpose();
}