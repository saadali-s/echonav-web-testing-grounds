package datastructures;

import java.util.Arrays;

public class Matrix implements IMatrix {
    
    private double[][] data;
    private int rows;
    private int cols;
    
    public Matrix() {
        this.rows = 0;
        this.cols = 0;
        this.data = new double[0][0];
    }
    
    public Matrix(int rows, int cols) {
        this.rows = rows;
        this.cols = cols;
        this.data = new double[rows][cols];
    }
    
    @Override
    public int numberRows() { return rows; }
    
    @Override
    public int numberCols() { return cols; }
    
    @Override
    public IMatrix getRow(int i) throws MatrixException {
        if (i < 0 || i >= rows) throw new MatrixException("Invalid row index");
        Matrix result = new Matrix(1, cols);
        for (int j = 0; j < cols; j++) result.data[0][j] = data[i][j];
        return result;
    }
    
    @Override
    public IMatrix getCol(int j) throws MatrixException {
        if (j < 0 || j >= cols) throw new MatrixException("Invalid column index");
        Matrix result = new Matrix(rows, 1);
        for (int i = 0; i < rows; i++) result.data[i][0] = data[i][j];
        return result;
    }
    
    @Override
    public double getElement(int i, int j) throws MatrixException {
        if (i < 0 || i >= rows || j < 0 || j >= cols) throw new MatrixException("Index out of bounds");
        return data[i][j];
    }
    
    public void setElement(int i, int j, double value) throws MatrixException {
        if (i < 0 || i >= rows || j < 0 || j >= cols) throw new MatrixException("Index out of bounds");
        data[i][j] = value;
    }
    
    @Override
    public IMatrix addMatrix(IMatrix otherMatrix) throws MatrixException {
        if (rows != otherMatrix.numberRows() || cols != otherMatrix.numberCols()) throw new MatrixException("Dimension mismatch");
        Matrix result = new Matrix(rows, cols);
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) result.data[i][j] = data[i][j] + otherMatrix.getElement(i, j);
        }
        return result;
    }
    
    @Override
    public IMatrix addScalar(double c) {
        Matrix result = new Matrix(rows, cols);
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) result.data[i][j] = data[i][j] + c;
        }
        return result;
    }
    
    @Override
    public IMatrix multiplyScalar(double c) {
        Matrix result = new Matrix(rows, cols);
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) result.data[i][j] = data[i][j] * c;
        }
        return result;
    }
    
    @Override
    public IMatrix multiplyMatrix(IMatrix otherMatrix) throws MatrixException {
        if (cols != otherMatrix.numberRows()) throw new MatrixException("Dimension mismatch");
        Matrix result = new Matrix(rows, otherMatrix.numberCols());
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < otherMatrix.numberCols(); j++) {
                double sum = 0;
                for (int k = 0; k < cols; k++) sum += data[i][k] * otherMatrix.getElement(k, j);
                result.data[i][j] = sum;
            }
        }
        return result;
    }
    
    @Override
    public IMatrix transpose() {
        Matrix result = new Matrix(cols, rows);
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) result.data[j][i] = data[i][j];
        }
        return result;
    }
}