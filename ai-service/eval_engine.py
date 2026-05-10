import os
import csv
import json
import time
import cv2
import logging
from datetime import datetime
from typing import List, Dict

# Import existing logic from ocr module
from ocr.preprocessing import preprocess_image
from ocr.enhancement import enhance_image
from ocr.extractor import extract_text
from ocr.cer_calculator import calculate_cer

# Setup Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("EvalEngine")

class EvalEngine:
    """
    Automated Evaluation Engine for OCR & CER performance measurement.
    Designed for Skripsi/Research documentation.
    """
    
    def __init__(self, base_path: str = "eval_data"):
        self.base_path = base_path
        self.images_path = os.path.join(base_path, "images")
        self.gt_path = os.path.join(base_path, "ground_truth")
        self.output_path = os.path.join(base_path, "results")
        
        # Ensure directories exist
        os.makedirs(self.images_path, exist_ok=True)
        os.makedirs(self.gt_path, exist_ok=True)
        os.makedirs(self.output_path, exist_ok=True)

    def run_evaluation(self, use_enhancement: bool = True):
        """
        Run OCR on all images and compare with ground truth.
        """
        logger.info(f"Starting Evaluation. Mode: {'Enhanced' if use_enhancement else 'Base'}")
        
        image_files = [f for f in os.listdir(self.images_path) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff'))]
        
        if not image_files:
            logger.warning(f"No images found in {self.images_path}. Please add test images.")
            return
            
        results = []
        total_cer = 0
        count = 0
        
        for filename in image_files:
            file_base = os.path.splitext(filename)[0]
            img_path = os.path.join(self.images_path, filename)
            gt_file = os.path.join(self.gt_path, f"{file_base}.txt")
            
            if not os.path.exists(gt_file):
                logger.warning(f"Ground truth not found for {filename}. Skipping...")
                continue
                
            with open(gt_file, 'r', encoding='utf-8') as f:
                ground_truth = f.read().strip()
            
            # 1. OCR Process
            start_time = time.time()
            try:
                if use_enhancement:
                    img = cv2.imread(img_path)
                    processed, _ = enhance_image(img)
                else:
                    processed, _ = preprocess_image(img_path)
                
                ocr_text, confidence = extract_text(processed)
                processing_time = time.time() - start_time
                
                # 2. CER Calculation
                cer, metrics = calculate_cer(ground_truth, ocr_text)
                
                result = {
                    "filename": filename,
                    "ground_truth_len": len(ground_truth),
                    "ocr_text_len": len(ocr_text),
                    "cer": round(cer, 2),
                    "accuracy": round(metrics['accuracy'], 2),
                    "confidence": round(confidence, 2),
                    "processing_time": round(processing_time, 3),
                    "substitutions": metrics['operations']['substitutions'],
                    "deletions": metrics['operations']['deletions'],
                    "insertions": metrics['operations']['insertions']
                }
                
                results.append(result)
                total_cer += cer
                count += 1
                
                logger.info(f"Analyzed {filename}: CER={cer:.2f}% | Conf={confidence:.2f}%")
                
            except Exception as e:
                logger.error(f"Error processing {filename}: {e}")
        
        if count > 0:
            avg_cer = total_cer / count
            self.save_results(results, avg_cer, use_enhancement)
            logger.info(f"Evaluation Complete! Average CER: {avg_cer:.2f}%")
        else:
            logger.error("No valid data processed.")

    def save_results(self, results: List[Dict], avg_cer: float, enhanced: bool):
        """
        Save evaluation results to CSV and JSON.
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        suffix = "enhanced" if enhanced else "base"
        
        # Save CSV
        csv_file = os.path.join(self.output_path, f"eval_report_{suffix}_{timestamp}.csv")
        keys = results[0].keys()
        with open(csv_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            writer.writerows(results)
            
        # Save Summary JSON
        summary = {
            "timestamp": timestamp,
            "mode": "Enhanced" if enhanced else "Base",
            "total_files": len(results),
            "average_cer": round(avg_cer, 2),
            "average_accuracy": round(100 - avg_cer, 2),
            "details": results
        }
        
        json_file = os.path.join(self.output_path, f"summary_{suffix}_{timestamp}.json")
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=4)
            
        logger.info(f"Report saved to {csv_file}")

    def generate_dummy_data(self):
        """
        Helper to create example structure for testing.
        """
        # This is just for demonstration if folders are empty
        with open(os.path.join(self.gt_path, "sample1.txt"), "w") as f:
            f.write("CONTOH GROUND TRUTH DATA ALUMNI")
        logger.info("Generated dummy ground truth. Please add sample1.jpg to eval_data/images")

if __name__ == "__main__":
    engine = EvalEngine()
    
    # Run evaluation for both modes to compare
    print("\n--- Running Base OCR Evaluation ---")
    engine.run_evaluation(use_enhancement=False)
    
    print("\n--- Running Enhanced OCR Evaluation ---")
    engine.run_evaluation(use_enhancement=True)
