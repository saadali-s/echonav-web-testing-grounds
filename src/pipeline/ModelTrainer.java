package pipeline;

import weka.classifiers.Evaluation;
import weka.classifiers.trees.RandomForest;
import weka.core.Instances;
import weka.core.SerializationHelper;
import weka.core.converters.CSVLoader;
import weka.filters.Filter;
import weka.filters.unsupervised.attribute.NumericToNominal;
import weka.filters.unsupervised.attribute.Remove;

import java.io.File;
import java.util.Random;

public class ModelTrainer {
    public static void main(String[] args) {
        try {
            System.out.println("1. Loading training_features.csv...");
            CSVLoader loader = new CSVLoader();
            loader.setSource(new File("training_features.csv"));
            Instances data = loader.getDataSet();

            System.out.println("2. Filtering out ImageID string data...");
            Remove removeFilter = new Remove();
            removeFilter.setAttributeIndices("1");
            removeFilter.setInputFormat(data);
            data = Filter.useFilter(data, removeFilter);

            System.out.println("3. Converting Diagnoses to Nominal Classes...");
            NumericToNominal nomFilter = new NumericToNominal();
            nomFilter.setAttributeIndices("last"); 
            nomFilter.setInputFormat(data);
            data = Filter.useFilter(data, nomFilter);
            data.setClassIndex(data.numAttributes() - 1);

            System.out.println("\n4. Executing Stratified 10-Fold CV (Champion Random Forest)...");
            
            RandomForest rf = new RandomForest();
            rf.setNumIterations(600); 
            rf.setSeed(42);
            
            Evaluation eval = new Evaluation(data);
            eval.crossValidateModel(rf, data, 10, new Random(42));

            System.out.println("\n=======================================================");
            System.out.println("             WEKA ML EVALUATION RESULTS");
            System.out.println("=======================================================");
            System.out.println(eval.toSummaryString());
            
            System.out.println("5. Training Final Production Model on 100% of Data...");
            rf.buildClassifier(data);

            System.out.println("6. Saving trained model to 'retina_model.model'...");
            SerializationHelper.write("retina_model.model", rf);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}