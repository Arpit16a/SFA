from datasets import load_dataset

def load_and_process_kisanvaani_dataset():
    # Load the dataset
    dataset = load_dataset("KisanVaani/agriculture-qa-english-only")
    
    print("Dataset info:")
    print(dataset)
    
    # Get the 'train' split
    dataset = dataset['train']
    
    print("\nOriginal column names:")
    print(dataset.column_names)
    
    print("\nSample entry:")
    print(dataset[0])
    
    # Rename columns
    dataset = dataset.rename_column('question', 'input')
    dataset = dataset.rename_column('answers', 'output')
    
    print("\nColumn names after renaming:")
    print(dataset.column_names)
    
    # Manual deduplication
    unique_pairs = set()
    unique_indices = []
    for idx, example in enumerate(dataset):
        pair = (example['input'], example['output'])
        if pair not in unique_pairs:
            unique_pairs.add(pair)
            unique_indices.append(idx)
    
    # Create a new dataset with only unique entries
    deduplicated_dataset = dataset.select(unique_indices)
    
    # Print final dataset info
    print("\nFinal dataset info:")
    print(f"Number of samples before deduplication: {len(dataset)}")
    print(f"Number of samples after deduplication: {len(deduplicated_dataset)}")
    print(f"Column names: {deduplicated_dataset.column_names}")
    print(f"Sample entry: {deduplicated_dataset[0]}")
    
    return deduplicated_dataset

# Load and process the dataset
agriculture_dataset = load_and_process_kisanvaani_dataset()

# Save the processed dataset
agriculture_dataset.save_to_disk("processed_kisanvaani_dataset")

print("\nDataset saved to 'processed_kisanvaani_dataset'")