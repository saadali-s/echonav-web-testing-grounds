package pipeline;

import weka.classifiers.Classifier;
import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instances;
import weka.core.SerializationHelper;
import java.util.ArrayList;

public class RetinaClassifier {
    
    private Classifier randomForest;
    private Instances datasetStructure;

    public RetinaClassifier(String modelPath) {
        try {
            // 1. Load the frozen Weka brain
            randomForest = (Classifier) SerializationHelper.read(modelPath);
            
            // 2. Recreate the exact CSV headers so Weka understands the incoming numbers
            ArrayList<Attribute> attributes = new ArrayList<>();
            attributes.add(new Attribute("VascularNodes"));
            attributes.add(new Attribute("LesionCount"));
            attributes.add(new Attribute("PDRCycles"));
            attributes.add(new Attribute("TortuosityIndex"));
            
            // Define the 5 possible Kaggle outcomes
            ArrayList<String> classValues = new ArrayList<>();
            classValues.add("0");
            classValues.add("1");
            classValues.add("2");
            classValues.add("3");
            classValues.add("4");
            attributes.add(new Attribute("Diagnosis", classValues));

            // Create a blank dataset with these headers to act as a template
            datasetStructure = new Instances("LivePrediction", attributes, 0);
            datasetStructure.setClassIndex(datasetStructure.numAttributes() - 1);
            
        } catch (Exception e) {
            System.out.println("CRITICAL ERROR: Could not load Weka model! Make sure retina_model.model is in your project folder.");
            e.printStackTrace();
        }
    }

    public String predictDiagnosis(int nodes, int lesions, int cycles, double ti) {
        try {
            // Create a new blank instance matching our template
            DenseInstance instance = new DenseInstance(5);
            instance.setDataset(datasetStructure);
            
            // Slot your GUI numbers into the Weka instance
            instance.setValue(0, nodes);
            instance.setValue(1, lesions);
            instance.setValue(2, cycles);
            instance.setValue(3, ti);
            
            // Ask the Random Forest to predict the final index
            double predictionIndex = randomForest.classifyInstance(instance);
            
            // Map the mathematical index back to the clinical Grade string (0, 1, 2, 3, or 4)
            return datasetStructure.classAttribute().value((int) predictionIndex);
            
        } catch (Exception e) {
            e.printStackTrace();
            return "Error";
        }
    }
}