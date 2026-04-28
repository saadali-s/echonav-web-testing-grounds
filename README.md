# RetinaGraph: Diabetic Retinopathy Diagnostic Pipeline

A native-Java, offline computer vision and machine learning pipeline that extracts topological vascular features from fundus images to diagnose Proliferative Diabetic Retinopathy (PDR). 

This project was built from scratch without third-party computer vision libraries (e.g., OpenCV) using custom matrix math, morphological skeletonization, and custom graph-theory data structures.

---

##  Phase 1: Dataset Setup (Kaggle)

To run the batch processor and train the machine learning model, you must download the **APTOS 2019 Blindness Detection** dataset from Kaggle. 

**Dataset URL:** [Kaggle APTOS 2019 Data](https://www.kaggle.com/c/aptos2019-blindness-detection/data)

1. Download the `train_images` folder (~8GB). Extract this folder somewhere safe on your local drive.
2. Download the `train.csv` file from the same link. This contains the `id_code` and the `diagnosis` (0-4) for each image.
3. *Note:* You do not need to download the test images for this pipeline.

---

##  Phase 2: Machine Learning Setup (Weka)

This project uses **Weka** as its machine learning engine to train a Random Forest classifier on our extracted topological features. You must link the Weka library to your Java IDE.

**Weka Download URL:** [Weka Releases (waikato.github.io)](https://waikato.github.io/weka-wiki/downloading_weka/)

1. Scroll down to the **Stable version** -> **Other platforms** section.
2. Click to download the zip archive: `weka-3-8-7.zip` (Do NOT download the Windows `.exe` installer).
3. Extract the ZIP file. Inside the extracted folder, locate the file named **`weka.jar`**.

**How to add to Eclipse Build Path:**
1. Right-click your project folder in the Eclipse Package Explorer.
2. Select **Build Path** -> **Configure Build Path...**
3. Click the **Libraries** tab, select **Classpath**, and click **Add External JARs...**
4. Select your extracted `weka.jar` file and click **Apply and Close**.

---

##  Phase 3: Running the Pipeline

The project is split into three execution stages. They must be run in the following order:

### 1. Data Extraction (`pipeline.BatchProcessor.java`)
Run this script to process the entire Kaggle dataset. 
* A prompt will ask you to select the `train_images` folder and the `train.csv` file you downloaded in Phase 1.
* It will perform image morphology, build the vascular graphs, count PDR loops, and measure tortuosity.
* **Output:** Generates `training_features.csv` in your project root. *(Note: Processing 3,600+ images will take some time).*

### 2. Model Training (`pipeline.ModelTrainer.java`)
Run this script once the batch processor finishes.
* It ingests `training_features.csv`, applies an 80/20 Train/Test split, and trains a 100-tree Random Forest model.
* It will output a confusion matrix and accuracy metrics to the console.
* **Output:** Freezes and saves the trained brain as `retina_model.model`.

### 3. Live Diagnostics UI (`gui.MainFrame.java`)
Run this to launch the graphical user interface.
* Click **Load Single Scan** to select a new fundus image.
* Execute the extraction and anomaly scans.
* Click **Execute Weka ML** to instantly pass the extracted features to your `retina_model.model` and receive a 0-4 diagnosis prediction on screen.

---

##  Architectural Features Extracted
The pipeline converts raw pixels into the following four mathematical features for Weka:
1. **Vascular Node Count:** Total structural junctions in the vascular network.
2. **k-NN Lesion Count:** A custom min-heap similarity scanner isolating red/bright lesions from healthy tissue.
3. **PDR Cycle Nets:** Uses Euler's Characteristic ($Cycles = E - V + C$) on the planar graph to count abnormal neovascular capillary loops.
4. **Dijkstra Tortuosity Index (TI):** Uses a Breadth-First Search (BFS) radar to find graph endpoints, then uses Dijkstra's Algorithm to measure absolute vessel arc-length against Euclidean chord length to detect chaotic, winding vessels.