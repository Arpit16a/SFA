from datasets import Dataset
import json

def load_personalized_dataset():
    # Load personalized Q&A pairs from a JSON file
    with open('personalized_qa.json', 'r') as f:
        custom_qa_pairs = json.load(f)

    return Dataset.from_list(custom_qa_pairs)

def process_and_save_personalized_dataset():
    personalized_dataset = load_personalized_dataset()

    print("\nPersonalized dataset info:")
    print(f"Number of samples: {len(personalized_dataset)}")
    print(f"Column names: {personalized_dataset.column_names}")
    print(f"Sample entry: {personalized_dataset[0]}")

    # Save the processed dataset
    personalized_dataset.save_to_disk("processed_personalized_dataset")

    print("\nDataset saved to 'processed_personalized_dataset'")

if __name__ == '__main__':
    process_and_save_personalized_dataset()