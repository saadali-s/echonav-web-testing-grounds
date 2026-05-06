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
            randomForest = (Classifier) SerializationHelper.read(modelPath);

            ArrayList<Attribute> attributes = new ArrayList<>();
            attributes.add(new Attribute("VascularNodes"));
            attributes.add(new Attribute("HemorrhageArea"));
            attributes.add(new Attribute("ExudateArea"));
            attributes.add(new Attribute("PDRCycles"));
            attributes.add(new Attribute("TortuosityIndex"));
            attributes.add(new Attribute("Endpoints"));
            attributes.add(new Attribute("BranchPoints"));
            attributes.add(new Attribute("LargestComponent"));
            attributes.add(new Attribute("VesselDensity"));

            ArrayList<String> classValues = new ArrayList<>();
            classValues.add("0");
            classValues.add("1");
            classValues.add("2");
            classValues.add("3");
            classValues.add("4");
            attributes.add(new Attribute("Diagnosis", classValues));

            // Create template with 10 total attributes (9 features + 1 class)
            datasetStructure = new Instances("LivePrediction", attributes, 0);
            datasetStructure.setClassIndex(datasetStructure.numAttributes() - 1);

        } catch (Exception e) {
            System.out.println("CRITICAL ERROR: Could not load Weka model.");
            e.printStackTrace();
        }
    }

    public String predictDiagnosis(int nodes, int hemorrhages, int exudates, int cycles, double ti, 
                                   int endpoints, int branchPoints, int largestComponent, double density) {
        try {
            DenseInstance instance = new DenseInstance(datasetStructure.numAttributes());
            instance.setDataset(datasetStructure);

            instance.setValue(0, nodes);
            instance.setValue(1, hemorrhages);
            instance.setValue(2, exudates);
            instance.setValue(3, cycles);
            instance.setValue(4, ti);
            instance.setValue(5, endpoints);
            instance.setValue(6, branchPoints);
            instance.setValue(7, largestComponent);
            instance.setValue(8, density);

            double predictionIndex = randomForest.classifyInstance(instance);
            return datasetStructure.classAttribute().value((int) predictionIndex);

        } catch (Exception e) {
            e.printStackTrace();
            return "Error";
        }
    }
}