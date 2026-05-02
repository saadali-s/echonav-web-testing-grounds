package pipeline;

import weka.classifiers.Evaluation;
import weka.classifiers.trees.RandomForest;
import weka.core.Instances;
import weka.core.SerializationHelper;
import weka.core.converters.CSVLoader;
import weka.filters.Filter;
import weka.filters.unsupervised.attribute.NumericToNominal;
import weka.filters.unsupervised.attribute.Remove;
import weka.filters.supervised.instance.ClassBalancer;

import java.io.File;
import java.util.Random;

public class ModelTrainer {
    public static void main(String[] args) {
        try {
            System.out.println("1. Loading training_features.csv...");
            CSVLoader loader = new CSVLoader();
            loader.setSource(new File("training_features.csv"));
            Instances data = loader.getDataSet();

            // 2. Erase the 'ImageID' column so the AI doesn't memorize names
            // (Weka uses 1-based indexing for filters, so "1" is the first column)
            System.out.println("2. Filtering out ImageID string data...");
            Remove removeFilter = new Remove();
            removeFilter.setAttributeIndices("1");
            removeFilter.setInputFormat(data);
            data = Filter.useFilter(data, removeFilter);

            // 3. Force Weka to treat the 'Diagnosis' column as Categories, not raw math
            // After removing ImageID, Diagnosis shifts from column 6 to column 5
            System.out.println("3. Converting Diagnoses to Nominal Classes...");
            NumericToNominal nomFilter = new NumericToNominal();
            nomFilter.setAttributeIndices("6");
            nomFilter.setInputFormat(data);
            data = Filter.useFilter(data, nomFilter);

            // Tell Weka which column holds the answers we want to predict (the last one)
            data.setClassIndex(data.numAttributes() - 1);

            // 4. The 80 / 20 Split
            System.out.println("4. Shuffling dataset and splitting 80% Train / 20% Test...");
            data.randomize(new Random(42)); // Seed ensures repeatable tests
            int trainSize = (int) Math.round(data.numInstances() * 0.80);
            int testSize = data.numInstances() - trainSize;
            
            Instances trainData = new Instances(data, 0, trainSize);
            Instances testData = new Instances(data, trainSize, testSize);

            // 5. Build the Random Forest
            System.out.println("5. Training Random Forest (100 Decision Trees)...");
            RandomForest rf = new RandomForest();
            rf.setNumIterations(260);
            rf.buildClassifier(trainData);

            // 6. Administer the Hidden Test
            System.out.println("6. Administering blind test to evaluate accuracy...");
            Evaluation eval = new Evaluation(trainData);
            eval.evaluateModel(rf, testData);

            // Output the formal academic results
            System.out.println("\n=======================================================");
            System.out.println("              WEKA ML EVALUATION RESULTS");
            System.out.println("=======================================================");
            System.out.println(eval.toSummaryString());
            System.out.println(eval.toMatrixString()); // The Confusion Matrix

            // 7. Freeze and save the brain
            System.out.println("7. Saving trained model to 'retina_model.model'...");
            SerializationHelper.write("retina_model.model", rf);
            System.out.println("SUCCESS! Model frozen and ready for live UI integration.");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}